import { connectToDatabase } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { db } = await connectToDatabase()

    const userData = await db.collection('cards').findOne(
      { username: session.user.username.toLowerCase() },
      { projection: { _id: 0 } }
    )

    if (!userData) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json(userData)
  } catch (error) {
    console.error('Error fetching card:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}