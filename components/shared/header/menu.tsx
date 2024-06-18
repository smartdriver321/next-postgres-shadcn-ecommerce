import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import UserButton from './user-button'

const Menu = () => {
  return (
    <>
      <div className='flex justify-end gap-3'>
        <nav className='md:flex hidden w-full max-w-xs gap-1'>
          <Button asChild variant='ghost'>
            <Link href='/cart'>
              <ShoppingCart />
              Cart
            </Link>
          </Button>
          <UserButton />
        </nav>
      </div>
    </>
  )
}

export default Menu
