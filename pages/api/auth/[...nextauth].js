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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { db } = await connectToDatabase()
          const existingUser = await db.collection('users').findOne({ email: user.email })
          
          if (!existingUser) {
            await db.collection('users').insertOne({
              email: user.email,
              createdAt: new Date()
            })
          }
          
          return true
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }
      return false
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('signout')) {
        return '/'
      }

      try {
        const { db } = await connectToDatabase()
        const email = decodeURIComponent(url.split('email=')[1]?.split('&')[0] || '')
        
        if (!email) {
          return `${baseUrl}/select-username`
        }

        const existingUser = await db.collection('users').findOne({ email })
        
        if (!existingUser) {
          await db.collection('users').insertOne({
            email: email,
            createdAt: new Date()
          })
          return `${baseUrl}/select-username`
        }
        
        if (existingUser.username) {
          return `${baseUrl}/test`
        }
        
        return `${baseUrl}/select-username`
      } catch (error) {
        console.error("Error in redirect callback:", error)
        return `${baseUrl}/select-username`
      }
    },
    async session({ session }) {
      try {
        const { db } = await connectToDatabase()
        const user = await db.collection('users').findOne({ email: session.user.email })
        
        if (user) {
          session.user.username = user.username
        }
        
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
}

export default NextAuth(authOptions)