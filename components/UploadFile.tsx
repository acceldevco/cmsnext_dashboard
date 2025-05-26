"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
import { Upload, File, ImageIcon, Video, Music, FileText, X, Download } from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  url: string
  type: "image" | "video" | "audio" | "document" | "other"
}

export default function UploadFile({handleChange,name}:any) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const getFileType = (file: File): UploadedFile["type"] => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("audio/")) return "audio"
    if (file.type.includes("pdf") || file.type.includes("document") || file.type.includes("text")) return "document"
    return "other"
  }

  const getFileIcon = (type: UploadedFile["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return

    Array.from(files?.target.files).forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9)
      const url = URL.createObjectURL(file)
      const type = getFileType(file)

      const uploadedFile: UploadedFile = {
        id,
        file,
        url,
        type,
      }

      setUploadedFiles((prev) => [...prev, uploadedFile])
    })
    handleChange(files)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileUpload(e.dataTransfer.files)
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const downloadFile = (file: UploadedFile) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Upload & Display</CardTitle>
          <CardDescription>
            Upload files by clicking the button below or drag and drop them into the upload area.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground">Support for images, videos, audio, documents and more</p>
            </div>
            <div className="mt-4">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" className="pointer-events-none">
                  Choose Files
                </Button>
              </Label>
              <Input
                name={name}
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
            <CardDescription>Preview and manage your uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={uploadedFile.id}>
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {uploadedFile.type === "image" ? (
                        <img
                          src={uploadedFile.url || "/placeholder.svg"}
                          alt={uploadedFile.file.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center">
                          {getFileIcon(uploadedFile.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{uploadedFile.file.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {/* <Badge variant="secondary" className="text-xs">
                              {getFileIcon(uploadedFile.type)}
                              <span className="ml-1">{uploadedFile.type}</span>
                            </Badge> */}
                            <span className="text-sm text-muted-foreground">
                              {formatFileSize(uploadedFile.file.size)}
                            </span>
                          </div>
                          {uploadedFile.file.type && (
                            <p className="text-xs text-muted-foreground mt-1">{uploadedFile.file.type}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => downloadFile(uploadedFile)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(uploadedFile.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {uploadedFile.type === "image" && (
                        <div className="mt-3">
                          <img
                            src={uploadedFile.url || "/placeholder.svg"}
                            alt={uploadedFile.file.name}
                            className="max-w-full h-auto max-h-64 rounded border"
                          />
                        </div>
                      )}

                      {uploadedFile.type === "video" && (
                        <div className="mt-3">
                          <video src={uploadedFile.url} controls className="max-w-full h-auto max-h-64 rounded border">
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}

                      {uploadedFile.type === "audio" && (
                        <div className="mt-3">
                          <audio src={uploadedFile.url} controls className="w-full max-w-md">
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* {index < uploadedFiles.length - 1 && <Separator className="mt-4" />} */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
