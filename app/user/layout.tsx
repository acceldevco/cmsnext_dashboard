import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Manage your account, orders, and preferences",
};

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const menuItems = [
    { title: "Dashboard", href: "/user" },
    { title: "Profile", href: "/user/profile" },
    { title: "Orders", href: "/user/orders" },
    { title: "Wishlist", href: "/user/wishlist" },
    { title: "Settings", href: "/user/settings" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 md:col-span-1 h-fit">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </ScrollArea>
        </Card>
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}