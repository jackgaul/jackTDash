"use client"

import { Home, TicketIcon, ClipboardList, Settings, Users, BarChart3, Search, PlusCircle, Bell, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarInput,
} from "@/components/ui/sidebar"
import { UserInterface } from "@/typesNdefs/servalTypes"

interface AppSidebarProps {
  userLoggedIn: UserInterface
  onPageClick: (page: "TicketList" | "TicketDetail" | "ServalChat") => void
}

export function AppSidebar({ userLoggedIn, onPageClick }: AppSidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <TicketIcon className="h-6 w-6" />
          <span className="font-bold text-lg">ITSM Portal</span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Bell className="h-5 w-5" />
        </Button>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarGroup className="px-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput placeholder="Search..." className="pl-9" />
        </div>
      </SidebarGroup>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="My Tickets" isActive={true} onClick={() => onPageClick("TicketList")}>
                  <ClipboardList className="h-5 w-5" />
                  <span>My Tickets</span>
                </SidebarMenuButton>

              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Create Ticket">
                  <PlusCircle className="h-5 w-5" />
                  <span>Create Ticket</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Serval Chat" onClick={() => onPageClick("ServalChat")}>
                  <MessageSquare className="h-5 w-5" />
                  <span>Serval Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Users">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Reports">
                  <BarChart3 className="h-5 w-5" />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userLoggedIn.first_name} {userLoggedIn.last_name}</span>
            <span className="text-xs text-muted-foreground">{userLoggedIn.role}</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

