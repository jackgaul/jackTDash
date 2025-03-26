"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MessageSquare, Paperclip, Clock, User, Tag, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Mock data for a single ticket
// const ticketsData = {
//   "TICKET-1001": {
//     ticket_uuid: "TICKET-1001",
//     ticket_tag: "TICKET-1001",
//     title: "Email service not working",
//     status: "open",
//     priority: "high",
//     category: "Email",
//     createdAt: "2023-04-10T09:00:00",
//     updatedAt: "2023-04-10T14:30:00",
//     description:
//       "Users are unable to send or receive emails since this morning. The issue appears to be affecting all departments. Initial investigation suggests it might be related to the recent server update.",
//     assignedTo: "John Doe",
//     requester: "Sarah Johnson",
//     department: "Marketing",
//     comments: [
//       {
//         id: "comment-1",
//         author: "Sarah Johnson",
//         authorRole: "Marketing Manager",
//         content:
//           "The entire marketing team is unable to send or receive emails. This is urgent as we have a campaign scheduled for today.",
//         timestamp: "2023-04-10T09:00:00",
//         isInternal: false,
//       },
//       {
//         id: "comment-2",
//         author: "John Doe",
//         authorRole: "IT Support",
//         content:
//           "I'm looking into the issue. Initial investigation shows that the mail server is running but there might be an issue with the connection to the external mail gateway.",
//         timestamp: "2023-04-10T09:30:00",
//         isInternal: true,
//       },
//       {
//         id: "comment-3",
//         author: "System",
//         authorRole: "Automated",
//         content: "Ticket status changed from 'new' to 'open'. Assigned to John Doe.",
//         timestamp: "2023-04-10T09:35:00",
//         isInternal: true,
//       },
//       {
//         id: "comment-4",
//         author: "John Doe",
//         authorRole: "IT Support",
//         content:
//           "I've restarted the mail gateway service and am monitoring the situation. Please let me know if you start receiving emails in the next 15 minutes.",
//         timestamp: "2023-04-10T10:15:00",
//         isInternal: false,
//       },
//     ],
//   },
//   "TICKET-1002": {
//     ticket_uuid: "TICKET-1002",
//     ticket_tag: "TICKET-1002",
//     title: "VPN connection issues",
//     status: "in-progress",
//     priority: "medium",
//     category: "Network",
//     createdAt: "2023-04-09T11:20:00",
//     updatedAt: "2023-04-10T10:15:00",
//     description:
//       "Remote workers are experiencing intermittent VPN disconnections. This is affecting productivity for the development team working from home.",
//     assignedTo: "John Doe",
//     requester: "Michael Chen",
//     department: "Development",
//     comments: [
//       {
//         id: "comment-1",
//         author: "Michael Chen",
//         authorRole: "Lead Developer",
//         content:
//           "Our remote team is experiencing frequent VPN disconnections today. It's disrupting our workflow significantly.",
//         timestamp: "2023-04-09T11:20:00",
//         isInternal: false,
//       },
//       {
//         id: "comment-2",
//         author: "System",
//         authorRole: "Automated",
//         content: "Ticket status changed from 'new' to 'open'. Assigned to John Doe.",
//         timestamp: "2023-04-09T11:25:00",
//         isInternal: true,
//       },
//       {
//         id: "comment-3",
//         author: "John Doe",
//         authorRole: "IT Support",
//         content: "I'm checking the VPN server logs to identify the issue. Will update shortly.",
//         timestamp: "2023-04-09T11:40:00",
//         isInternal: false,
//       },
//     ],
//   },
//   "TICKET-1003": {
//     ticket_uuid: "TICKET-1003",
//     ticket_tag: "TICKET-1003",
//     title: "New software installation request",
//     status: "pending",
//     priority: "low",
//     category: "Software",
//     createdAt: "2023-04-08T15:45:00",
//     updatedAt: "2023-04-09T09:30:00",
//     description: "Marketing department requesting Adobe Creative Suite installation on 5 workstations.",
//     assignedTo: "John Doe",
//     requester: "Emma Wilson",
//     department: "Marketing",
//     comments: [],
//   },
//   "TICKET-1004": {
//     ticket_uuid: "TICKET-1004",
//     ticket_tag: "TICKET-1004",
//     title: "Printer not responding",
//     status: "open",
//     priority: "medium",
//     category: "Hardware",
//     createdAt: "2023-04-10T08:30:00",
//     updatedAt: "2023-04-10T08:30:00",
//     description: "Main office printer is not responding to print jobs.",
//     assignedTo: "John Doe",
//     requester: "David Brown",
//     department: "Operations",
//     comments: [],
//   },
//   "TICKET-1005": {
//     ticket_uuid: "TICKET-1005",
//     ticket_tag: "TICKET-1005",
//     title: "Password reset request",
//     status: "closed",
//     priority: "low",
//     category: "Account",
//     createdAt: "2023-04-09T14:00:00",
//     updatedAt: "2023-04-09T14:15:00",
//     description: "User requesting password reset for their account.",
//     assignedTo: "John Doe",
//     requester: "Lisa Taylor",
//     department: "Finance",
//     comments: [],
//   },
//   "TICKET-1006": {
//     ticket_uuid: "TICKET-1006",
//     ticket_tag: "TICKET-1006",
//     title: "Server maintenance notification",
//     status: "in-progress",
//     priority: "high",
//     category: "Server",
//     createdAt: "2023-04-07T16:20:00",
//     updatedAt: "2023-04-10T11:45:00",
//     description: "Scheduled server maintenance notification to all departments.",
//     assignedTo: "John Doe",
//     requester: "Robert Miller",
//     department: "IT",
//     comments: [],
//   },
//   "TICKET-1007": {
//     ticket_uuid: "TICKET-1007",
//     ticket_tag: "TICKET-1007",
//     title: "New employee onboarding",
//     status: "pending",
//     priority: "medium",
//     category: "HR",
//     createdAt: "2023-04-06T10:30:00",
//     updatedAt: "2023-04-08T15:20:00",
//     description: "Setup workstation and accounts for new employee starting next week.",
//     assignedTo: "John Doe",
//     requester: "Jennifer Clark",
//     department: "HR",
//     comments: [],
//   },
// }



interface Ticket {
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

interface Chat {
  message_uuid: string
  ticket_uuid: string
  message: string
  created_at: string
  author: string
  author_role: string
  is_internal: boolean
}

interface User {
  user_uuid: string
  name: string
  email: string
  role: string
}

interface TicketDetailProps {
  ticket: Ticket
  onBack: () => void
}

export default function TicketDetail({ ticket: selectedTicket, onBack }: TicketDetailProps) {
  const [newComment, setNewComment] = useState("")
  const [isInternalNote, setIsInternalNote] = useState(false)
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  //const [ticket, setTicket] = useState<Ticket | null>(null)
  const [chats, setChats] = useState<Chat[] | null>(null)
  const [requester, setRequester] = useState<User | null>(null)
  const [assignedTo, setAssignedTo] = useState<User | null>(null)
  // Get ticket data or show not found
  //const ticket = ticketsData[ticketUuid as keyof typeof ticketsData]



  // Use useEffect to set initial state values
  useEffect(() => {

    // const fetchTicket = async () => {
    //   const response = await fetch(`http://127.0.0.1:5000/tickets/${ticketUuid}`)
    //   const data = await response.json()
    //   setTicket(data)
    // }

    const fetchChats = async () => {
      const response = await fetch(`http://127.0.0.1:5000/chats/${selectedTicket.ticket_uuid}`)
      const data = await response.json()
      setChats(data)
    }

    const fetchRequester = async () => {
      const response = await fetch(`http://127.0.0.1:5000/users/${selectedTicket.requesting_user_uuid}`)
      const data = await response.json()
      setRequester(data)
    }

    const fetchAssignedTo = async () => {
      const response = await fetch(`http://127.0.0.1:5000/users/${selectedTicket.it_owner_uuid}`)
      const data = await response.json()
      setAssignedTo(data)
    }

    //fetchTicket()
    fetchChats()
    fetchRequester()
    fetchAssignedTo()

  }, [selectedTicket])

  if (!selectedTicket) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <CardTitle className="mt-2">Ticket Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested ticket could not be found.</p>
        </CardContent>
      </Card>
    )
  }

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
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // In a real app, this would send the comment to an API
      alert(`Comment submitted: ${newComment} (Internal: ${isInternalNote})`)
      setNewComment("")
      setIsInternalNote(false)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // In a real app, this would update the ticket status via API
  }

  const handlePriorityChange = (newPriority: string) => {
    setPriority(newPriority)
    // In a real app, this would update the ticket priority via API
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{selectedTicket.ticket_tag}</span>
              <Badge variant="outline" className={`text-white ${getStatusColor(status)}`}>
                {status.replace("-", " ")}
              </Badge>
              <Badge variant="outline" className={`text-white ${getPriorityColor(priority)}`}>
                {priority}
              </Badge>
            </div>
            <CardTitle className="mt-1">{selectedTicket.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{selectedTicket.description}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Comments & Activity</h3>
                <Badge variant="outline" className="font-normal">
                  {chats?.length || 0} entries
                </Badge>
              </div>

              <div className="space-y-4">
                {chats && chats.length > 0 ? (
                  chats.map((chat) => (
                    <div
                      key={chat.message_uuid}
                      className={`p-4 rounded-lg border ${chat.is_internal ? "bg-muted/50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={chat.author === "Serval" ? "" : "/placeholder-user.jpg"} />
                          <AvatarFallback>
                            {chat.author === "Serval"
                              ? "SER"
                              : chat.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <div>
                              <span className="font-medium">{chat.author}</span>
                              <span className="text-xs text-muted-foreground ml-2">{chat.author_role}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(chat.created_at)}</span>
                          </div>
                          <p className="text-sm">{chat.message}</p>
                          {chat.is_internal && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              Internal Note
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No comments yet</div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-medium">Add Comment</h4>
                <Textarea
                  placeholder="Type your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-1" /> Attach
                    </Button>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="internal-note"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="internal-note" className="text-sm">
                        Internal note
                      </label>
                    </div>
                  </div>
                  <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-2" /> Status
                  </h4>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" /> Priority
                  </h4>
                  <Select value={priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" /> Requester
                  </h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {requester?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{requester?.name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" /> Assigned To
                  </h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {assignedTo?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{assignedTo?.name}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Created
                  </h4>
                  <span className="text-sm">{formatDate(selectedTicket.created_at)}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Updated
                  </h4>
                  <span className="text-sm">{formatDate(selectedTicket.updated_at)}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-2" /> Category
                  </h4>
                  <span className="text-sm">{selectedTicket.category}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-2" /> Department
                  </h4>
                  <span className="text-sm">{selectedTicket.department}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Assign to me
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" /> Send Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Paperclip className="h-4 w-4 mr-2" /> Manage Attachments
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" /> Escalate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

