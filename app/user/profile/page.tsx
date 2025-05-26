import ProfilePage from './client';
import { getCurrentUser, updateUser } from '@/lib/userData';

async function page() {
  try {
    const rawCurrentUser = await getCurrentUser();

    async function update(userId: string, data: any) {
      "use server"
      await updateUser(userId, data);
    }

    return (
      <>
        <ProfilePage
          profile={rawCurrentUser}
          update={update}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return <div>Error loading user data.</div>;
  }
}

export default page;
