import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Login() {
  const handleSignIn = async () => {
    await signIn('google', { 
      callbackUrl: '/test',
      redirect: true
    })
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
