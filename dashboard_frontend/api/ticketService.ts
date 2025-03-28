// api/ticketService.ts
import { ChatInterface, TicketInterface, UserInterface } from "@/typesNdefs/servalTypes"

const API_BASE_URL = "http://127.0.0.1:5000"

// Fetch all tickets
export async function fetchTickets(): Promise<TicketInterface[]> {
    const response = await fetch(`${API_BASE_URL}/tickets`)
    if (!response.ok) {
        throw new Error(`Error fetching tickets: ${response.statusText}`)
    }
    return response.json()
}

// Fetch a single ticket
export async function fetchTicket(ticketUuid: string): Promise<TicketInterface> {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketUuid}`)
    if (!response.ok) {
        throw new Error(`Error fetching ticket: ${response.statusText}`)
    }
    return response.json()
}

// Fetch chat messages for a ticket
export async function fetchChats(ticketUuid: string): Promise<ChatInterface[]> {
    const response = await fetch(`${API_BASE_URL}/chats/${ticketUuid}`)
    if (!response.ok) {
        throw new Error(`Error fetching chats: ${response.statusText}`)
    }
    return response.json()
}

// Fetch user details
export async function fetchUser(userUuid: string): Promise<UserInterface> {
    const response = await fetch(`${API_BASE_URL}/users/${userUuid}`)
    if (!response.ok) {
        throw new Error(`Error fetching user: ${response.statusText}`)
    }
    return response.json()
}

// Add a new chat message
export async function submitChatMessage(
    ticketUuid: string,
    message: string,
    isInternal: boolean,
    userLoggedIn: UserInterface
): Promise<ChatInterface> {
    const response = await fetch(`${API_BASE_URL}/chats/${ticketUuid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticket_uuid: ticketUuid,
            message,
            is_internal: isInternal,
            author_uuid: userLoggedIn.user_uuid,
            author_name: userLoggedIn.first_name + " " + userLoggedIn.last_name,
            author_role: userLoggedIn.role,
        }),
    })

    if (!response.ok) {
        throw new Error(`Error submitting chat message: ${response.statusText}`)
    }

    return response.json()
}

// Update ticket status
export async function updateTicketStatus(
    ticketUuid: string,
    status: string
): Promise<TicketInterface> {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketUuid}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    })

    if (!response.ok) {
        throw new Error(`Error updating ticket status: ${response.statusText}`)
    }

    return response.json()
}

// Update ticket priority
export async function updateTicketPriority(
    ticketUuid: string,
    priority: string
): Promise<TicketInterface> {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketUuid}/priority`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ priority }),
    })

    if (!response.ok) {
        throw new Error(`Error updating ticket priority: ${response.statusText}`)
    }

    return response.json()
}

// Delete a ticket
export async function deleteTicket(ticketUuid: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketUuid}`, {
        method: "DELETE",
    })

    if (!response.ok) {
        throw new Error(`Error deleting ticket: ${response.statusText}`)
    }

    return response.json()
}

// Create a new ticket
export async function createTicket(ticket: TicketInterface): Promise<TicketInterface> {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ticket),
    })

    if (!response.ok) {
        throw new Error(`Error creating ticket: ${response.statusText}`)
    }
    const data = await response.json()
    const newTicket = data as TicketInterface
    console.log("ticket created in TicketService", newTicket)

    return data
}