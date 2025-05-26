export interface FileRecord {
  id: string
  name: string
  originalName: string
  type: string
  size: number
  path: string
  mimeType: string
  uploadedAt: Date
  updatedAt: Date
  userId: string
  folderId?: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
  }
}

export interface FolderRecord {
  id: string
  name: string
  path: string
  parentId?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface StorageStats {
  totalSize: number
  fileCount: number
  folderCount: number
  lastUpdated: Date
}

// In-memory storage (replace with actual database)
const files: FileRecord[] = [
  {
    id: "1",
    name: "project-proposal.pdf",
    originalName: "project-proposal.pdf",
    type: "pdf",
    size: 2400000,
    path: "/uploads/1/project-proposal.pdf",
    mimeType: "application/pdf",
    uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: "user1",
  },
  {
    id: "2",
    name: "dashboard-mockup.png",
    originalName: "dashboard-mockup.png",
    type: "image",
    size: 1800000,
    path: "/uploads/2/dashboard-mockup.png",
    mimeType: "image/png",
    uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    userId: "user1",
    metadata: { width: 1920, height: 1080 },
  },
]

const folders: FolderRecord[] = [
  {
    id: "1",
    name: "Documents",
    path: "/Documents",
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Projects",
    path: "/Documents/Projects",
    parentId: "1",
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// File operations
export const db = {
  files: {
    findMany: (userId: string, folderId?: string) => {
      return files.filter((file) => file.userId === userId && file.folderId === folderId)
    },
    findById: (id: string) => {
      return files.find((file) => file.id === id)
    },
    create: (data: Omit<FileRecord, "id" | "uploadedAt" | "updatedAt">) => {
      const file: FileRecord = {
        ...data,
        id: Date.now().toString(),
        uploadedAt: new Date(),
        updatedAt: new Date(),
      }
      files.push(file)
      return file
    },
    update: (id: string, data: Partial<FileRecord>) => {
      const index = files.findIndex((file) => file.id === id)
      if (index === -1) return null
      files[index] = { ...files[index], ...data, updatedAt: new Date() }
      return files[index]
    },
    delete: (id: string) => {
      const index = files.findIndex((file) => file.id === id)
      if (index === -1) return false
      files.splice(index, 1)
      return true
    },
    search: (userId: string, query: string) => {
      return files.filter((file) => file.userId === userId && file.name.toLowerCase().includes(query.toLowerCase()))
    },
  },
  folders: {
    findMany: (userId: string, parentId?: string) => {
      return folders.filter((folder) => folder.userId === userId && folder.parentId === parentId)
    },
    findById: (id: string) => {
      return folders.find((folder) => folder.id === id)
    },
    create: (data: Omit<FolderRecord, "id" | "createdAt" | "updatedAt">) => {
      const folder: FolderRecord = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      folders.push(folder)
      return folder
    },
    update: (id: string, data: Partial<FolderRecord>) => {
      const index = folders.findIndex((folder) => folder.id === id)
      if (index === -1) return null
      folders[index] = { ...folders[index], ...data, updatedAt: new Date() }
      return folders[index]
    },
    delete: (id: string) => {
      const index = folders.findIndex((folder) => folder.id === id)
      if (index === -1) return false
      folders.splice(index, 1)
      return true
    },
  },
  storage: {
    getStats: (userId: string): StorageStats => {
      const userFiles = files.filter((file) => file.userId === userId)
      const userFolders = folders.filter((folder) => folder.userId === userId)
      const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0)

      return {
        totalSize,
        fileCount: userFiles.length,
        folderCount: userFolders.length,
        lastUpdated: new Date(),
      }
    },
  },
}
