"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserInterface, ChatInterface, TicketInterface } from "@/typesNdefs/JackTTypes"
import { ChatSection } from "./my_ui/chatComponent"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { fetchChats, submitChatMessage, createTicket, updateTicketStatus, updateTicketPriority } from "@/api/ticketService"
import { TicketDetailsPanel } from "./my_ui/ticketDetailsPanel"
import { getStatusColor, getPriorityColor, formatDate } from "@/typesNdefs/utils"
import { getLLMBaseAttributes } from "@/api/llmService"

interface JackTChatProps {
    userLoggedIn: UserInterface
    onBack: () => void
}


export default function JackTChat({ userLoggedIn, onBack }: JackTChatProps) {
    const [chats, setChats] = useState<ChatInterface[]>([])
    const [selectedTicket, setSelectedTicket] = useState<TicketInterface>({
        ticket_uuid: "",
        ticket_tag: "",
        title: "",
        status: "",
        priority: "",
        category: "",
        created_at: "",
        updated_at: "",
        description: "",
        raw_text: "",
        requesting_user_uuid: userLoggedIn.user_uuid,
        it_owner_uuid: userLoggedIn.user_uuid,
        department: "",
    })

    const handleSubmitComment = async (message: string, isInternal: boolean = true) => {
        if (!message.trim()) return
        let ticket_to_use: TicketInterface;
        if (selectedTicket.ticket_uuid === "") {
            const llm_ticket_attributes = await getLLMBaseAttributes(message)
            const llm_ticket_attributes_json = JSON.parse(llm_ticket_attributes)
            let llmTicket: TicketInterface = {
                ticket_uuid: "",
                ticket_tag: "",
                title: llm_ticket_attributes_json.title,
                description: llm_ticket_attributes_json.description,
                status: llm_ticket_attributes_json.status,
                priority: llm_ticket_attributes_json.priority,
                category: llm_ticket_attributes_json.category,
                department: llm_ticket_attributes_json.department,
                requesting_user_uuid: userLoggedIn.user_uuid,
                it_owner_uuid: userLoggedIn.user_uuid,
                created_at: "",
                updated_at: "",
                raw_text: "",
            }

            const newTicket = await createTicket(llmTicket)
            setSelectedTicket(newTicket)
            ticket_to_use = newTicket
        } else {
            ticket_to_use = selectedTicket
        }

        try {
            const newChat = await submitChatMessage(
                ticket_to_use.ticket_uuid,
                message,
                isInternal,
                userLoggedIn
            )
            setChats(prev => prev ? [...prev, newChat] : [newChat])
        } catch (error) {
            console.error("Error submitting comment:", error)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (selectedTicket) {
            try {
                await updateTicketStatus(selectedTicket.ticket_uuid, newStatus)
                setSelectedTicket({ ...selectedTicket, status: newStatus })
            } catch (error) {
                console.error("Error updating ticket status:", error)
            }
        }
    }

    const handlePriorityChange = async (newPriority: string) => {
        if (selectedTicket) {
            try {
                await updateTicketPriority(selectedTicket.ticket_uuid, newPriority)
                setSelectedTicket({ ...selectedTicket, priority: newPriority })
            } catch (error) {
                console.error("Error updating ticket priority:", error)
            }
        }
    }



    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="mt-1">JackT Chat</CardTitle>

            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="h-full">
                            <ChatSection
                                chats={chats}
                                onSubmitComment={handleSubmitComment}
                                chatTitle={""}
                            />
                        </div>
                    </div>
                    <TicketDetailsPanel
                        ticket={selectedTicket}
                        requester={userLoggedIn}
                        assignedTo={userLoggedIn}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                        formatDate={formatDate}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                        onDeleteTicket={() => { }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}