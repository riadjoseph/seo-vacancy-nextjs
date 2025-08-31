import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Linkedin, Twitter } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contact Us | WakeUpHappy - SEO Job Board',
  description: 'Get in touch with us on X (Twitter) or LinkedIn. We\'d love to hear from you about job opportunities or feedback.',
  openGraph: {
    title: 'Contact Us | WakeUpHappy',
    description: 'Connect with us on social media for questions or feedback.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          Contact Us
        </h1>
        <p className="text-gray-600">
          If you have any questions about this website or anything else SEO related for that matter, 
          please reach out on my social account. I'd love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Twitter/X Contact */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-400" />
              X (formerly Twitter)
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Quick questions, feedback, or just want to chat about SEO? 
              Drop me a message on X.
            </p>
            <a 
              href="https://x.com/riadjosephs" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-black hover:bg-gray-800 text-white">
                @riadjosephs
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* LinkedIn Contact */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-blue-600" />
              LinkedIn
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              For professional inquiries, partnership opportunities, 
              or career-related discussions.
            </p>
            <a 
              href="https://www.linkedin.com/in/riadjoseph/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Connect on LinkedIn
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* What to Contact About */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <h2 className="text-2xl font-bold text-blue-800">What Should You Contact Us About?</h2>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">General Questions</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Privacy Policy questions</li>
                <li>• How the platform works</li>
                <li>• Technical SEO aspects we're testing</li>
                <li>• Feedback and suggestions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Professional Inquiries</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Partnership opportunities</li>
                <li>• Bulk job posting requests</li>
                <li>• Media and press inquiries</li>
                <li>• SEO industry discussions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fun Note */}
      <div className="mt-8 text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
        <p className="text-gray-700 mb-4">
          <strong>Fun fact:</strong> We're real people, not bots! 🤖 Another Fun Fact is that I first built this site with VITE JS, 100% client-side (yes, an SEO / GEO nightmare) and Claude of Anthropic helped me localize it to Next JS with SSR and caching.  How cool is that! Credits to Claude where due ;)
        </p>
        <p className="text-gray-600 text-sm">
          Built by SEO professionals who understand the struggle of finding quality job opportunities. 
          We're always happy to chat about the industry, technical challenges, or just say hi!
        </p>
      </div>
    </div>
  )
}