import fs from 'fs/promises';
import path from 'path';

export async function uploadImage(image: any): Promise<string> {
  const buffer = Buffer.from(await image.arrayBuffer());
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '');
  const filename = `${timestamp}-${image.name}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  const imageUrl = `/uploads/${filename}`;
  return imageUrl;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const filename = imageUrl.replace('/uploads/', '');
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    console.error(`Error deleting image: ${error.message}`);
  }
}

export function getImageUrl(imageName: string): string {
  return `/uploads/${imageName}`;
}
