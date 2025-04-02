"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ChatSection } from "./my_ui/chatComponent"
import { TicketInterface, MessageInterface, UserInterface } from "@/typesNdefs/JackTTypes"
import { TicketDetailsPanel } from "./my_ui/ticketDetailsPanel"
import { fetchMessages, fetchUser, submitMessage, deleteTicket, updateTicketStatus, updateTicketPriority } from "@/api/ticketService"
import { getStatusColor, getPriorityColor, formatDate } from "@/typesNdefs/utils"
import { io, Socket } from "socket.io-client"
interface TicketDetailProps {
  ticket: TicketInterface
  onBack: () => void
  userLoggedIn: UserInterface
}

export default function TicketDetail({ ticket, onBack, userLoggedIn }: TicketDetailProps) {
  const [selectedTicket, setSelectedTicket] = useState<TicketInterface>(ticket)
  const [messages, setMessages] = useState<MessageInterface[] | null>(null)
  const [requester, setRequester] = useState<UserInterface | null>(null)
  const [assignedTo, setAssignedTo] = useState<UserInterface | null>(null)

  const [room, setRoom] = useState<string>("")
  const [socket, setSocket] = useState<Socket | null>(null)


  useEffect(() => {

    const loadData = async () => {

      try {
        const messagesData = await fetchMessages(selectedTicket.ticket_uuid)
        setMessages(messagesData)

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
  }, [])

  useEffect(() => {
    const newSocket = io("http://127.0.0.1:5000/socket/messages")
    setSocket(newSocket)

    if (newSocket) {
      console.log("Connected to the socket")
    }
    newSocket.emit("join", {
      author_name: userLoggedIn.first_name + "_" + userLoggedIn.last_name,
      ticket_tag: selectedTicket.ticket_tag
    })
    setRoom(selectedTicket.ticket_tag)

    newSocket.on("new_message", (newMessage: MessageInterface) => {
      //setMessages(prev => prev ? [...prev, data] : [data])

      setMessages(prev => prev ? [...prev, newMessage] : [newMessage])
    })

    newSocket.on("system_message", (data: MessageInterface) => {
      console.log(data)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleSendMessage = (message: string, isInternal: boolean) => {
    if (!message.trim()) return
    console.log("Sending message:", message, isInternal)


    try {
      if (socket) {
        console.log("Sending message to socket")
        console.log(userLoggedIn)
        console.log(selectedTicket)
        socket.emit("send_message", {
          message: message,
          is_internal: isInternal,
          author_uuid: userLoggedIn.user_uuid,
          author_name: userLoggedIn.first_name + " " + userLoggedIn.last_name,
          author_role: userLoggedIn.role,
          ticket_uuid: selectedTicket.ticket_uuid,
          ticket_tag: selectedTicket.ticket_tag
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

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
              messages={messages}
              onSubmitComment={handleSendMessage}
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

