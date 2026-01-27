import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Search, RefreshCw, Calendar as CalendarIcon, Phone, User, Hash, FileText, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { useCalls } from "@/context/CallsContext"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { toast } from "react-hot-toast"

export default function Calls() {
    const { calls: apiCalls, loading, error, fetchCalls } = useCalls()
    const [expandedNotes, setExpandedNotes] = useState(new Set())

    const calls = useMemo(() => apiCalls, [apiCalls])

    // Extract unique users from call logs
    const uniqueUsers = useMemo(() => {
        const userMap = new Map()
        calls.forEach(call => {
            const userName = call.name || call.created_by?.name || "Unknown User"
            const userId = call.userId || call.created_by?._id || userName
            
            if (!userMap.has(userId)) {
                userMap.set(userId, {
                    user_id: userId,
                    name: userName,
                    role: call.role || "user"
                })
            }
        })
        return Array.from(userMap.values())
    }, [calls])

    const toggleNoteExpansion = (callId) => {
        setExpandedNotes(prev => {
            const newSet = new Set(prev)
            if (newSet.has(callId)) {
                newSet.delete(callId)
            } else {
                newSet.add(callId)
            }
            return newSet
        })
    }

    const truncateText = (text, maxLength = 100) => {
        if (!text || text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    const [searchTerm, setSearchTerm] = useState("")
    const [userFilter, setUserFilter] = useState("all")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")

    useEffect(() => {
        const loadCalls = async () => {
            try {
                await fetchCalls()
                if (apiCalls.length > 0) {
                    toast.success(`${apiCalls.length} calls loaded`)
                }
            } catch (err) {
                toast.error('Could not load calls. Please try again.')
                console.error('Error loading calls:', err)
            }
        }
        loadCalls()
    }, [fetchCalls, apiCalls.length])
    const filteredCalls = useMemo(() => {
        return calls.filter((call) => {
            const userName = call.name || call.created_by?.name || ""
            const userRole = call.role || ""
            const leadId = call.leadId?.lead_id?.toString() || "N/A"
            const matchesSearch =
                (call.note?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                userRole.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesUser = userFilter === "all" || (call.userId === userFilter) || (call.created_by?._id === userFilter)

            const callDate = new Date(call.created_at || call.createdAt)
            const matchesFromDate = !fromDate || callDate >= new Date(fromDate)
            const matchesToDate = !toDate || callDate <= new Date(toDate + "T23:59:59")

            return matchesSearch && matchesUser && matchesFromDate && matchesToDate
        })
    }, [calls, searchTerm, userFilter, fromDate, toDate])

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-1xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            <Phone className="h-8 w-8 text-indigo-600" />
                            Call History
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            View and manage all communication history with leads.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    try {
                                        await fetchCalls()
                                        toast.success(`${apiCalls.length} calls refreshed`)
                                    } catch (err) {
                                        toast.error('Could not refresh calls. Please try again.')
                                        console.error('Error refreshing calls:', err)
                                    }
                                }}
                                disabled={loading}
                                className="bg-white hover:bg-slate-50 border-slate-200"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                    </div>
                </div>

                {/* Filters Card */}
                <Card className="border-none shadow-sm bg-white p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Lead ID, user, message..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-slate-200 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">User</Label>
                            <Select value={userFilter} onValueChange={setUserFilter}>
                                <SelectTrigger className="border-slate-200 focus:ring-indigo-500">
                                    <SelectValue placeholder="Select User" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all">All Users</SelectItem>
                                    {uniqueUsers.map((user) => (
                                        <SelectItem key={user.user_id} value={user.user_id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div> */}

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">From Date</Label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="pl-10 border-slate-200 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">To Date</Label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="pl-10 border-slate-200 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Table Card */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[120px] font-semibold text-slate-600">Lead ID</TableHead>
                                    <TableHead className="w-[150px] font-semibold text-slate-600">User</TableHead>
                                    <TableHead className="w-[120px] font-semibold text-slate-600">Role</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Note</TableHead>
                                    <TableHead className="w-[180px] font-semibold text-slate-600">Date & Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {error ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-red-500">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <span>Failed to load calls. Please try again.</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={fetchCalls}
                                                    className="mt-2"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Retry
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                                                <p className="text-slate-500 font-medium">Fetching call logs...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredCalls.length > 0 ? (
                                    filteredCalls.map((call) => (
                                        <TableRow
                                            key={call._id}
                                            className="hover:bg-slate-50/80 transition-colors border-slate-100"
                                        >
                                            <TableCell className="font-medium text-indigo-600">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-3 w-3" />
                                                    {call.leadId?.lead_id || "N/A"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                        <User className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-slate-700 font-medium block truncate">
                                                            {call.name || call.created_by?.name || "Unknown User"}
                                                        </span>
                                                        <span className="text-xs text-slate-400 truncate block">
                                                            {call.created_by?.email || ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    call.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    call.role === 'tele_caller' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {call.role || "user"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <div className="flex items-start gap-2 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                                                    <MessageSquare className="h-4 w-4 text-indigo-400 mt-1 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-600 text-sm whitespace-pre-wrap break-words">
                                                            {expandedNotes.has(call._id) 
                                                                ? (call.note || "No note content")
                                                                : truncateText(call.note || "No note content", 100)
                                                            }
                                                        </p>
                                                        {call.note && call.note.length > 100 && (
                                                            <button
                                                                onClick={() => toggleNoteExpansion(call._id)}
                                                                className="flex items-center gap-1 mt-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                                                            >
                                                                {expandedNotes.has(call._id) ? (
                                                                    <>
                                                                        <ChevronUp className="h-3 w-3" />
                                                                        Show less
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ChevronDown className="h-3 w-3" />
                                                                        Show more
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-slate-500 text-sm">
                                                    <p className="font-medium text-slate-700">
                                                        {call.created_at || call.createdAt ? format(new Date(call.created_at || call.createdAt), "MMM dd, yyyy") : "N/A"}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {call.created_at || call.createdAt ? format(new Date(call.created_at || call.createdAt), "hh:mm a") : ""}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 opacity-60">
                                                <Phone className="h-12 w-12 text-slate-300 mb-2" />
                                                <p className="text-slate-500 font-medium text-lg">No calls found</p>
                                                <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer */}
                    {!loading && filteredCalls.length > 0 && (
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
                            <span>Showing {filteredCalls.length} of {calls.length} logs</span>
                            <div className="flex gap-1">
                                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-400 cursor-not-allowed">Prev</span>
                                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-400 cursor-not-allowed">Next</span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
