import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Service | WakeUpHappy - SEO Job Board',
  description: 'Terms of Service outlining the rules, responsibilities, and acceptable use of WakeUpHappy.',
  openGraph: {
    title: 'Terms of Service | WakeUpHappy',
    description: 'Read the terms that govern your use of WakeUpHappy.',
    type: 'website',
  },
}

export default function TermsOfServicePage() {
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
          <FileText className="h-8 w-8 text-blue-600" />
          Terms of Service
        </h1>
        <p className="text-gray-600">
          Please read the Terms of Service in order to make the best use of WakeUpHappy.
        </p>
      </div>

      <div className="space-y-6">
        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using WakeUpHappy (the "Service"), you agree to be bound by these Terms of Service
              and our Privacy Policy. If you do not agree to these terms, do not use the Service.
            </p>
          </CardContent>
        </Card>

        {/* Use of the Service */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Use of the Service</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for
              all activity conducted under your account.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>No illegal, fraudulent, or misleading activity;</li>
              <li>No posting of prohibited, offensive, or infringing content;</li>
              <li>No interference with the Service’s operation or security;</li>
              <li>No automated scraping or excessive requests that degrade performance.</li>
              <li>No links, scripts, or redirects that change navigation or inject code in ways that could harm performance, security, user experience, or search rankings; negative-SEO tactics are forbidden. Links to our site require prior approval.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Job Postings and Content */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Job Postings and User Content</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              If you submit job postings or other content, you represent that you have the right to share it and that the content is
              accurate, lawful, and does not infringe third-party rights. We may remove content that violates these Terms.
            </p>
            <p>
              You grant WakeUpHappy a non-exclusive, worldwide, royalty-free license to host, display, and distribute such content
              solely for the purpose of operating and improving the Service.
            </p>
            <p>
              WakeUpHappy reserves the right, at its sole discretion, to decline to publish or to remove any job posting or other
              content that we consider low quality, misleading, inappropriate, or otherwise unsuitable for the Service, for any
              reason and without obligation to disclose such reason.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Intellectual Property</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              All trademarks, logos, and content on the Service (excluding user content) are the property of their respective
              owners and protected by applicable intellectual property laws. You may not copy, modify, distribute, or create
              derivative works without permission.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Disclaimers</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              The Service is provided on an "as is" and "as available" basis without warranties of any kind, whether express or
              implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, secure, or error-free, or that any defects will be corrected.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Limitation of Liability</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, WakeUpHappy and its affiliates shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of or in
              connection with your use of the Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Without limiting the foregoing, WakeUpHappy does not warrant the accuracy, completeness, or reliability of any job
              listing or employer information and is not responsible or liable for the suitability of any job for any applicant,
              hiring decisions or outcomes, employment terms, workplace conditions, or any interactions between applicants and
              employers. You should independently verify job details and assess suitability before applying or accepting an offer.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Termination</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your access to the Service at any time if you violate these Terms or if we are required
              to do so by law.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Governing Law</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by and construed in accordance with applicable laws. Any disputes shall be subject to the
              exclusive jurisdiction of the competent courts in your region, unless otherwise required by law.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Contact Us</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms, please reach out via the social channels listed on our{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact</Link> page.
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
