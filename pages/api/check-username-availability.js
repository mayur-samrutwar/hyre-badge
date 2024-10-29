import { connectToDatabase } from '@/lib/db';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.body;

    // Edge case 1: Check if username is provided
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Edge case 2: Check if username is a valid string
    if (typeof username !== 'string') {
      return res.status(400).json({ error: 'Username must be a string' });
    }

    // Edge case 3: Check username length and format
    if (username.length < 5 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be between 5 and 30 characters' });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if username exists
    const existingUser = await db.collection('users').findOne({ username: username.toLowerCase() });

    // Return the availability status
    return res.status(200).json({ available: !existingUser });

  } catch (error) {
    console.error('Error checking username availability:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
