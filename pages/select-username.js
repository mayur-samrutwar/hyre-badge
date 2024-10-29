import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import ChooseUserName from "@/components/ChooseUserName"
import { useEffect } from "react"

export default function SelectUsername() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.username) {
      router.replace('/test')
    }
  }, [session, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push('/login')
    return null
  }

  if (session?.user?.username) {
    return null
  }

  return <ChooseUserName />
}
