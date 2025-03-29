"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, Tag, Ticket } from "lucide-react"
import { TicketInterface, UserInterface } from "@/typesNdefs/JackTTypes"
import { getStatusColor, getPriorityColor, formatDate } from "@/typesNdefs/utils"
import { fetchTickets } from "@/api/ticketService"




interface TicketsListProps {
  onSelectTicket: (ticket: TicketInterface) => void
  userLoggedIn: UserInterface
}

export default function TicketsList({ onSelectTicket, userLoggedIn }: TicketsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [tickets, setTickets] = useState<TicketInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {

    const loadTickets = async () => {
      try {
        const tickets = await fetchTickets()
        setTickets(tickets)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    loadTickets()
  }, [])

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_tag.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || ticket.status.toString() === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority.toString() === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })





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
                    <Badge variant="outline" className={`text-white ${getStatusColor(ticket.status)} `}>
                      {ticket.status.replace("-", " ")}
                    </Badge>
                    <Badge variant="outline" className={`text-white ${getPriorityColor(ticket.priority)} `}>
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

