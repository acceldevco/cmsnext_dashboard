import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    const folders = db.folders.findMany(user.id, parentId || undefined)

    return NextResponse.json({ folders })
  } catch (error) {
    console.error("Error fetching folders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, parentId } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid folder name" }, { status: 400 })
    }

    // Generate path
    let path = `/${name}`
    if (parentId) {
      const parentFolder = db.folders.findById(parentId)
      if (parentFolder && parentFolder.userId === user.id) {
        path = `${parentFolder.path}/${name}`
      }
    }

    const folder = db.folders.create({
      name,
      path,
      parentId: parentId || undefined,
      userId: user.id,
    })

    return NextResponse.json({ folder }, { status: 201 })
  } catch (error) {
    console.error("Error creating folder:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
