import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { saveFile, validateFile, generateUniqueFilename, getFileType } from "@/lib/file-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get("folderId")
    const search = searchParams.get("search")
    const type = searchParams.get("type")

    let files = search ? db.files.search(user.id, search) : db.files.findMany(user.id, folderId || undefined)

    if (type && type !== "all") {
      files = files.filter((file) => file.type === type)
    }

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const folderId = formData.get("folderId") as string | null

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      const validation = validateFile(file)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const uniqueFilename = generateUniqueFilename(file.name)
      const filePath = await saveFile(buffer, uniqueFilename, user.id)

      const fileRecord = db.files.create({
        name: file.name,
        originalName: file.name,
        type: getFileType(file.type),
        size: file.size,
        path: filePath,
        mimeType: file.type,
        userId: user.id,
        folderId: folderId || undefined,
      })

      uploadedFiles.push(fileRecord)
    }

    return NextResponse.json({ files: uploadedFiles }, { status: 201 })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
