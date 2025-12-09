import {
  ChevronDown,
  UserRoundPen,
  Workflow,
} from "lucide-react";
import { Link } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";

// Menu items.
// const items = [
//   {
//     title: "Home",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: "Inbox",
//     url: "#",
//     icon: Inbox,
//   },
//   {
//     title: "Calendar",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ];

export function AppSidebar() {
  const {
    state,
    open,
    // setOpen,
    // openMobile,
    // setOpenMobile,
    // isMobile,
    toggleSidebar,
  } = useSidebar();
  return (
    <Sidebar
      className="top-16 pr-0 h-[calc(100vh-4rem)]"
      variant="floating"
      collapsible="icon"
      onClick={() => {
        if (state === "collapsed") toggleSidebar();
      }}
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="flex">
            {open && <SidebarTrigger />}
            <SidebarGroupLabel>Application</SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Collapsible menu item */}
              <SidebarMenuItem>
                <Collapsible
                  defaultOpen={false}
                  className="group/collapsible w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link to="/flows">
                        <Workflow />
                        <span>Flows</span>
                        <ChevronDown className="ml-auto group-data-[state=closed]/collapsible:rotate-270 transition-transform" />
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {open && (
                    <CollapsibleContent>
                      <div className="relative flex flex-col mt-1 ml-4">
                        <Separator
                          orientation="vertical"
                          className="absolute"
                        />
                        <div className="flex flex-col ml-2">
                          <SidebarMenuButton>Steps</SidebarMenuButton>
                          <SidebarMenuButton>Step Activities</SidebarMenuButton>
                          <SidebarMenuButton>Activities</SidebarMenuButton>
                        </div>
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/clients">
                    <UserRoundPen />
                    <span>Clients</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
