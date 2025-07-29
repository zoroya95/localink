// Modifiez d'abord votre fichier app-sidebar.tsx
import * as React from "react"
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
import { getCurrentSession } from "@/actions/auth"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavBilling } from "@/components/nav-billing" // Nouveau composant
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { IconInnerShadowTop } from "@tabler/icons-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import Image from "next/image"

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await getCurrentSession()
  if (!session?.user) {
    redirect("/")
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild variant={"bgNone"} className="!p-4">
              <Link 
                href="/dashboard"
                className="flex items-center gap-4"
                aria-label="Localink - Retour à l'accueil"
              >
                <Image
                  src="/logo/localink.png"
                  alt="Logo Localink"
                  width={120}
                  height={120}
                  className="object-contain drop-shadow-md"
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavBilling  /> {/* Nouvelle section */}
      </SidebarContent>
      <SidebarFooter>
         {/* <NavUser user={session.user}  /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
