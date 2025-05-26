import { regdbHandler, getModelFieldsWithInputType } from '@/lib/regdb';
import Auth from './client';
import CartPage from './client';
function page() {
  const modelName = 'User';
  async function get(pageg: any, pageSizeg: any) {
    "use server";
    const page = parseInt(pageg || '1', 10);
    const pageSize = parseInt(pageSizeg || '10', 10);
    const result = await regdbHandler({ modelName, method: 'GET', options: { page, pageSize } });
    return { ...result, 'col': await getModelFieldsWithInputType(modelName) };
  }
  async function deleted(id: any) {
    "use server";
    return await regdbHandler({ modelName, method: 'DELETE', data: { id } });
  }
  async function update(data: any, id: any) {
    "use server";
    return await regdbHandler({ modelName, method: 'PUT', data: { ...data, id }, options: { transaction: true } });

  }
  async function create(data: any) {
    "use server";
    return await regdbHandler({ modelName, method: 'POST', data });
  }
  async function find(data: any) {
    "use server";
    return await regdbHandler({ modelName, method: 'FIND', data });
  }
  return (<>
    <CartPage
      get={get}
      deleted={deleted}
      update={update}
      create={create}
      find={find}
    />
  </>);
}

export default page;