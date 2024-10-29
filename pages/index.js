import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Component() {
  const { data: session } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  // If user is logged in, redirect to /test
  if (session) {
    router.replace('/test')
    return null
  }

  const handleCreateLink = async () => {
    if (!username) return

    try {
      // Check username availability
      const res = await fetch('/api/check-username-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      const data = await res.json()

      if (!data.available) {
        setError("Username not available")
        return
      }

      // Store username in localStorage before redirecting
      localStorage.setItem('preferredUsername', username)
      
      // Redirect to login page
      router.push('/login')
    } catch (error) {
      setError("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-2 border-black mt-2 rounded-full flex justify-between items-center py-4 px-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <img src="/logo.jpeg" alt="Bio Link Logo" className="mr-4 w-12 h-12" />
          <nav className="flex space-x-6 font-semibold">
            <Link href="#" className="text-black hover:text-gray-600">Features</Link>
            <Link href="#" className="text-black hover:text-gray-600">FAQ</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4 font-semibold">
          <Link 
            href="/login" 
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative mt-20 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Mockups */}
          <div className="flex justify-between w-full">
            {/* Left mockup */}
            <div className="w-1/3">
              <div className="relative w-full pb-[100%]">
                <img
                  src="/a-3.png"
                  alt="Left Mockup"
                  className="absolute top-0 left-0 w-60 transform rotate-6 shadow-xl p-4 rounded-xl hover:shadow-lg bg-black -mt-16"
                />
              </div>
            </div>

            {/* Center content */}
            <div className="w-full max-w-2xl px-4 mb-12 flex flex-col items-center">
              <h2 className="text-center mb-2 bg-gray-100 rounded-lg py-2 px-4">Beta Version 1.0</h2>
              <h1 className="text-center text-7xl font-bold mb-8">
                Show your skills<br />in seconds
              </h1>
              <div className="flex justify-center mb-4 w-full max-w-md">
                <div className="flex w-full border-2 border-pink-400 rounded-lg overflow-hidden">
                  <div className="flex-grow px-4 py-3 bg-white">
                    <span className="font-semibold">hyreme.xyz/</span>
                    <input
                      type="text"
                      placeholder="yourname"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                        setError("") // Clear error when typing
                      }}
                      className="focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleCreateLink}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 hover:from-pink-600 hover:to-purple-600 transition duration-200 whitespace-nowrap"
                  >
                    Create my link
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <p className="text-center text-gray-500">It&apos;s free, and takes less than a minute</p>
            </div>

            {/* Right mockup */}
            <div className="w-1/3">
              <div className="relative w-full pb-[100%]">
                <img
                  src="/a-2.png"
                  alt="Right Mockup"
                  className="absolute top-0 right-0 w-60 transform -rotate-6 shadow-xl p-4 rounded-xl hover:shadow-lg -mt-16"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="flex justify-center">
              <img src="/logo.jpeg" alt="HyreMe Logo" className="w-24 h-auto" />
            </Link>
            <ul className="text-lg flex items-center justify-center flex-col gap-7 md:flex-row md:gap-8 transition-all duration-500 py-10 mb-10 border-b border-gray-200">
              <li>
                <Link href="/privacy" className="text-gray-800 hover:text-pink-500">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="text-gray-800 hover:text-pink-500">Features</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-800 hover:text-pink-500">Terms of Use</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-800 hover:text-pink-500">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
