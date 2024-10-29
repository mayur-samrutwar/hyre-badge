import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function ChooseUserName() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get preferred username from localStorage
    const preferredUsername = localStorage.getItem('preferredUsername')
    if (preferredUsername) {
      setUsername(preferredUsername)
      // Clear it after setting
      localStorage.removeItem('preferredUsername')
    }
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      // First check availability
      const checkRes = await fetch('/api/check-username-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      const checkData = await checkRes.json()

      if (!checkData.available) {
        setError("Username already taken")
        return
      }

      // Update username
      const res = await fetch('/api/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      // Redirect to test page
      router.push('/test')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Set Your Username</h1>
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g., mrsr"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <Button 
          className="w-full"
          disabled={!username.trim() || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Loading..." : "Next"}
        </Button>
      </div>
    </div>
  )
}
