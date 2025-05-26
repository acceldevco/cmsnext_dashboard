import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { deleteFile } from "@/lib/file-utils"

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileIds } = await request.json()

    if (!fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json({ error: "Invalid file IDs" }, { status: 400 })
    }

    const deletedFiles = []
    const errors = []

    for (const fileId of fileIds) {
      const file = db.files.findById(fileId)
      if (!file || file.userId !== user.id) {
        errors.push(`File ${fileId} not found`)
        continue
      }

      try {
        // Delete physical file
        await deleteFile(file.path)

        // Delete from database
        const deleted = db.files.delete(fileId)

        if (deleted) {
          deletedFiles.push(fileId)
        } else {
          errors.push(`Failed to delete file ${fileId}`)
        }
      } catch (error) {
        errors.push(`Error deleting file ${fileId}: ${error}`)
      }
    }

    return NextResponse.json({
      deletedFiles,
      errors,
      success: errors.length === 0,
    })
  } catch (error) {
    console.error("Error bulk deleting files:", error)
    return NextResponse.json({ error: "Bulk delete failed" }, { status: 500 })
  }
}
