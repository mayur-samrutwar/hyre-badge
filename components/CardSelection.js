import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, Briefcase } from "lucide-react"
import { useRouter } from "next/router"

export default function CardSelection() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Select Profile Type</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Tech Profile Card */}
          <Card className="p-6 hover:border-primary cursor-pointer transition-all flex flex-col justify-between">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Code2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Tech Profile</h2>
              <p className="text-center text-muted-foreground">
                Create your technical profile to showcase your skills and experience
              </p>
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => router.push('/create-tech-profile')}
            >
              Get Started
            </Button>
          </Card>

          {/* Gig Profile Card - Muted/Disabled */}
          <Card className="p-6 opacity-50 cursor-not-allowed flex flex-col justify-between">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Gig Profile</h2>
              <p className="text-center text-muted-foreground">
                Create your freelancer profile to start offering services
              </p>
              <div className="bg-secondary/50 px-4 py-2 rounded-md text-sm">
                Coming Soon
              </div>
            </div>
            <Button disabled className="w-full mt-4">
              Not Available
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
