import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { callsAPI } from "@/services/api"
import toast from "react-hot-toast"

const CallsContext = createContext()

export function CallsProvider({ children }) {
    const [calls, setCalls] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchCalls = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await callsAPI.getAll()
            setCalls(data)
        } catch (err) {
            console.error("Failed to fetch calls:", err)
            setError(err.message)
            toast.error("Failed to load calls")
        } finally {
            setLoading(false)
        }
    }, [])

    const addCall = async (callData) => {
        try {
            const newCall = await callsAPI.create(callData)
            setCalls((prev) => [newCall, ...prev])
            toast.success("Call logged successfully")
            return newCall
        } catch (err) {
            toast.error("Failed to log call")
            throw err
        }
    }

    const updateCall = async (id, callData) => {
        try {
            const updated = await callsAPI.update(id, callData)
            setCalls((prev) => prev.map((c) => (c._id === id ? updated : c)))
            toast.success("Call updated successfully")
            return updated
        } catch (err) {
            toast.error("Failed to update call")
            throw err
        }
    }

    const deleteCall = async (id) => {
        try {
            await callsAPI.delete(id)
            setCalls((prev) => prev.filter((c) => c._id !== id))
            toast.success("Call deleted successfully")
        } catch (err) {
            toast.error("Failed to delete call")
            throw err
        }
    }

    // Fetch calls on component mount
    useEffect(() => {
        fetchCalls()
    }, [fetchCalls])

    return (
        <CallsContext.Provider
            value={{
                calls,
                loading,
                error,
                fetchCalls,
                addCall,
                updateCall,
                deleteCall,
            }}
        >
            {children}
        </CallsContext.Provider>
    )
}

export function useCalls() {
    const context = useContext(CallsContext)
    if (!context) {
        throw new Error("useCalls must be used within a CallsProvider")
    }
    return context
}
