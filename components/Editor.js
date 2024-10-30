import { ChevronLeft, ChevronRight, Plus, Palette, Github, Code2, ArrowLeft, Edit2, Camera, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useState, useRef, useEffect } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { QRCodeSVG } from 'qrcode.react';
import {ReclaimProofRequest} from '@reclaimprotocol/js-sdk';
import { PLATFORMS } from '@/lib/platforms';

export default function Editor() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bgColor, setBgColor] = useState("#f5f5dc")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [selectedProviderId, setSelectedProviderId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [name, setName] = useState("John Doe")
  const [bio, setBio] = useState("Software Developer | Open Source Enthusiast")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState("https://api.dicebear.com/9.x/notionists/svg")
  const fileInputRef = useRef(null)
  const [verificationUrl, setVerificationUrl] = useState(null);
  const [statusUrl, setStatusUrl] = useState(null);
  const [proofData, setProofData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending' | 'success' | 'failed'

  // Authentication check
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace('/login')
    }
  }, [session, status, router])

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleOptionClick = async (providerId, provider) => {
    console.log('Starting verification with details:', {
      providerId,
      provider,
      appId: process.env.NEXT_PUBLIC_RECLAIM_APP_ID,
      appSecret: process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET,
      reclaimProviderId: provider.providerId
    });
    
    setSelectedProviderId(providerId);
    setIsLoading(true);
    setProofData(null);
    setVerificationStatus('pending');
    
    try {
      const reclaimClient = await ReclaimProofRequest.init(
        process.env.NEXT_PUBLIC_RECLAIM_APP_ID,
        process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET,
        provider.providerId
      );

      console.log('ReclaimClient initialized:', reclaimClient);

      const requestUrl = await reclaimClient.getRequestUrl();
      console.log('Generated QR Code URL:', requestUrl);
      setVerificationUrl(requestUrl);

      await reclaimClient.startSession({
        onSuccess: (proof) => {
          console.log('✅ Full Verification Proof:', proof);
          setProofData(proof);
          setVerificationStatus('success');
        },
        onError: error => {
          console.error('❌ Verification failed:', error);
          setVerificationStatus('failed');
        }
      });

    } catch (error) {
      console.error('Error in verification process:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setVerificationStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Loading state
  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Not authenticated
  if (!session) {
    return null
  }

  const colors = ["#8b4513", "#deb887", "#cd5c5c", "#d2691e", "#f4a460"] 

  // Main render
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top Bar */}
      <div className="bg-white p-4 flex items-center justify-between border-b">
        <h1 className="text-lg font-semibold">Editor</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {session.user?.username || session.user?.email}
          </span>
          <Button 
            variant="outline" 
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>

      <div className="flex-grow flex">
        {/* Sidebar */}
        <div className={`h-full ${isSidebarOpen ? 'w-64' : 'w-16'} bg-black transition-all duration-300 ease-in-out flex flex-col relative`}>
          <div className="flex-grow overflow-y-auto py-4">
            {Object.values(PLATFORMS).map((platform) => (
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
                    {Object.values(platform.providers).map((provider) => (
                      <Button
                        key={provider.id}
                        className="w-full justify-start pl-10 my-1 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => handleOptionClick(provider.id, provider)}
                      >
                        {provider.label}
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
                ) : selectedProviderId && verificationUrl ? (
                  <div className="flex flex-col items-center">
                    {verificationStatus !== 'success' ? (
                      <>
                        <div className="w-64 h-64 bg-white p-4 flex items-center justify-center mb-4 animate-in fade-in-0 duration-300">
                          <QRCodeSVG
                            value={verificationUrl}
                            size={256}
                            level="H"
                          />
                        </div>
                        <p className="text-center text-sm text-muted-foreground mb-4">
                          Scan this QR code to verify your {selectedProviderId} data
                        </p>
                        
                        {verificationStatus === 'pending' && (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Waiting for verification...</span>
                          </div>
                        )}
                        {verificationStatus === 'failed' && (
                          <div className="flex items-center text-red-600 gap-2">
                            <XCircle className="h-5 w-5" />
                            <span>Verification failed. Please try again.</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                        <div className="rounded-full bg-green-100 p-3 mb-4">
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-lg font-medium text-green-600">Successfully verified!</p>
                        <p className="text-sm text-gray-500 mt-2">Your GitHub data has been verified</p>
                      </div>
                    )}
                  </div>
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
