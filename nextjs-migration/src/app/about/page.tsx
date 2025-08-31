import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Target, Zap, Shield, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About WakeUpHappy - No-BS Job Board for SEO Professionals | Europe',
  description: 'Seamless job posting without the clutter: no newsletters, no ads, no endless loops, just results. Support our mission by posting your SEO job here.',
  openGraph: {
    title: 'About WakeUpHappy - No-BS Job Board for SEO Professionals',
    description: 'Eliminate the distractions, we focus on the job opportunities that matter to you, only.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          WakeUpHappy: A no-BS Job Board for SEO Professionals in Europe
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Free job vacancy posting without the clutter: no ads, no newsletters, no spam, no endless loops, just results. 
          Support our platform by posting your SEO job here. <a href="https://buymeacoffee.com/riadjoseph" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Buy us a coffee</a> to get your vacancy featured!
        </p>
      </div>

      {/* What We're About */}
      <Card className="mb-12">
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            What We're About: SEO Jobs, No Distractions
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            <strong>Eliminate the distractions, we focus on the job opportunities that matter to you, only.</strong>
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Tired of spam job boards, outdated job ads, fake job ads and newsletter subscriptions? So are we. 
            We put together WakeUpHappy to test a couple of Technical SEO aspects (ask us), to cut through the noise and make SEO job searching a little more straightforward (and honest? 😇). 
            We are only for SEO and digital marketing professionals across Europe - no fluff, no gimmicks.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <strong>Oh by the way:</strong> We treat SEO and GEO (Generative Engine Optimization) as complementary disciplines. As AI-powered search evolves with ChatGPT, Gemini, and other generative engines, the optimization strategies that worked for traditional search are now being adapted for AI responses. The core principles remain the same.
          </p>
        </CardContent>
      </Card>

      {/* What Makes Us Different */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">What Makes Us Different</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                No-Clutter Experience
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• No mandatory newsletter signups</li>
                <li>• No intrusive advertisements</li>
                <li>• No endless application loops</li>
                <li>• No fake job postings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Quality-First Approach
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Manually curated job listings</li>
                <li>• Direct company contact details</li>
                <li>• Verified SEO and marketing roles only</li>
                <li>• Europe-focused opportunities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* For Job Seekers */}
      <Card className="mb-12">
        <CardHeader>
          <h2 className="text-2xl font-bold">For SEO Professionals</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Whether you're a Technical SEO Specialist, Content SEO Manager, Local SEO Expert, or Digital Marketing Professional, 
            WakeUpHappy aggregates European companies seeking your expertise.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Technical SEO</h4>
              <p className="text-sm text-gray-600">Site optimization, structured data, performance</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Content SEO</h4>
              <p className="text-sm text-gray-600">Content strategy, keyword research, optimization</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Local SEO</h4>
              <p className="text-sm text-gray-600">Local search, GMB optimization, citations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* For Employers */}
      <Card className="mb-12">
        <CardHeader>
          <h2 className="text-2xl font-bold">For Employers</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-6">
            Post your SEO and digital marketing roles <strong>completely free</strong> to reach qualified professionals across Europe. 
            No hidden fees, no complex packages, no subscription nonsense.
          </p>
          
          {/* Free Posting */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Free Job Posting
            </h3>
            <p className="text-gray-700 mb-4">
              Post your job completely free. No payment required, no trial periods, no catches.
            </p>
            <Link href="/auth/magic-link">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Post Your Job Free
              </Button>
            </Link>
          </div>

          {/* Featured Option */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Want Extra Visibility?
            </h3>
            <p className="text-gray-700 mb-4">
              After posting your free job, you can make it "Featured" for premium placement. 
              Buy us a coffee to support this ad-free platform and get your role highlighted!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/magic-link">
                <Button variant="outline" className="border-gray-300">
                  Post Job First
                </Button>
              </Link>
              <a href="https://buymeacoffee.com/riadjoseph" target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  ☕ Buy Me a Coffee
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Our Commitment */}
      <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <h2 className="text-2xl font-bold text-blue-800">Our Commitment to You</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">
                No hidden costs, no misleading job descriptions, no fake remote opportunities. 
                What you see is what you get.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                Every job posting is reviewed to ensure it meets our standards for legitimate 
                SEO and digital marketing roles.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Privacy</h3>
              <p className="text-gray-600 text-sm">
                Your data stays yours. No spam emails, no data selling, no unnecessary tracking. 
                Just job matching.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                Built by SEO professionals, for SEO professionals. We understand what you're 
                looking for because we've been there.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Find Your Next SEO Role?</h2>
        <p className="mb-6 text-lg opacity-95">
          Join hundreds of SEO professionals who wake up happy knowing they found their perfect job here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 hover:text-orange-700">
              Browse SEO Jobs
            </Button>
          </Link>
          <Link href="/auth/magic-link">
            <Button size="lg" variant="outline" className="border-white text-orange-600 bg-white hover:bg-orange-600 hover:text-white">
              Post a Job
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}