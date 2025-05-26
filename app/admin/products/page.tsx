import { regdbHandler, getModelFieldsWithInputType } from '@/lib/regdb';

import ProductsClient from './client';
function page() {

  const modelName = 'product';
  async function get(ser: any, sta: any, pageg: any, pageSizeg: any) {
    "use server";
    const page = parseInt(pageg || '1', 10);
    const pageSize = parseInt(pageSizeg || '10', 5);
    let result;
    if (ser) {
      console.log(ser);
      
      result = await regdbHandler({
        modelName, method: 'GET', options: {
          page, pageSize, where: {
            OR: ser.map((word) => ({
              OR: [
                {
                  name: {
                    contains: word,
                    // mode: 'insensitive',
                  },
                },
                {
                  // description: {
                  //   contains: word,
                  //   // mode: 'insensitive',
                  // },
                },
              ],
            })),

            // search: ser,
            // status: sta
          }, include: {
            // user: true,
          }
        }
      });
    } else {
      result = await regdbHandler({
        modelName, method: 'GET', options: {
          page, pageSize, where: {
            // search: ser,
            // status: sta
          }, include: {
            // user: true,
          }
        }
      });
    }

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

  return (
    
      <ProductsClient
        get={get}
        deleted={deleted}
        update={update}
        create={create}
      />
   
  );
}

export default page;
