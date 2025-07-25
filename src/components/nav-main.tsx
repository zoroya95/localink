"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboards",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "/dashboards/lifecycle",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "/dashboards/analytics",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      url: "/dashboards/projects",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "/dashboards/team",
      icon: IconUsers,
    },
  ],
  
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboards/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/dashboards/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/dashboards/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/dashboards/documents/data-library",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/dashboards/documents/reports",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "/dashboards/documents/word-assistant",
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