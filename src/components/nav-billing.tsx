"use client"

import {
  IconCreditCard,
  IconCrown,
  IconDiamond,
  IconStar,
  IconStars,
} from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavBilling({ subscriptionLevel }: { subscriptionLevel?: string }) {
  const pathname = usePathname()
  
  const billingLinks = [
    {
      title: "Facturation",
      url: "/dashboard/account/subscription",
      icon: IconCreditCard,
    },
    {
      title: "Explorer les Plans",
      url: "/dashboard/account/billing",
      icon: IconStars,
    },
  ]

  return (
    <SidebarGroup>
      <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground">
        Facturation
      </h3>
      <SidebarGroupContent>
        <SidebarMenu>
          {billingLinks.map((item) => (
            <Link href={item.url} key={item.title} className={cn(
              "rounded-none",
              pathname === item.url ? "text-primary bg-primary/5" : "text-muted-foreground"
            )}>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon className="shrink-0" />}
                  <span className="truncate">{item.title}</span>
                  
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}