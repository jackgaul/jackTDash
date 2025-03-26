"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, Tag } from "lucide-react"

// Mock data for tickets
const tickets = [
  {
    "category": "Database",
    "created_at": "Tue, 11 Apr 2023 03:15:00 GMT",
    "description": "Nightly database backup job failed to complete",
    "id": 1,
    "it_owner_id": 1,
    "priority": "high",
    "raw_text": "Automated backup process for production database cluster failed during overnight run. Error logs show potential disk space issues. Immediate investigation required to ensure data safety.",
    "requesting_user_id": 201,
    "status": "open",
    "ticket_id": "TICKET-1001",
    "title": "Database backup failure",
    "updated_at": "Tue, 11 Apr 2023 07:30:00 GMT"
  },
  {
    "category": "Slack",
    "created_at": "Tue, 11 Apr 2023 08:00:00 GMT",
    "description": "Critical Windows updates failing to deploy to marketing department machines",
    "id": 2,
    "it_owner_id": 1,
    "priority": "high",
    "raw_text": "SCCM reporting 23 workstations in Marketing department failed to receive latest security patches. Error code 0x80070002 appearing in logs. Potential security risk.",
    "requesting_user_id": 202,
    "status": "open",
    "ticket_id": "TICKET-1002",
    "title": "Windows update deployment issue",
    "updated_at": "Tue, 11 Apr 2023 09:45:00 GMT"
  },
  {
    "category": "Network",
    "created_at": "Tue, 11 Apr 2023 07:15:00 GMT",
    "description": "Core switch on 3rd floor showing intermittent failures",
    "id": 3,
    "it_owner_id": 1,
    "priority": "high",
    "raw_text": "Switch SW-3F-CORE-01 reporting multiple interface errors. Affecting approximately 50 users on floor 3. Redundant path active but operating at reduced capacity.",
    "requesting_user_id": 203,
    "status": "open",
    "ticket_id": "TICKET-1003",
    "title": "Network switch malfunction",
    "updated_at": "Tue, 11 Apr 2023 08:00:00 GMT"
  },
  {
    "category": "Email",
    "created_at": "Mon, 10 Apr 2023 09:00:00 GMT",
    "description": "Users are unable to send or receive emails since this morning.",
    "id": 4,
    "it_owner_id": 1,
    "priority": "high",
    "raw_text": "Multiple users reported inability to send or receive emails. System-wide email outage affecting all departments. Requires immediate attention.",
    "requesting_user_id": 101,
    "status": "open",
    "ticket_id": "TICKET-1004",
    "title": "Email service not working",
    "updated_at": "Mon, 10 Apr 2023 14:30:00 GMT"
  },
]

export interface Ticket {
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

interface TicketsListProps {
  onSelectTicket: (ticket: Ticket) => void
}

export default function TicketsList({ onSelectTicket }: TicketsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/tickets')
        if (!response.ok) {
          throw new Error('Failed to fetch tickets')
        }
        const data = await response.json()
        console.log(data)
        setTickets(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_tag.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || ticket.status.toString() === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority.toString() === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })



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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading tickets...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>View and manage your assigned tickets</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="text-sm text-muted-foreground mb-4">Showing {filteredTickets.length} tickets</div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-background rounded-lg border p-8">
          No tickets found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket.ticket_uuid}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectTicket(ticket)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-muted-foreground">#{ticket.ticket_tag}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`text-white ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace("-", " ")}
                    </Badge>
                    <Badge variant="outline" className={`text-white ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{ticket.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-muted-foreground pt-0">
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{ticket.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(ticket.updated_at)}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

