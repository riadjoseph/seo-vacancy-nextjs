import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy | WakeUpHappy - SEO Job Board',
  description: 'Privacy Policy explaining how we collect, use, and protect your information when you visit WakeUpHappy.',
  openGraph: {
    title: 'Privacy Policy | WakeUpHappy',
    description: 'Learn how we handle your data and protect your privacy.',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
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
          <Shield className="h-8 w-8 text-blue-600" />
          Privacy Policy
        </h1>
        <p className="text-gray-600">
          This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
        </p>
      </div>

      <div className="space-y-6">
        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Information We Collect</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              We collect personal information such as your email address, and any other information you provide to us, 
              when you post a job opening.
            </p>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">How We Use Your Information</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              We use your information to provide the service, communicate with you, and comply with legal obligations.
            </p>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Data Security & Infrastructure</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
            </p>

            {/* Third-Party Authentication */}
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold text-gray-800 mb-2">Why We Don't Collect Your Emails or Passwords</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use <strong>third-party authentication</strong> through Google, LinkedIn, and GitHub logins. This means:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-3">
                <li><strong>We never see your passwords</strong> - They remain securely with Google, LinkedIn, or GitHub</li>
                <li><strong>We don't store your email directly</strong> - We only receive a secure token that identifies you</li>
                <li><strong>You control your data</strong> - You can revoke access anytime from your Google/LinkedIn/GitHub settings</li>
                <li><strong>Industry-standard security</strong> - These platforms have billion-dollar security infrastructures</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                This approach is significantly safer than traditional username/password systems because we eliminate the risk 
                of password breaches and reduce the personal data we handle.
              </p>
            </div>

            {/* Infrastructure */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold text-gray-800 mb-2">Our Infrastructure</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We currently use free accounts on trusted platforms:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-3">
                <li><strong>Netlify</strong> - Hosts our website with enterprise-grade security and SSL encryption</li>
                <li><strong>Supabase</strong> - Stores job postings and user authentication tokens in a secure PostgreSQL database</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Both platforms are SOC 2 compliant and follow industry-standard security practices. Using free tiers 
                allows us to keep our service completely free while maintaining professional-grade security.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-semibold text-gray-800 mb-2">Analytics & Tracking</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use Google Analytics and PostHog to analyze website traffic and improve our services. 
                These tools collect anonymized information such as your IP address (anonymized), browser type, 
                and pages visited without storing cookies or personally identifiable information on your device.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                The tracking is privacy-focused and does not require consent. You can opt out of Google Analytics 
                by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google Analytics Opt-out Browser Add-on</a>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The tracking does not collect any personally identifiable information unless you provide it to us directly, 
                such as when you post a job opening or contact us.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Changes to This Privacy Policy</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will publish the changes by posting 
              the new Privacy Policy on this page.
            </p>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          <p>Last updated: August 31, 2025</p>
        </div>
      </div>
    </div>
  )
}