import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const file = db.files.findById(params.id)
    if (!file || file.userId !== user.id) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = await readFile(file.path)

    const response = new NextResponse(fileBuffer)
    response.headers.set("Content-Type", file.mimeType)
    response.headers.set("Content-Disposition", `attachment; filename="${file.originalName}"`)
    response.headers.set("Content-Length", file.size.toString())

    return response
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
