"use client"

import { useState } from "react"
import {
  File,
  ImageIcon,
  Video,
  Music,
  Archive,
  FileText,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface FileItem {
  id: string
  name: string
  type: string
  size: string
  modified: string
  thumbnail?: string
}

const sampleFiles: FileItem[] = [
  {
    id: "1",
    name: "project-proposal.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "2 hours ago",
  },
  {
    id: "2",
    name: "dashboard-mockup.png",
    type: "image",
    size: "1.8 MB",
    modified: "1 day ago",
  },
  {
    id: "3",
    name: "presentation.pptx",
    type: "presentation",
    size: "5.2 MB",
    modified: "3 days ago",
  },
  {
    id: "4",
    name: "data-export.xlsx",
    type: "spreadsheet",
    size: "890 KB",
    modified: "1 week ago",
  },
  {
    id: "5",
    name: "demo-video.mp4",
    type: "video",
    size: "45.2 MB",
    modified: "2 weeks ago",
  },
  {
    id: "6",
    name: "source-code.zip",
    type: "archive",
    size: "12.5 MB",
    modified: "1 month ago",
  },
]

function getFileIcon(type: string) {
  switch (type) {
    case "image":
      return ImageIcon
    case "video":
      return Video
    case "audio":
      return Music
    case "archive":
      return Archive
    case "pdf":
    case "document":
    case "spreadsheet":
    case "presentation":
      return FileText
    default:
      return File
  }
}

function getFileColor(type: string) {
  switch (type) {
    case "image":
      return "text-green-600"
    case "video":
      return "text-purple-600"
    case "audio":
      return "text-blue-600"
    case "archive":
      return "text-orange-600"
    case "pdf":
      return "text-red-600"
    case "document":
      return "text-blue-600"
    case "spreadsheet":
      return "text-green-600"
    case "presentation":
      return "text-orange-600"
    default:
      return "text-gray-600"
  }
}

export function FileGrid() {
  const [files, setFiles] = useState(sampleFiles)

  const deleteFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {files.map((file) => {
        const IconComponent = getFileIcon(file.type)
        const iconColor = getFileColor(file.type)

        return (
          <div key={file.id} className="group relative p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
            <div className="flex flex-col items-center space-y-2">
              <div className={`p-3 rounded-lg bg-muted ${iconColor}`}>
                <IconComponent className="w-8 h-8" />
              </div>

              <div className="text-center w-full">
                <p className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">{file.size}</p>
                <p className="text-xs text-muted-foreground">{file.modified}</p>
              </div>

              <Badge variant="secondary" className="text-xs">
                {file.type.toUpperCase()}
              </Badge>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => deleteFile(file.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      })}
    </div>
  )
}
