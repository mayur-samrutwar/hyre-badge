import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { connectToDatabase } from "@/lib/db"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const { db } = await connectToDatabase()
        
        // Check if user exists
        const existingUser = await db.collection('users').findOne({ email: user.email })
        
        if (!existingUser) {
          // Create new user if doesn't exist
          await db.collection('users').insertOne({
            email: user.email,
            username: profile.name, // Using name from Google profile as username
            createdAt: new Date(),
          })
        }
        
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async session({ session, user }) {
      try {
        const { db } = await connectToDatabase()
        
        // Get user data from database
        const dbUser = await db.collection('users').findOne({ email: session.user.email })
        
        if (dbUser) {
          session.user.id = dbUser._id
          session.user.username = dbUser.username
          // Remove name and image from session as per instructions
          delete session.user.name
          delete session.user.image
        }
        
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)

