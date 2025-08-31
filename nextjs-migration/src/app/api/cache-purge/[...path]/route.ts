import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams.path || []
  const searchParams = request.nextUrl.searchParams
  const redirectTo = searchParams.get('redirect') || '/'
  
  // Construct the path to revalidate
  const pathToRevalidate = path.length > 0 ? `/${path.join('/')}` : '/'
  
  try {
    revalidatePath(pathToRevalidate)
    console.log(`Cache purged for: ${pathToRevalidate}`)
  } catch (error) {
    console.error('Cache purge error:', error)
  }
  
  // Redirect to the clean URL
  redirect(redirectTo)
}