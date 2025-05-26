// lib/userData.ts
import { PrismaClient, User } from '@/generated/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions, CustomUser } from '@/lib/auth'; // مسیر authOptions به فایل auth.ts در همین پوشه اصلاح شد
import { regdbHandler } from './regdb';

const prisma = new PrismaClient();

/**
 * اطلاعات کاربر فعلی را از پایگاه داده بر اساس شناسه کاربر موجود در جلسه next-auth دریافت می‌کند.
 * @returns {Promise<User | null>} اطلاعات کاربر یا null در صورت عدم وجود کاربر یا جلسه.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as { user?: CustomUser };

  if (!session?.user || typeof session.user.id === 'undefined') {
    console.log('No session or user ID found');
    return null;
  }

  try {
    const currentUser = await getUserById(session.user.id);
    console.log(session);
    
    if (!currentUser) {
      console.log(`User with ID ${session.user.id} not found in database.`);
      return null;
    }

    // می‌توانید فیلد رمز عبور را برای امنیت بیشتر حذف کنید
    // const { password, ...userWithoutPassword } = currentUser;
    // return userWithoutPassword;

    return currentUser;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Updates a user's information in the database.
 * @param {string} userId The ID of the user to update.
 * @param {object} data An object containing the fields to update and their new values.
 * @returns {Promise<User | null>} The updated user object, or null if the user was not found or an error occurred.
 */

export async function updateUser(userId: string, data: any) {
  if (!userId) {
    console.log('User ID not provided to updateUser');
    return null;
  }
  try {
    const result = await regdbHandler({
      modelName: 'User' as any,
      method: 'PUT',
      data: { id: userId, ...data },
    });
    if (result.error) {
      console.error(`Error updating user with ID ${userId}:`, result.error);
      return null;
    }
    return await getUserById(userId);
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    return null;
  }
}
export async function getUserById(userId: string) {
  if (!userId) {
    console.log('User ID not provided to getUserById');
    return null;
  }

  try {
    // const result = await regdbHandler({
    //   modelName: 'User' as any,
    //   method: 'GET',
    //   data: { id: userId },
    // });
    console.log(userId);
    
    const result = await (prisma as any)['User'].findUnique({ where: { id:userId }});
    if (result.error) {
      console.error(`Error fetching user with ID ${userId}:`, result.error);
      return null;
    }

    if (!result) {
      console.log(`User with ID ${userId} not found in database.`);
      return null;
    }
    // const { password, ...userWithoutPassword } = user;
    // return userWithoutPassword;
    return result;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
}
