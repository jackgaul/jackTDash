export function getStatusColor(status: string) {
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

export function getPriorityColor(priority: string) {
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

export function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}