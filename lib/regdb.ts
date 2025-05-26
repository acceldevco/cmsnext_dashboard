import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import * as fileManager from './file-manager';
import path from 'path';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from 'fs/promises';

const prisma = new PrismaClient();

interface Roles {
  [method: string]: string[];
}

interface PaginateOptions {
  page?: number;
  pageSize?: number;
  where?: any;
  orderBy?: any;
  select?: any;
  include?: any;
}

interface BulkOptions {
  items: any[];
}

interface RegdbHandlerOptions extends PaginateOptions {
  bulk?: BulkOptions;
  transaction?: boolean;
  softDelete?: boolean;
  log?: boolean;
  validate?: boolean;
}

// Define roles and permissions
const roles = {
  ADMIN: {
    can: ['read', 'create', 'update', 'delete']
  },
  EDITOR: {
    can: ['read', 'create', 'update']
  },
  CUSTOMER: {
    can: ['read']
  }
};

// Function to check permissions
function checkPermission(role: string, action: string): boolean {
  if (!roles[role as keyof typeof roles]) {
    return false; // Role not found
  }
  return roles[role as keyof typeof roles].can.includes(action);
}

function logRequest(action: string, payload: any) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[regdb] ${action}:`, JSON.stringify(payload));
  }
}

function validateInput(data: any) {
  // TODO: اعتبارسنجی ورودی‌ها بر اساس نیاز
  return true;
}

export async function regdbHandler({
  modelName,
  method,
  data = {},
  options = {}
}: {
  modelName: any;
  method: "GET" | "POST" | "PUT" | "DELETE" | "FIND";
  data?: any;
  options?: RegdbHandlerOptions;
}) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : 'CUSTOMER';

    const model = (prisma as any)[modelName];
    if (!model) throw { message: "Model not found", status: 404 };
    if (options.log) logRequest(method, { modelName, data, options });
    if (options.validate && !validateInput(data)) throw { message: "Invalid input", status: 400 };
    // Soft delete: فقط رکوردهایی که حذف نشده‌اند را واکشی کن
    const softDeleteWhere = options.softDelete ? { deletedAt: null } : {};

    // Check permissions based on method
    let action;
    switch (method) {
      case "GET":
      case "FIND":
        action = 'read';
        break;
      case "POST":
        action = 'create';
        break;
      case "PUT":
        action = 'update';
        break;
      case "DELETE":
        action = 'delete';
        break;
      default:
        throw { message: "Method not supported", status: 405 };
    }

    if (!checkPermission(userRole, action)) {
      throw { message: "Unauthorized", status: 403 };
    }

    switch (method) {
      case "GET":
        if (data.id) {
          console.log(data.id);

          return await model.findUnique({ where: { id: data.id, ...softDeleteWhere }, select: options.select, include: options.include });
        } else {
          const page = options.page || 1;
          const pageSize = options.pageSize || 10;
          const where = { ...options.where, ...softDeleteWhere };
          const orderBy = options.orderBy || { createdAt: "desc" };
          const [items, total] = await Promise.all([
            model.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize, select: options.select, include: options.include }),
            model.count({ where }),
          ]);
          console.log(where);

          return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
        }
      case "FIND": {
        const page = options.page || 1;
        const pageSize = options.pageSize || 10;
        // Combine data, options.where, and softDeleteWhere for filtering
        const baseFilter =
          data && typeof data.where === "object" && data.where !== null
            ? data.where
            : data;
        const where = { ...baseFilter, ...options.where, ...softDeleteWhere };
        const orderBy = options.orderBy || { createdAt: "desc" };
        const [items, total] = await Promise.all([
          model.findMany({
            where,
            orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: options.select,
            include: options.include,
          }),
          model.count({ where }),
        ]);

        // Handle image retrieval
        items.forEach((item: any) => {
          if (item.image) {
            item.image = fileManager.getImageUrl(item.image); // Assuming getImageUrl function exists
          }
        });

        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
      }
      case "POST":
        if (options.bulk && Array.isArray(options.bulk.items)) {
          console.log('dasd', options, data);

          // Bulk create
          // Consider if password hashing is needed for bulk user creation
          return await model.createMany({ data: options.bulk.items });
        }
        // Hash password if creating a user
        // console.log(data,modelName);

        if ((modelName as string) === "User" && data.password) {
          const salt = await bcrypt.genSalt(10);
          data.password = await bcrypt.hash(data.password, salt);
        }
        if (data.images) {
         data.images = await uploadfile(data.images,true)
        }else{
          data.avatar = await uploadfile(data.avatar,false)
        }
        if ((modelName as string) === "Product") {
          if (data.price) {
            data.price = Number(data.price);
          }
          if (data.discountPrice) {
            data.discountPrice = Number(data.discountPrice);
          }
        }

        console.log("Data before create:", data);
        return await model.create({ data });
      case "PUT":
        if (!data.id) throw { message: "ID is required for update", status: 400 };
        const { id, createdAt, updatedAt, ...updateData } = data;

        // Handle image upload

        if (data.images) {
         data.images = await uploadfile(data.images,true)
        }else{
          data.avatar = await uploadfile(data.avatar,false)
        }
        if (options.transaction) {
          console.log(updateData);
          return await prisma.$transaction([
            model.update({
              where: { id }, data:data
            }),
          ]).catch(e => console.log(e)
          );
        }
        return await model.update({ where: { id }, data: updateData });


      case "DELETE":
        if (!data.id) throw { message: "ID is required for delete", status: 400 };

        // Handle image deletion
        const itemToDelete = await model.findUnique({ where: { id: data.id } });
        if (itemToDelete && itemToDelete.image) {
          await fileManager.deleteImage(itemToDelete.image); // Assuming deleteImage function exists
        }

        if (options.softDelete) {
          return await model.update({
            where: { id: data.id },
            data: { deletedAt: new Date() },
          });
        }
        return await model.delete({ where: { id: data.id } });
      default:
        throw { message: "Method not supported", status: 405 };
    }
  } catch (error: any) {
    if (options && options.log) logRequest("ERROR", error);
    return { error: error.message, status: error.status || 500 };
  }
}

async function uploadfile(params: any,ty:any) {
  const image = params;
  // console.log(image);
  const buffer = Buffer.from(await image.data,'base64');
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '');
  const filename = `${timestamp}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  const imageUrl =  ty ? JSON.stringify([`/uploads/${filename}`]) : `/uploads/${filename}`;;
  console.log(imageUrl);
  
  return imageUrl;
}

export async function getModelFieldsWithInputType(modelName: keyof typeof prisma): Promise<Array<{ name: string; type: any; input: string }>> {
  const model = (prisma as any)[modelName];
  if (!model) throw new Error("Model not found");
  const tableName = modelName.toString().toLowerCase();
  const columns = await prisma.$queryRawUnsafe<any[]>(
    `SHOW COLUMNS FROM \`${tableName}\``
  );
  // نگاشت نوع داده به نوع ورودی
  const typeMap: Record<string, string> = {
    int: "input",
    bigint: "input",
    float: "input",
    double: "input",
    decimal: "input",
    varchar: "input",
    text: "input",
    longtext: "input",
    char: "input",
    date: "input",
    datetime: "input",
    timestamp: "input",
    tinyint: "checkbox",
    boolean: "checkbox",
    enum: "select",
    json: "input",
  };
  return columns.map(col => {
    let baseType = col.Type.split('(')[0];
    let inputType = typeMap[baseType] || "input";
    // اگر enum بود، select
    if (baseType === "enum") inputType = "select";
    // اگر tinyint(1) بود، checkbox
    if (baseType === "tinyint" && col.Type === "tinyint(1)") inputType = "checkbox";
    return {
      name: col.Field,
      type: col.Type,
      input: inputType
    };
  });
}
