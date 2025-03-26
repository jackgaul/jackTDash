"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import TicketsList from "./tickets-list"
import TicketDetail from "./ticket-detail"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TicketInterface } from "@/types/servalTypes"

export default function Dashboard() {
  const [selectedTicket, setSelectedTicket] = useState<TicketInterface | null>(null)

  const handleSelectTicket = (ticket: TicketInterface) => {
    console.log("Selected ticket:", ticket)
    setSelectedTicket(ticket)
  }

  const handleBackToList = () => {
    setSelectedTicket(null)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-6">IT Service Management Dashboard</h1>
            {selectedTicket ? (
              <TicketDetail ticket={selectedTicket} onBack={handleBackToList} />
            ) : (
              <TicketsList onSelectTicket={handleSelectTicket} />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

