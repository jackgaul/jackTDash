import { TicketInterface } from "@/typesNdefs/servalTypes"

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
    return data.message
}

