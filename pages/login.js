import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Login() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const callbackUrl = router.query.callbackUrl || '/'

  useEffect(() => {
    if (session) {
      router.replace(callbackUrl)
    }
  }, [session, router, callbackUrl])

  const handleSignIn = async () => {
    await signIn('google', { 
      redirect: true
    })
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Button 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleSignIn}
        >
          <img 
            src="/logos/google.svg" 
            alt="Google logo" 
            className="w-5 h-5"
          />
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
