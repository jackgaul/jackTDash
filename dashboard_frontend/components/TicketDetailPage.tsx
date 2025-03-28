"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ChatSection } from "./my_ui/chatComponent"
import { TicketInterface, ChatInterface, UserInterface } from "@/typesNdefs/servalTypes"
import { TicketDetailsPanel } from "./my_ui/ticketDetailsPanel"
import { fetchChats, fetchUser, submitChatMessage, deleteTicket, updateTicketStatus, updateTicketPriority } from "@/api/ticketService"
import { getStatusColor, getPriorityColor, formatDate } from "@/typesNdefs/utils"

interface TicketDetailProps {
  ticket: TicketInterface
  onBack: () => void
  userLoggedIn: UserInterface
}

export default function TicketDetail({ ticket, onBack, userLoggedIn }: TicketDetailProps) {
  const [selectedTicket, setSelectedTicket] = useState<TicketInterface>(ticket)
  const [chats, setChats] = useState<ChatInterface[] | null>(null)
  const [requester, setRequester] = useState<UserInterface | null>(null)
  const [assignedTo, setAssignedTo] = useState<UserInterface | null>(null)


  useEffect(() => {

    const loadData = async () => {

      try {
        const chatsData = await fetchChats(selectedTicket.ticket_uuid)
        setChats(chatsData)

        const requesterData = await fetchUser(selectedTicket.requesting_user_uuid)
        setRequester(requesterData)

        const assignedToData = await fetchUser(selectedTicket.it_owner_uuid)
        setAssignedTo(assignedToData)

      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error loading data",
          description: "Please try again later",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [selectedTicket])

  if (!selectedTicket) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <CardTitle className="mt-2">Ticket Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested ticket could not be found.</p>
        </CardContent>
      </Card>
    )
  }


  const handleSubmitComment = async (message: string, isInternal: boolean) => {
    if (!message.trim()) return
    // TODO: Send the comment to an API
    try {
      const newChat = await submitChatMessage(
        selectedTicket.ticket_uuid,
        message,
        isInternal,
        userLoggedIn
      )

      setChats(prev => prev ? [...prev, newChat] : [newChat])

      toast({
        title: "Comment submitted",
        description: "Your comment has been added to the ticket",
      })

    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error submitting comment",
        description: "Please try again later",
        variant: "destructive",
      })
    }

  }

  const handleStatusChange = async (newStatus: string) => {
    setSelectedTicket({ ...selectedTicket, status: newStatus })
    try {
      await updateTicketStatus(selectedTicket.ticket_uuid, newStatus)
    } catch (error) {
      console.error("Error updating ticket status:", error)
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    setSelectedTicket({ ...selectedTicket, priority: newPriority })
    try {
      await updateTicketPriority(selectedTicket.ticket_uuid, newPriority)
    } catch (error) {
      console.error("Error updating ticket priority:", error)
    }
  }

  const handleDeleteTicket = async () => {
    try {
      await deleteTicket(selectedTicket.ticket_uuid)
      onBack()
    } catch (error) {
      console.error("Error deleting ticket:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{selectedTicket.ticket_tag}</span>
              <Badge variant="outline" className={`text-white ${getStatusColor(selectedTicket.status)}`}>
                {selectedTicket.status.replace("-", " ")}
              </Badge>
              <Badge variant="outline" className={`text-white ${getPriorityColor(selectedTicket.priority)}`}>
                {selectedTicket.priority}
              </Badge>
            </div>
            <CardTitle className="mt-1">{selectedTicket.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{selectedTicket.description}</p>
            </div>
            <ChatSection
              chats={chats}
              onSubmitComment={handleSubmitComment}
              chatTitle="Comments & Activity"
            />
          </div>
          <TicketDetailsPanel
            ticket={selectedTicket}
            requester={requester}
            assignedTo={assignedTo}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            onDeleteTicket={handleDeleteTicket}
          />

        </div>
      </CardContent>
    </Card>
  )
}

