import OrdersPage from './client';
import { getCurrentUser } from '@/lib/userData';

async function page() {
  try {
    const rawCurrentUser = await getCurrentUser(); // این تابع باید اطلاعات کاربر شامل addresses را برگرداند
    // let userForClient: UserProfile | null = null;

    return (<>
      <OrdersPage
        initialUser={rawCurrentUser}
      />
    </>);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return <div>Error loading user data.</div>;
  }
}

export default page;
