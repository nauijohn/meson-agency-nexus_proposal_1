"use client";

import * as React from "react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BellIcon,
  ChevronDownIcon,
  HelpCircleIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";

import { cn } from "@/lib/utils";
import type { RootState } from "@/store";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/shadcn-ui/components/ui/avatar";
import { Badge } from "@repo/shadcn-ui/components/ui/badge";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/shadcn-ui/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@repo/shadcn-ui/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/ui/popover";

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 324 323"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="88.1023"
        y="144.792"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 88.1023 144.792)"
        fill="currentColor"
      />
      <rect
        x="85.3459"
        y="244.537"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 85.3459 244.537)"
        fill="currentColor"
      />
    </svg>
  );
};

// Hamburger icon component
const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="group-aria-expanded:rotate-[315deg] origin-center transition-all -translate-y-[7px] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]"
    />
    <path
      d="M4 12H20"
      className="group-aria-expanded:rotate-45 origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]"
    />
    <path
      d="M4 12H20"
      className="group-aria-expanded:rotate-[135deg] origin-center transition-all translate-y-[7px] group-aria-expanded:translate-y-0 duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]"
    />
  </svg>
);

// Info Menu Component
const InfoMenu = ({
  onItemClick,
}: {
  onItemClick?: (item: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <HelpCircleIcon className="w-4 h-4" />
        <span className="sr-only">Help and Information</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("help")}>
        Help Center
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("documentation")}>
        Documentation
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("contact")}>
        Contact Support
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("feedback")}>
        Send Feedback
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Notification Menu Component
const NotificationMenu = ({
  notificationCount = 3,
  onItemClick,
}: {
  notificationCount?: number;
  onItemClick?: (item: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="relative w-9 h-9">
        <BellIcon className="w-4 h-4" />
        {notificationCount > 0 && (
          <Badge className="-top-1 -right-1 absolute flex justify-center items-center p-0 w-5 h-5 text-xs">
            {notificationCount > 9 ? "9+" : notificationCount}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-80">
      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("notification1")}>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">New message received</p>
          <p className="text-muted-foreground text-xs">2 minutes ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("notification2")}>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">System update available</p>
          <p className="text-muted-foreground text-xs">1 hour ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("notification3")}>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">Weekly report ready</p>
          <p className="text-muted-foreground text-xs">3 hours ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("view-all")}>
        View all notifications
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// User Menu Component
const UserMenu = ({
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar,
  onItemClick,
}: {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onItemClick?: (item: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="hover:bg-accent px-2 py-0 h-9 hover:text-accent-foreground"
      >
        <Avatar className="w-7 h-7">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="text-xs">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <ChevronDownIcon className="ml-1 w-3 h-3" />
        <span className="sr-only">User menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="font-medium text-sm leading-none">{userName}</p>
          <p className="text-muted-foreground text-xs leading-none">
            {userEmail}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("profile")}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("settings")}>
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("billing")}>
        Billing
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("logout")}>
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Types
export interface Navbar05NavItem {
  href?: string;
  label: string;
}

export interface Navbar05Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar05NavItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  onNavItemClick?: (href: string) => void;
  onInfoItemClick?: (item: string) => void;
  onNotificationItemClick?: (item: string) => void;
  onUserItemClick?: (item: string) => void;
}

// Default navigation links
const defaultNavigationLinks: Navbar05NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Admin" },
  { href: "/admin2", label: "Admin2" },
  // { href: "#", label: "Pricing" },
  // { href: "#", label: "About" },
];

export const Navbar05 = React.forwardRef<HTMLElement, Navbar05Props>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      userName = "John Doe",
      userEmail = "john@example.com",
      userAvatar,
      notificationCount = 3,
      onNavItemClick,
      onInfoItemClick,
      onNotificationItemClick,
      onUserItemClick,
      ...props
    },
    ref,
  ) => {
    const user = useSelector((state: RootState) => state.users);

    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <header
        ref={combinedRef}
        className={cn(
          "top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur px-4 md:px-6 border-b w-full [&_*]:no-underline",
          className,
        )}
        {...props}
      >
        <div className="flex justify-between items-center gap-4 mx-auto max-w-screen-2xl h-16 container">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group hover:bg-accent w-9 h-9 hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-1 w-64">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (onNavItemClick && link.href)
                                onNavItemClick(link.href);
                            }}
                            className="flex items-center hover:bg-accent focus:bg-accent px-3 py-2 rounded-md w-full font-medium text-sm no-underline transition-colors hover:text-accent-foreground focus:text-accent-foreground cursor-pointer"
                          >
                            {link.label}
                          </button>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="text-2xl">{logo}</div>
                <span className="hidden sm:inline-block font-bold text-xl">
                  Nexus Meson
                </span>
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        {/* <NavigationMenuLink
                          href={link.href || "#"}
                          onClick={(e) => {
                            e.preventDefault();
                            if (onNavItemClick && link.href)
                              onNavItemClick(link.href);
                          }}
                          className="group inline-flex justify-center items-center bg-background focus:bg-accent disabled:opacity-50 px-4 py-1.5 py-2 rounded-md focus:outline-none w-max h-10 font-medium text-muted-foreground hover:text-primary text-sm transition-colors focus:text-accent-foreground cursor-pointer disabled:pointer-events-none"
                        >
                          {link.label}
                        </NavigationMenuLink> */}

                        <NavigationMenuLink asChild>
                          <NavLink
                            to={link.href || "#"}
                            className={({ isActive }) =>
                              cn(
                                "inline-flex justify-center items-center bg-background px-4 py-2 rounded-md w-max h-10 font-medium text-sm transition-colors cursor-pointer",
                                isActive
                                  ? "text-primary bg-accent"
                                  : "text-muted-foreground hover:text-primary hover:bg-accent/30",
                              )
                            }
                          >
                            {link.label}
                          </NavLink>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Info menu */}
              <InfoMenu onItemClick={onInfoItemClick} />
              {/* Notification */}
              <NotificationMenu
                notificationCount={notificationCount}
                onItemClick={onNotificationItemClick}
              />
            </div>
            {/* User menu */}
            <UserMenu
              userName={`${user.firstName} ${user.lastName}`}
              userEmail={user.email}
              userAvatar={userAvatar}
              onItemClick={onUserItemClick}
            />
          </div>
        </div>
      </header>
    );
  },
);

Navbar05.displayName = "Navbar05";

export { HamburgerIcon, InfoMenu, Logo, NotificationMenu, UserMenu };
