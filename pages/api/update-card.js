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

    const updates = req.body
    
    // Create an update object only with provided fields
    const updateFields = {};
    if (updates.name !== undefined) updateFields.name = updates.name;
    if (updates.bio !== undefined) updateFields.bio = updates.bio;
    if (updates.avatar !== undefined) updateFields.avatar = updates.avatar;
    if (updates.bg !== undefined) updateFields.bg = updates.bg.replace('#', '');

    // Only proceed if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { db } = await connectToDatabase()

    // Update only the provided fields
    await db.collection('cards').updateOne(
      { username: session.user.username },
      { $set: updateFields }
    )

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error updating card:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
