import { connectToDatabase } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { username } = req.body

    // Validate username
    if (!username || typeof username !== 'string' || username.length < 5 || username.length > 30) {
      return res.status(400).json({ error: 'Invalid username' })
    }

    const { db } = await connectToDatabase()

    // Check if username is taken
    const existingUsername = await db.collection('users').findOne({ username: username.toLowerCase() })
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' })
    }

    // Update user's username
    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { username: username.toLowerCase() } }
    )

    // Create cards entry
    await db.collection('cards').insertOne({
      username: username.toLowerCase(),
      bg: 'f5f5dc',
      name: 'John Doe',
      bio: 'Software Developer | Open Source Enthusiast',
      avatar: 'https://api.dicebear.com/9.x/notionists/svg',
      info: {}
    });

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error updating username:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
