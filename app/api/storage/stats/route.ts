import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { formatFileSize } from "@/lib/file-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = db.storage.getStats(user.id)

    return NextResponse.json({
      ...stats,
      totalSizeFormatted: formatFileSize(stats.totalSize),
      usagePercentage: Math.round((stats.totalSize / (100 * 1024 * 1024 * 1024)) * 100), // 100GB limit
    })
  } catch (error) {
    console.error("Error fetching storage stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
