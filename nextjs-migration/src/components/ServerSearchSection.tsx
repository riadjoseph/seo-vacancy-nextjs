import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'

interface ServerSearchSectionProps {
  placeholder?: string
  initialQuery?: string
  className?: string
}

export function ServerSearchSection({ 
  placeholder = "Search jobs...", 
  initialQuery = "",
  className = ""
}: ServerSearchSectionProps) {
  return (
    <Card className={`mb-8 ${className}`}>
      <CardContent className="pt-6">
        <form method="GET" className="flex gap-4">
          <div className="flex-1">
            <Input
              name="q"
              type="search"
              placeholder={placeholder}
              defaultValue={initialQuery}
              className="w-full"
            />
          </div>
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}