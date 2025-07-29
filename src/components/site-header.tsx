import AccountInfo from "@/app/[locale]/(dashboard)/dashboard/account/AccountInfo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BellIcon } from "@radix-ui/react-icons" // ou importez une icône de votre choix

export function SiteHeader() {
  const unreadNotificationsCount = 0 // Remplacez par votre logique réelle de comptage
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        <div className="ml-auto flex items-center gap-2">
          {/* Bouton Notifications avec badge positionné correctement */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 rounded-full"
              aria-label={`Notifications (${unreadNotificationsCount} non lues)`}
            >
              <BellIcon className="h-5 w-5" />
            </Button>
            {unreadNotificationsCount >= 0 && (
              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white border-2 border-background">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </div>
            )}
          </div>

          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <AccountInfo />
          </Button>
        </div>
      </div>
    </header>
  )
}