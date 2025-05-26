import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HardDrive } from "lucide-react"

export function StorageUsage() {
  const usedStorage = 45.2 // GB
  const totalStorage = 100 // GB
  const usagePercentage = (usedStorage / totalStorage) * 100

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
        <HardDrive className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{usedStorage} GB used</span>
            <span>{totalStorage} GB total</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">{(totalStorage - usedStorage).toFixed(1)} GB remaining</p>
        </div>
      </CardContent>
    </Card>
  )
}
