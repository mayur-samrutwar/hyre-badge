import { useRouter } from 'next/router'

export default function UserProfile() {
  const router = useRouter()
  const { username } = router.query

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Profile page for: {username}</h1>
    </div>
  )
}
