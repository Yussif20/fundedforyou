"use client";

import {
  ArrowLeft,
  Users,
  Home,
  CreditCard,
  Layers,
  Handshake,
  MessageSquare,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetMeQuery } from "@/redux/api/userApi";
import Topbar from "./Topbar";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// Define navigation items (labelKey matches Overview.sidebar.*)
const navigation = [
  {
    labelKey: "manageUsers",
    route: "/overview/user-management",
    icon: Users,
    roles: ["SUPER_ADMIN"],
  },
  {
    labelKey: "managePayMethod",
    route: "/overview/pay-method-management",
    icon: CreditCard,
    roles: ["SUPER_ADMIN"],
  },
  {
    labelKey: "managePlatform",
    route: "/overview/platform-management",
    icon: Layers,
    roles: ["SUPER_ADMIN"],
  },
  {
    labelKey: "manageBroker",
    route: "/overview/broker-management",
    icon: Handshake,
    roles: ["SUPER_ADMIN"],
  },
  {
    labelKey: "manageContactMessages",
    route: "/overview/contact-messages",
    icon: MessageSquare,
    roles: ["SUPER_ADMIN", "MODERATOR"],
  },
  {
    labelKey: "newsletterSubscribers",
    route: "/overview/newsletter-subscribers",
    icon: Mail,
    roles: ["SUPER_ADMIN"],
  },
  {
    labelKey: "home",
    route: "/",
    icon: Home,
    roles: ["SUPER_ADMIN", "MODERATOR", "USER"],
  },
];

const SidebarSkeleton = ({ isOpen }: { isOpen: boolean }) => (
  <div
    className={cn(
      "pt-16 z-40 h-screen bg-card/95 border-r border-border/80 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_24px_-4px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-500 relative",
      isOpen ? "min-w-64 w-64" : "w-16 min-w-16"
    )}
  >
    {/* Navigation Skeleton */}
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {/* Skeleton for navigation items */}
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index}>
            <div
              className={cn(
                "flex items-center space-x-3 p-2 rounded-lg",
                !isOpen && "justify-center"
              )}
            >
              <Skeleton className="h-5 w-5 rounded" />
              {isOpen && <Skeleton className="h-4 w-24" />}
            </div>
          </li>
        ))}
      </ul>
    </nav>

    {/* Footer Skeleton */}
    <div className="p-4">
      {/* User info skeleton */}
      {isOpen && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-muted/50 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      )}

      {/* Toggle button skeleton */}
      <div className="text-end flex justify-end items-end -mr-8">
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  </div>
);

const Sidebar = () => {
  const t = useTranslations("Overview.sidebar");
  const { data, isLoading, error } = useGetMeQuery(undefined);
  const [isOpen, setIsOpen] = useState(true);
  const path = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Show skeleton during loading
  if (isLoading) {
    return (
      <>
        <Topbar isOpen={isOpen} />
        <SidebarSkeleton isOpen={isOpen} />
      </>
    );
  }

  // Handle error state
  if (error) {
    return (
      <>
        <Topbar isOpen={isOpen} />
        <div
          className={cn(
            "pt-16 z-40 h-screen border-r border-border/80 flex flex-col transition-all duration-500 relative bg-card/95 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_24px_-4px_rgba(0,0,0,0.3)]",
            isOpen ? "min-w-64 w-64" : "w-16 min-w-16"
          )}
        >
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">{t("failedToLoadUser")}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                {t("retry")}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (path === "/privacy-policy") {
    return null;
  }

  const userData = data?.data?.user;
  return (
    <>
      {/* Sidebar */}
      <Topbar isOpen={isOpen} />
      <div
        className={cn(
          "pt-16 z-40 h-screen border-r border-border/80 flex flex-col transition-all duration-500 relative bg-card/95 backdrop-blur-sm shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_24px_-4px_rgba(0,0,0,0.3)]",
          isOpen ? "min-w-64 w-64" : "w-16 min-w-16"
        )}
      >
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = path === item.route;
              const Icon = item.icon;

              // Only display the menu if the USER has the correct role
              if (!item.roles.includes(userData?.role || "")) {
                return null;
              }

              return (
                <li key={item.route}>
                  <Link href={item.route} className="block">
                    <span
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isOpen ? "justify-start" : "justify-center",
                        isActive
                          ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {isOpen && (
                        <span className="truncate rtl:text-right">
                          {t(item.labelKey)}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 space-y-3">
          {isOpen && userData && (
            <div className="rounded-xl bg-muted/50 border border-border/50 px-4 py-3 shadow-sm">
              <p className="text-sm font-semibold text-foreground truncate">
                {userData?.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {userData?.email}
              </p>
            </div>
          )}

          <div className={cn("flex", isOpen && "justify-end")}>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="rounded-xl h-9 w-9 border-border/60 hover:bg-muted/70 hover:border-muted-foreground/20 transition-colors"
            >
              <ArrowLeft
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  isOpen ? "" : "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
