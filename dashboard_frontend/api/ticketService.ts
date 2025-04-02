// api/ticketService.ts
import { MessageInterface, TicketInterface, UserInterface } from "@/typesNdefs/JackTTypes"

const API_BASE_URL = "http://127.0.0.1:5000/api"

// Fetch all tickets
export async function fetchTickets(): Promise<TicketInterface[]> {
    const response = await fetch(`${API_BASE_URL}/tickets/`)

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

// Fetch messages for a ticket
export async function fetchMessages(ticketUuid: string): Promise<MessageInterface[]> {
    const response = await fetch(`${API_BASE_URL}/messages/${ticketUuid}`)
    if (!response.ok) {
        throw new Error(`Error fetching messages: ${response.statusText}`)
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

// Add a new message
export async function submitMessage(
    ticketUuid: string,
    message: string,
    isInternal: boolean,
    userLoggedIn: UserInterface
): Promise<MessageInterface> {
    const response = await fetch(`${API_BASE_URL}/messages/${ticketUuid}`, {
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
        throw new Error(`Error submitting message: ${response.statusText}`)
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
    const response = await fetch(`${API_BASE_URL}/tickets/`, {
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


    return data
}