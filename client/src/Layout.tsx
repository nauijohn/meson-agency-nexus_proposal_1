import { Outlet } from "react-router";

import { AppSidebar } from "./components/app/AppSidebar";
import { Navbar05 } from "./components/ui/shadcn-io/navbar-05";
import { SidebarProvider } from "./components/ui/sidebar";

const Layout = () => {
  return (
    <>
      <Navbar05 />
      <SidebarProvider>
        <AppSidebar />
        <main className="relative mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl overflow-hidden">
          <Outlet /> {/* child route pages render here */}
        </main>
      </SidebarProvider>
    </>
  );
};

export default Layout;
