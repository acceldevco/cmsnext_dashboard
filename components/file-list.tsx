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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

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

export function FileList() {
  const [files, setFiles] = useState(sampleFiles)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const deleteFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
    setSelectedFiles(selectedFiles.filter((fileId) => fileId !== id))
  }

  const toggleFileSelection = (id: string) => {
    setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]))
  }

  const toggleAllFiles = () => {
    setSelectedFiles(selectedFiles.length === files.length ? [] : files.map((file) => file.id))
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox checked={selectedFiles.length === files.length} onCheckedChange={toggleAllFiles} />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => {
            const IconComponent = getFileIcon(file.type)
            const iconColor = getFileColor(file.type)

            return (
              <TableRow key={file.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={() => toggleFileSelection(file.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className={iconColor}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{file.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{file.type}</span>
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell className="text-muted-foreground">{file.modified}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
