import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Briefcase, Search } from 'lucide-react'

export function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Briefcase className="h-6 w-6" />
            <span>Job Board</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              All Jobs
            </Link>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Post Job
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <Briefcase className="h-6 w-6" />
              <span>Job Board</span>
            </div>
            <p className="text-sm text-gray-400">
              Find your next SEO and tech career opportunity across Europe.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Job Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs/tag/seo" className="hover:text-white">SEO Jobs</Link></li>
              <li><Link href="/jobs/tag/marketing" className="hover:text-white">Marketing Jobs</Link></li>
              <li><Link href="/jobs/tag/javascript" className="hover:text-white">JavaScript Jobs</Link></li>
              <li><Link href="/jobs/tag/remote" className="hover:text-white">Remote Jobs</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs/city/london" className="hover:text-white">London</Link></li>
              <li><Link href="/jobs/city/berlin" className="hover:text-white">Berlin</Link></li>
              <li><Link href="/jobs/city/amsterdam" className="hover:text-white">Amsterdam</Link></li>
              <li><Link href="/jobs/city/paris" className="hover:text-white">Paris</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Job Board. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}