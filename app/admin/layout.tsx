
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { GlobalContextProvider } from "./GlobalContext";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GlobalContextProvider><AdminPanelLayout>{children}</AdminPanelLayout></GlobalContextProvider>
  
}