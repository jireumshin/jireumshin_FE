'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Header() {
  const router = useRouter()

  const handleNavigate = (path) => {
    router.push(path)
  }

  return (
    <div 
      className="bg-blue-600 text-white px-8 py-4 flex flex-row items-center justify-start gap-4"
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
    >
      <Button
        variant="link" 
        className="text-white hover:underline p-0 h-auto"
        onClick={() => handleNavigate('/page1')}
      >
        페이지1
      </Button>
    </div>
  )
}
