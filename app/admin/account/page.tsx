import { getCurrentUser } from '@/lib/userData';
import AccountClientPage from './client';
import { regdbHandler } from '@/lib/regdb';

interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  [key: string]: any;
}


export default async function AccountServerPage() {
  const rawCurrentUser = await getCurrentUser();
  console.log(rawCurrentUser);
  
  let userForClient: UserProfile | null = null;
  const modelName = 'User';
  if (rawCurrentUser) {
    const { password, addresses, id, ...restOfUser } = rawCurrentUser;

    userForClient = {
      id: id, // اطمینان از وجود id، اگر در ...restOfUser نیست
      ...restOfUser, // شامل firstName, lastName, email, phone و سایر فیلدهای مستقیم
      city: addresses?.city, // خواندن از آبجکت addresses
      state: addresses?.province, // مپ کردن province از آبجکت addresses به state
      zipCode: addresses?.postalCode, // مپ کردن postalCode از آبجکت addresses به zipCode
    };
  }
  async function UpdateUser(data: any, id: any) {
    "use server"
    // console.log(data);
    
    return await regdbHandler({ modelName, method: 'PUT', data: { ...data, id }, options: { transaction: true } });

  }
  return <AccountClientPage update={UpdateUser} initialUser={userForClient} />;
}

