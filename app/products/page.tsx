import { regdbHandler } from "@/lib/regdb";
import ProductsPage from "./client";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getCategories(pageg: any, pageSizeg: any) {
  "use server";
  const page = parseInt(pageg || '1', 10);
  const pageSize = parseInt(pageSizeg || '10', 10);
  const modelName = 'category';
  const result = await regdbHandler({ modelName, method: 'GET', options: { page, pageSize } });
  return result.items || [];
}

async function getProducts(pageg: any, pageSizeg: any) {
  "use server";
  const page = parseInt(pageg || '1', 10);
  const pageSize = parseInt(pageSizeg || '10', 10);
  const modelName = 'product';
  const result = await regdbHandler({ modelName, method: 'GET' });
  console.log(result.items);
  
  return result.items || [];
}

export default async function Page({ searchParams }: Props) {
  const categories = await getCategories(searchParams.page, searchParams.pageSize);
  const products = await getProducts(searchParams.page, searchParams.pageSize);

  return (
    <>
      <ProductsPage categories={categories} products={products} />
    </>
  );
}
