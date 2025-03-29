import { TicketInterface } from "@/typesNdefs/JackTTypes"

const API_BASE_URL = "http://127.0.0.1:5000"




export async function getLLMBaseAttributes(prompt: string): Promise<TicketInterface> {
    const response = await fetch(`${API_BASE_URL}/llm/get_base_attributes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_prompt: prompt }),
    })
    const data = await response.json()
    console.log(data.message)
    if (!data.message) {
        const newTicket: TicketInterface = {
            ticket_uuid: "",
            ticket_tag: "",
            title: "",
            description: "",
            status: "",
            priority: "",
            category: "",
            created_at: "",
            updated_at: "",
            raw_text: "",
            requesting_user_uuid: "",
            it_owner_uuid: "",
            department: "",
        }
        return newTicket
    } else {
        const parsedData = JSON.parse(data.message)
        const parsedTicket: TicketInterface = {
            ticket_uuid: "",
            ticket_tag: "",
            title: parsedData.title,
            description: parsedData.description,
            status: parsedData.status,
            priority: parsedData.priority,
            category: parsedData.category,
            created_at: "",
            updated_at: "",
            raw_text: "",
            requesting_user_uuid: "",
            it_owner_uuid: "",
            department: "",
        }
        return parsedTicket
    }
}

