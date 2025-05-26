import { regdbHandler, getModelFieldsWithInputType } from '@/lib/regdb';

import ProductsClient from './client';
// import { ProductProvider } from './products-context';
import SinPage from './client';

interface PageProps {
  params: { id: string };
}

function page({ params }: PageProps) {
  const { id: pageId } = params; // Extract id from params
  const modelName = 'Product';
  async function get(ser: any, sta: any, pageg: any, pageSizeg: any) {
    "use server";
    const page = parseInt(pageg || '1', 10);
    const pageSize = parseInt(pageSizeg || '10', 10);
    const result = await regdbHandler({
      modelName, method: 'GET', options: {
        page, pageSize, where: {
          // search: ser,
          // status: sta
        }, include: {
          // user: true,
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
  async function find() {
    "use server";
    const product: any = await regdbHandler({
      modelName: modelName as any, method: 'GET', options: {
        include: {
          attributes: true,
          reviews:
          true,
          //  { user: true },
          variants: true
        },
        where: {
          id: pageId
        }
      }
    });

    return { product };
  }

  return (
    // <ProductProvider get={get}>
    <SinPage
      pageId={pageId} // Pass the id to the client component
      get={get}
      deleted={deleted}
      update={update}
      create={create}
      find={find}
    />
    // </ProductProvider>
  );
}

export default page;
