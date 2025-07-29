"use client"


import { Button } from "@/components/ui/button"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { use } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FileCode2, LayoutDashboard } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Generator",
      url: "/dashboard/generator",
      icon: FileCode2,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "My Clients",
      url: "/dashboard/clients",
      icon: IconUsers,
    },
     {
      title: "Settings",
      url: "/dashboard/profile",
      icon: IconSettings,
    },
  ],
  
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/dashboard/documents/data-library",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/dashboard/documents/reports",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "/dashboard/documents/word-assistant",
      icon: IconFileWord,
    },
  ],
}

export function NavMain() {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {data.navMain.map((item) => (
            <Link href={item.url} key={item.title} className={cn("rounded-none",
              pathname === item.title ? "text-primary bg-primary/5" : "text-muted-foregroundforeground" 
            )}>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}