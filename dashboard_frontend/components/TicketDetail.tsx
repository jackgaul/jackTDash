"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ChatSection } from "./chatComponent"
import { TicketInterface, ChatInterface, UserInterface } from "@/types/servalTypes"
import { TicketDetailsPanel } from "./ticketDetailsPanel"
import { fetchChats, fetchUser, submitChatMessage } from "@/api/ticketService"


interface TicketDetailProps {
  ticket: TicketInterface
  onBack: () => void
  userLoggedIn: UserInterface
}

export default function TicketDetail({ ticket: selectedTicket, onBack, userLoggedIn }: TicketDetailProps) {
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [chats, setChats] = useState<ChatInterface[] | null>(null)
  const [requester, setRequester] = useState<UserInterface | null>(null)
  const [assignedTo, setAssignedTo] = useState<UserInterface | null>(null)

  useEffect(() => {
    if (selectedTicket) {
      setStatus(selectedTicket.status)
      setPriority(selectedTicket.priority)
    }
  }, [selectedTicket])

  // Use useEffect to set initial state values
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500 hover:bg-blue-600"
      case "in-progress":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "pending":
        return "bg-purple-500 hover:bg-purple-600"
      case "closed":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-orange-500 hover:bg-orange-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    alert(`Status updated to: ${newStatus}`)
    // TODO: Update the ticket status via API
  }

  const handlePriorityChange = (newPriority: string) => {
    setPriority(newPriority)
    alert(`Priority updated to: ${newPriority}`)
    // TODO: Update the ticket priority via API
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
              <Badge variant="outline" className={`text-white ${getStatusColor(status)}`}>
                {status.replace("-", " ")}
              </Badge>
              <Badge variant="outline" className={`text-white ${getPriorityColor(priority)}`}>
                {priority}
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
              ticketUuid={selectedTicket.ticket_uuid}
              onSubmitComment={handleSubmitComment}
              chatTitle="Comments & Activity"
            />
          </div>
          <TicketDetailsPanel
            ticket={selectedTicket}
            requester={requester}
            assignedTo={assignedTo}
            status={status}
            priority={priority}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />

        </div>
      </CardContent>
    </Card>
  )
}

