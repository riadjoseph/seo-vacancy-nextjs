import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const redirectTo = searchParams.get('redirect') || '/'
  
  try {
    revalidatePath('/')
    console.log('Cache purged for: /')
  } catch (error) {
    console.error('Cache purge error:', error)
  }
  
  // Redirect to the clean URL
  redirect(redirectTo)
}