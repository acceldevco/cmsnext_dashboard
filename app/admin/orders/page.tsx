import { regdbHandler, getModelFieldsWithInputType } from '@/lib/regdb';


import OrdersPage from './client';
import { GlobalContextProvider } from '@/app/context/GlobalContext';
function page() {

  const modelName = 'Order';
  async function get(ser:any, sta:any, pageg: any, pageSizeg: any) {
    "use server";
    const page = parseInt(pageg || '1', 10);
    const pageSize = parseInt(pageSizeg || '10', 10);


    



    const result = await regdbHandler({
      modelName, method: 'GET', options: {
        page, pageSize, where: {
          search: ser, status: sta
        }, include: {
          user: true,
        }
      }
    });
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
  return (<>
  <GlobalContextProvider get={get} create={create} update={update} deleted={deleted}>
  <OrdersPage
      get={get}
      deleted={deleted}
      update={update}
      create={create}
    />
  </GlobalContextProvider>

  </>);
}

export default page;