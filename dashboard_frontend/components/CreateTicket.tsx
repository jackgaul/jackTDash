"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketInterface, UserInterface } from "@/typesNdefs/JackTTypes"
import { createTicket } from "@/api/ticketService"


interface CreateTicketProps {
    userLoggedIn: UserInterface
    backToTicketList: () => void
}


export default function CreateTicket({ userLoggedIn, backToTicketList }: CreateTicketProps) {
    const [priority, setPriority] = useState("")
    const [status, setStatus] = useState("")
    const [category, setCategory] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [department, setDepartment] = useState("")

    const handleCreateTicket = async () => {
        console.log("Priority: ", priority, "Status: ", status, "Category: ", category, "Title: ", title, "Description: ", description)
        const newTicket: TicketInterface = {
            ticket_uuid: "",
            ticket_tag: "",
            created_at: "",
            updated_at: "",
            requesting_user_uuid: userLoggedIn.user_uuid,
            it_owner_uuid: userLoggedIn.user_uuid,
            department: department,
            priority: priority,
            status: status,
            category: category,
            title: title,
            description: description,
            raw_text: "",
        }
        const newTicketResponse = await createTicket(newTicket)
        console.log("New Ticket: ", newTicketResponse)
        backToTicketList()
    }

    return (
        <Card className="space-y-4">
            <CardHeader>
                <CardTitle>Create Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Slack">Slack</SelectItem>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Network">Network</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Okta">Okta</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Device">Device</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Customer Support">Customer Support</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
            </CardContent>
        </Card>

    )
}