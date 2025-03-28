"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import TicketsList from "./tickets-list"
import TicketDetail from "./TicketDetail"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TicketInterface, UserInterface } from "@/types/servalTypes"

export default function Dashboard() {
  const [selectedTicket, setSelectedTicket] = useState<TicketInterface | null>(null)
  const [userLoggedIn] = useState<UserInterface>({
    user_uuid: "b87ab50f-e199-42a1-a257-cc4216e896c0",
    first_name: "Jack",
    last_name: "Gaul",
    email: "jack@example.com",
    role: "IT Manager",
  })
  const [page, setPage] = useState<string>("TicketList")

  const handleSelectTicket = (ticket: TicketInterface) => {
    console.log("Selected ticket:", ticket)
    setSelectedTicket(ticket)
  }

  const handleBackToList = () => {
    setSelectedTicket(null)
    setPage("TicketList")
  }




  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar userLoggedIn={userLoggedIn} />
        <SidebarInset className="flex-1">
          <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-6">IT Service Management Dashboard</h1>
            {selectedTicket ? (
              <TicketDetail ticket={selectedTicket} onBack={handleBackToList} userLoggedIn={userLoggedIn} />
            ) : (
              <TicketsList onSelectTicket={handleSelectTicket} userLoggedIn={userLoggedIn} />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

