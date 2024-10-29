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
            createdAt: new Date(),
          })
        }
        
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async session({ session }) {
      try {
        const { db } = await connectToDatabase()
        const dbUser = await db.collection('users').findOne({ email: session.user.email })
        
        if (dbUser) {
          session.user.username = dbUser.username
        }
        
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // Extract email from the session token in the URL
        const { db } = await connectToDatabase()
        const email = decodeURIComponent(url.split('email=')[1]?.split('&')[0] || '')
        
        if (!email) {
          return `${baseUrl}/test`
        }

        const existingUser = await db.collection('users').findOne({ email })
        
        // If user exists and has a username, go to test
        if (existingUser?.username) {
          return `${baseUrl}/test`
        }
        
        // If user exists but no username, go to username selection
        if (existingUser && !existingUser.username) {
          return `${baseUrl}/select-username`
        }
        
        // Default fallback
        return `${baseUrl}/test`
      } catch (error) {
        console.error("Error in redirect callback:", error)
        return `${baseUrl}/test`
      }
    }
  },
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(authOptions)