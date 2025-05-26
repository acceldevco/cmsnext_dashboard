import { writeFile, mkdir, unlink, access, stat } from "fs/promises"
import { join } from "path"
import { constants } from "fs"

export const UPLOAD_DIR = join(process.cwd(), "uploads")
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-rar-compressed",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
]

export async function ensureUploadDir() {
  try {
    await access(UPLOAD_DIR, constants.F_OK)
  } catch {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function saveFile(buffer: Buffer, filename: string, userId: string): Promise<string> {
  await ensureUploadDir()

  const userDir = join(UPLOAD_DIR, userId)
  try {
    await access(userDir, constants.F_OK)
  } catch {
    await mkdir(userDir, { recursive: true })
  }

  const filePath = join(userDir, filename)
  await writeFile(filePath, buffer)

  return filePath
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await unlink(filePath)
    return true
  } catch {
    return false
  }
}

export async function getFileInfo(filePath: string) {
  try {
    const stats = await stat(filePath)
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      exists: true,
    }
  } catch {
    return {
      exists: false,
    }
  }
}

export function getFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.startsWith("audio/")) return "audio"
  if (mimeType === "application/pdf") return "pdf"
  if (mimeType.includes("word") || mimeType.includes("document")) return "document"
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "spreadsheet"
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "presentation"
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("archive")) return "archive"
  return "file"
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split(".").pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")

  return `${nameWithoutExt}-${timestamp}-${random}.${extension}`
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit` }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "File type not allowed" }
  }

  return { valid: true }
}
