import { ChevronLeft, ChevronRight, Plus, Palette, Github, Code2, ArrowLeft, Edit2, Camera, CheckCircle2, XCircle, Trash2 } from "lucide-react"
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
  const [isNameUpdating, setIsNameUpdating] = useState(false);
  const [isBioUpdating, setIsBioUpdating] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [proofCards, setProofCards] = useState([]);

  // Authentication check
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace('/login')
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.username) {
        try {
          const res = await fetch('/api/get-card');
          if (res.ok) {
            const userData = await res.json();
            setName(userData.name);
            setBio(userData.bio);
            setAvatarSrc(userData.avatar);
            setBgColor(`#${userData.bg}`);
            
            // Convert info object to cards array
            if (userData.info) {
              const cards = Object.entries(userData.info).map(([label, value]) => ({
                label,
                value,
                id: Date.now() + Math.random() // Generate unique ID
              }));
              setProofCards(cards);
            }
          } else {
            // Use default values if no data exists
            setName("John Doe");
            setBio("Software Developer | Open Source Enthusiast");
            setAvatarSrc("https://api.dicebear.com/9.x/notionists/svg");
            setBgColor("#f5f5dc");
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Use default values on error
          setName("John Doe");
          setBio("Software Developer | Open Source Enthusiast");
          setAvatarSrc("https://api.dicebear.com/9.x/notionists/svg");
          setBgColor("#f5f5dc");
        }
      }
    };
  
    fetchUserData();
  }, [session]);

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
        onSuccess: async (proof) => {
          console.log('✅ Full Verification Proof:', proof);
          setProofData(proof);
          setVerificationStatus('success');
          
          // Parse the context data to get the repository count
          const contextData = JSON.parse(proof.claimData.context);
          const repoCount = contextData.extractedParameters.repositories;
          
          const newCard = {
            label: "Total Repositories",
            value: repoCount,
            id: Date.now()
          };

          // Add the proof data as a new card
          setProofCards(prev => [...prev, newCard]);

          try {
            // First fetch current card data
            const getCurrentCards = await fetch('/api/get-card');
            const currentData = await getCurrentCards.json();
            const currentInfo = currentData.info || {};

            // Merge existing info with new card
            const updatedInfo = {
              ...currentInfo,
              [newCard.label]: newCard.value
            };

            // Update the database with merged data
            const res = await fetch('/api/update-card', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                info: updatedInfo
              })
            });

            if (!res.ok) {
              throw new Error('Failed to update card info');
            }
          } catch (error) {
            console.error('Error updating card info:', error);
          }
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const newAvatarSrc = e.target.result;
        try {
          const res = await fetch('/api/update-card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: newAvatarSrc })
          });

          if (!res.ok) throw new Error('Failed to update avatar');
          
          setAvatarSrc(newAvatarSrc);
        } catch (error) {
          console.error('Error updating avatar:', error);
        }
      }
      reader.readAsDataURL(file)
    }
  };

  const handleNameEdit = () => {
    setTempName(name);
    setIsEditingName(true);
    setIsNameUpdating(true);
  };

  const handleBioEdit = () => {
    setTempBio(bio);
    setIsEditingBio(true);
    setIsBioUpdating(true);
  };

  const handleNameUpdate = async () => {
    try {
      const res = await fetch('/api/update-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tempName })
      });

      if (!res.ok) throw new Error('Failed to update name');
      
      setName(tempName);
      setIsEditingName(false);
      setIsNameUpdating(false);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleBioUpdate = async () => {
    try {
      const res = await fetch('/api/update-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: tempBio })
      });

      if (!res.ok) throw new Error('Failed to update bio');
      
      setBio(tempBio);
      setIsEditingBio(false);
      setIsBioUpdating(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    const cardToDelete = proofCards.find(card => card.id === cardId);
    setProofCards(prev => prev.filter(card => card.id !== cardId));

    try {
      const updatedInfo = proofCards
        .filter(card => card.id !== cardId)
        .reduce((acc, card) => ({
          ...acc,
          [card.label]: card.value
        }), {});

      const res = await fetch('/api/update-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ info: updatedInfo })
      });

      if (!res.ok) {
        throw new Error('Failed to update card info');
      }
    } catch (error) {
      console.error('Error updating card info:', error);
    }
  };

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
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="text-2xl font-bold text-center bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                      {isNameUpdating && (
                        <Button 
                          size="sm" 
                          onClick={handleNameUpdate}
                          className="mt-2"
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold flex items-center justify-center">
                      {name}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleNameEdit} 
                        className="ml-2"
                      >
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
                    <div className="flex flex-col items-center gap-2">
                      <textarea
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        className="w-full text-sm text-center bg-transparent border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                        rows={2}
                        autoFocus
                      />
                      {isBioUpdating && (
                        <Button 
                          size="sm" 
                          onClick={handleBioUpdate}
                          className="mt-2"
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 flex items-center justify-center">
                      {bio}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBioEdit} 
                        className="ml-2"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </p>
                  )}
                </div>
                <div className="w-full mt-4 space-y-3">
                  {proofCards.map(card => (
                    <div 
                      key={card.id}
                      className="group flex items-center justify-between bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-700">{card.label}:</span>
                        <span className="text-gray-600">{card.value}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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
