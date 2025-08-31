'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/my-jobs')
      }
    }
    checkAuth()
  }, [router, supabase])

  // Inject LinkedIn icon after Supabase's Auth buttons are rendered
  useEffect(() => {
    if (!mounted) return

    const injectLinkedInIcon = () => {
      // Try multiple selectors that Supabase Auth might use
      const selectors = [
        'button[data-provider="linkedin_oidc"]',
        'button:has-text("linkedin_oidc")',
        'button[class*="linkedin"]',
        'button:contains("linkedin")'
      ]
      
      let linkedInButton: HTMLButtonElement | null = null
      
      // Find the LinkedIn button using different strategies
      for (const selector of selectors) {
        try {
          linkedInButton = document.querySelector(selector) as HTMLButtonElement
          if (linkedInButton) break
        } catch (e) {
          // Selector might not be supported, continue
        }
      }
      
      // Fallback: find button by text content
      if (!linkedInButton) {
        const buttons = Array.from(document.querySelectorAll('button'))
        linkedInButton = buttons.find(button => 
          button.textContent?.toLowerCase().includes('linkedin')
        ) as HTMLButtonElement | undefined || null
      }

      if (linkedInButton) {
        // Check if we already injected the icon
        if (linkedInButton.querySelector('.linkedin-icon-injected')) {
          return
        }

        // Remove any default icon if present
        const existingIcon = linkedInButton.querySelector("svg")
        if (existingIcon) existingIcon.remove()

        // Insert LinkedIn icon
        const newIcon = document.createElement("span")
        newIcon.className = "linkedin-icon-injected"
        newIcon.innerHTML = `
          <svg
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            width="21px"
            height="21px"
            viewBox="0 0 24 24"
            style="margin-right: 8px;"
          >
            <title>LinkedIn</title>
            <!-- Blue background -->
            <rect width="24" height="24" rx="2" fill="#0077B5"/>
            <!-- White letter content -->
            <path fill="white"
              d="M20.451 20.451h-3.75v-5.539c0-1.322-.472-2.224-1.657-2.224
                 -0.904 0-1.443.604-1.681 1.188-0.086.213-0.108.509-0.108.805v5.77h-3.75
                 s0.049-9.367 0-10.344h3.75v1.465c-.007.011-.017.023-.024.034h.024v-0.034
                 c0.498-.767 1.38-1.859 3.358-1.859 2.452 0 4.292 1.604 4.292 5.058v5.68zM5.337 7.433
                 c-1.279 0-2.125-.84-2.125-1.885 0-1.071.86-1.886 2.164-1.886 1.304 0 2.125.815
                 2.125 1.886-0.024 1.046-.82 1.885-2.164 1.885zM3.457 20.451h3.75v-10.34h-3.75v10.34z"/>
          </svg>
        `
        linkedInButton.prepend(newIcon)

        // Replace button text
        const textContent = linkedInButton.textContent || ''
        if (textContent.toLowerCase().includes('linkedin')) {
          linkedInButton.innerHTML = linkedInButton.innerHTML.replace(
            /Sign in with linkedin_oidc|linkedin_oidc|LinkedIn_OIDC/gi,
            'Sign in with LinkedIn'
          )
        }
      }
    }

    // Try multiple times with increasing delays
    const timeouts = [100, 300, 500, 1000, 2000]
    const timeoutIds = timeouts.map(delay => 
      setTimeout(injectLinkedInIcon, delay)
    )

    // Also watch for DOM changes
    const observer = new MutationObserver(() => {
      injectLinkedInIcon()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      timeoutIds.forEach(clearTimeout)
      observer.disconnect()
    }
  }, [mounted])

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>
      
      <div className="max-w-md mx-auto">
        <Card className="p-8">
          <CardHeader>
            <h1 className="text-2xl font-bold mb-6">Login with Google, GitHub or LinkedIn</h1>
          </CardHeader>
          <CardContent>
            <p className="text-l mb-3">Login to add or remove Job Listings</p>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["google", "github", "linkedin_oidc"]}
              view="magic_link"
              redirectTo={`${window.location.origin}/my-jobs`}
            />
            <p className="mt-4 text-sm text-gray-600 text-center">
              Don't have an account? Just sign in - we'll create one for you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}