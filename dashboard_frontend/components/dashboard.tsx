"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import TicketsList from "./TicketsListPage"
import TicketDetail from "./TicketDetailPage"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TicketInterface, UserInterface } from "@/typesNdefs/JackTTypes"
import JackTChat from "./JackTChatPage"

export default function Dashboard() {
  const [selectedTicket, setSelectedTicket] = useState<TicketInterface | null>(null)
  const [userLoggedIn] = useState<UserInterface>({
    user_uuid: "b87ab50f-e199-42a1-a257-cc4216e896c0",
    first_name: "Jack",
    last_name: "Gaul",
    email: "jack@example.com",
    role: "IT Manager",
  })
  const [page, setPage] = useState<"TicketList" | "TicketDetail" | "JackTChat">("TicketList")

  const handleSelectTicket = (ticket: TicketInterface) => {

    setSelectedTicket(ticket)
    setPage("TicketDetail")
  }

  const handleBackToList = () => {
    setSelectedTicket(null)
    setPage("TicketList")
  }

  const handlePageClick = (page: "TicketList" | "TicketDetail" | "JackTChat") => {
    setPage(page)
  }



  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar userLoggedIn={userLoggedIn} onPageClick={handlePageClick} />
        <SidebarInset className="flex-1">
          <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-6">IT Service Management Dashboard</h1>
            {(() => {
              switch (page) {
                case "TicketList":
                  return (
                    <TicketsList
                      onSelectTicket={handleSelectTicket}
                      userLoggedIn={userLoggedIn} />
                  )
                case "TicketDetail":
                  return (selectedTicket ? (
                    <TicketDetail
                      ticket={selectedTicket}
                      onBack={handleBackToList}
                      userLoggedIn={userLoggedIn}
                    />
                  ) : (
                    <TicketsList
                      onSelectTicket={handleSelectTicket}
                      userLoggedIn={userLoggedIn} />
                  )
                  )
                case "JackTChat":
                  return <JackTChat
                    userLoggedIn={userLoggedIn}
                    onBack={handleBackToList}
                  />
                default:
                  return <TicketsList onSelectTicket={handleSelectTicket} userLoggedIn={userLoggedIn} />
              }
            })()}

          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

