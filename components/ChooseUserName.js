import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ChooseUserName() {
  const [username, setUsername] = useState("")

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

        <Button 
          className="w-full"
          disabled={!username.trim()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
