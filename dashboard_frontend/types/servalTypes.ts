export interface TicketInterface {
    ticket_uuid: string
    ticket_tag: string
    title: string
    status: string
    priority: string
    category: string
    created_at: string
    updated_at: string
    description: string
    raw_text: string
    requesting_user_uuid: string
    it_owner_uuid: string
    department: string
}

export interface ChatInterface {
    message_uuid: string
    ticket_uuid: string
    message: string
    created_at: string
    author: string
    author_role: string
    is_internal: boolean
}

export interface UserInterface {
    user_uuid: string
    name: string
    email: string
    role: string
}