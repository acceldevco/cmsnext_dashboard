"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { deleteFile } from "@/lib/file-utils"

export async function deleteFileAction(fileId: string) {
  try {
    const user = await requireAuth()

    const file = db.files.findById(fileId)
    if (!file || file.userId !== user.id) {
      throw new Error("File not found")
    }

    // Delete physical file
    await deleteFile(file.path)

    // Delete from database
    const deleted = db.files.delete(fileId)

    if (!deleted) {
      throw new Error("Failed to delete file")
    }

    revalidatePath("/admin/files")
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function renameFileAction(fileId: string, newName: string) {
  try {
    const user = await requireAuth()

    if (!newName || typeof newName !== "string") {
      throw new Error("Invalid file name")
    }

    const file = db.files.findById(fileId)
    if (!file || file.userId !== user.id) {
      throw new Error("File not found")
    }

    const updatedFile = db.files.update(fileId, { name: newName })

    if (!updatedFile) {
      throw new Error("Failed to rename file")
    }

    revalidatePath("/admin/files")
    return { success: true, file: updatedFile }
  } catch (error) {
    console.error("Error renaming file:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createFolderAction(name: string, parentId?: string) {
  try {
    const user = await requireAuth()

    if (!name || typeof name !== "string") {
      throw new Error("Invalid folder name")
    }

    // Generate path
    let path = `/${name}`
    if (parentId) {
      const parentFolder = db.folders.findById(parentId)
      if (parentFolder && parentFolder.userId === user.id) {
        path = `${parentFolder.path}/${name}`
      } else {
        throw new Error("Parent folder not found")
      }
    }

    const folder = db.folders.create({
      name,
      path,
      parentId,
      userId: user.id,
    })

    revalidatePath("/admin/files")
    return { success: true, folder }
  } catch (error) {
    console.error("Error creating folder:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function bulkDeleteFilesAction(fileIds: string[]) {
  try {
    const user = await requireAuth()

    if (!fileIds || !Array.isArray(fileIds)) {
      throw new Error("Invalid file IDs")
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

    revalidatePath("/admin/files")
    return {
      success: errors.length === 0,
      deletedFiles,
      errors,
    }
  } catch (error) {
    console.error("Error bulk deleting files:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
