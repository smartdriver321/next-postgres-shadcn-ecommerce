import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Image from 'next/image'

import { auth } from '@/auth'
import { APP_NAME } from '@/lib/constants'
import SignUpForm from './signup-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Sign Up - ${APP_NAME}`,
}
const SignUp = async ({
  searchParams: { callbackUrl },
}: {
  searchParams: {
    callbackUrl: string
  }
}) => {
  const session = await auth()
  if (session) {
    return redirect(callbackUrl || '/')
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image
              src='/assets/icons/logo.svg'
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
            />
          </Link>
          <CardTitle className='text-center'>Create Account</CardTitle>
          <CardDescription className='text-center'>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp
