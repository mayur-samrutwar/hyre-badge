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
            className="w-32 h-32 rounded-full bg-white mb-4 border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{userData.name}</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">{userData.bio}</p>
          
          {/* Display info cards */}
          <div className="w-full space-y-4">
            {Object.entries(userData.info || {}).map(([label, value]) => (
              <div 
                key={label}
                className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-800 text-lg">{label}</span>
                  <span className="text-gray-600 text-lg font-medium">{value}</span>
                </div>
              </div>
            ))}
          </div>
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
