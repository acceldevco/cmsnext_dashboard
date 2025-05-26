import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { deleteFile } from "@/lib/file-utils"

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

    return NextResponse.json({ file })
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 })
    }

    const file = db.files.findById(params.id)
    if (!file || file.userId !== user.id) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const updatedFile = db.files.update(params.id, { name })

    return NextResponse.json({ file: updatedFile })
  } catch (error) {
    console.error("Error updating file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const file = db.files.findById(params.id)
    if (!file || file.userId !== user.id) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Delete physical file
    await deleteFile(file.path)

    // Delete from database
    const deleted = db.files.delete(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
