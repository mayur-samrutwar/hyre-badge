import { ChevronLeft, ChevronRight, Plus, Palette, Github, Code2, ArrowLeft, Edit2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useState, useRef } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { HexColorPicker } from "react-colorful"

export default function Editor() {
  const [bgColor, setBgColor] = useState("#f5f5dc")  // Beige as default
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [name, setName] = useState("John Doe")
  const [bio, setBio] = useState("Software Developer | Open Source Enthusiast")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState("https://api.dicebear.com/9.x/notionists/svg")
  const fileInputRef = useRef(null)

  const colors = ["#8b4513", "#deb887", "#cd5c5c", "#d2691e", "#f4a460"]  // Warm, muted English colors

  const platforms = [
    {
      name: "GitHub",
      logo: "/logos/github.svg",
      options: ["Total Repositories", "Total Stars"]
    },
    {
      name: "LeetCode",
      logo: "/logos/leetcode.png",
      options: ["Total Questions Solved", "Total Hard Questions"]
    },
    {
      name: "CodeChef",
      logo: "/logos/codechef.svg",
      options: ["Rating"]
    },
    {
      name: "Codeforces",
      logo: "/logos/codeforces.png",
      options: ["Rating"]
    }
  ]

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsLoading(true)
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleIconClick = () => {
    setIsSidebarOpen(true)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setAvatarSrc(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top Bar */}
      <div className="bg-black p-4 flex items-center">
        <Button variant="ghost" size="icon" className="hover:text-black">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
        <h1 className="text-lg ml-4 text-white">Editor</h1>
      </div>

      <div className="flex-grow flex">
        {/* Sidebar */}
        <div className={`h-full ${isSidebarOpen ? 'w-64' : 'w-16'} bg-black transition-all duration-300 ease-in-out flex flex-col relative`}>
          <div className="flex-grow overflow-y-auto py-4">
            {platforms.map((platform) => (
              <Collapsible key={platform.name} className="mb-6">
                <CollapsibleTrigger 
                  className="flex items-center w-full p-3 rounded hover:bg-gray-800 text-white transition-colors duration-200"
                  onClick={handleIconClick}
                >
                  <Image src={platform.logo} alt={platform.name} width={24} height={24} className="mr-3" />
                  {isSidebarOpen && <span className="text-sm font-medium">{platform.name}</span>}
                </CollapsibleTrigger>
                {isSidebarOpen && (
                  <CollapsibleContent>
                    {platform.options.map((option) => (
                      <Button
                        key={option}
                        className="w-full justify-start pl-10 my-1 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </CollapsibleContent>
                )}
              </Collapsible>
            ))}
          </div>
          <Button 
            size="icon" 
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white text-black hover:bg-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <ResizablePanelGroup direction="horizontal" className="min-h-full">
            {/* Editor Panel */}
            <ResizablePanel defaultSize={50}>
              <div className="h-full p-4 flex flex-col items-center justify-center">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : selectedOption ? (
                  <>
                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mb-4">
                      QR Code Placeholder
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Scan this QR code to connect your {selectedOption} data
                    </p>
                  </>
                ) : (
                  <p>Select an option from the sidebar to get started</p>
                )}
              </div>
            </ResizablePanel>

            {/* Resizer Handle */}
            <ResizableHandle withHandle />

            {/* Preview Panel */}
            <ResizablePanel defaultSize={50}>
              <div className="h-full p-4 flex flex-col items-center" style={{ backgroundColor: bgColor }}>
                <div className="text-center mb-4">
                  {isEditingName ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      className="text-2xl font-bold text-center bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                  ) : (
                    <h2 className="text-2xl font-bold flex items-center justify-center">
                      {name}
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)} className="ml-2">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </h2>
                  )}
                </div>
                <div className="relative mb-4">
                  <img
                    src={avatarSrc}
                    alt="User Avatar"
                    width={128}
                    height={128}
                    className="bg-white rounded-full"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full p-2"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="text-center mb-4">
                  {isEditingBio ? (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      onBlur={() => setIsEditingBio(false)}
                      className="w-full text-sm text-center bg-transparent border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                      rows={2}
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm text-gray-600 flex items-center justify-center">
                      {bio}
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(true)} className="ml-2">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </p>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Floating Color Picker */}
      <div className="fixed bottom-4 right-4 flex items-center space-x-2 z-10">
        {colors.map((color, index) => (
          <button
            key={index}
            className="w-6 h-6 rounded-full shadow-lg"
            style={{ backgroundColor: color }}
            onClick={() => setBgColor(color)}
          />
        ))}
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <Palette className="h-4 w-4" />
        </Button>
        {showColorPicker && (
          <div className="absolute bottom-12 right-0">
            <HexColorPicker color={bgColor} onChange={setBgColor} />
          </div>
        )}
      </div>
    </div>
  )
}
