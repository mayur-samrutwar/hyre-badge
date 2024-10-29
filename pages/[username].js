import { useRouter } from 'next/router'
import { connectToDatabase } from '@/lib/db'

export default function UserProfile({ userData, error }) {
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">User not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: `#${userData.bg}` }}>
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="flex flex-col items-center">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="w-32 h-32 rounded-full bg-white mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
          <p className="text-gray-600 mb-8">{userData.bio}</p>
          
          {/* Render info object if it exists */}
          {Object.entries(userData.info).map(([key, value]) => (
            <div key={key} className="mb-4">
              <h3 className="font-semibold">{key}</h3>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { username } = context.params

  try {
    const { db } = await connectToDatabase()
    const userData = await db.collection('cards').findOne(
      { username: username.toLowerCase() },
      { projection: { _id: 0 } }
    )

    if (!userData) {
      return {
        props: { error: 'User not found' }
      }
    }

    return {
      props: { userData }
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return {
      props: { error: 'Failed to fetch user data' }
    }
  }
}
