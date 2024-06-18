import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

import CredentialsSigninForm from './credentials-signin-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Sign In - ${APP_NAME}`,
}

const SignIn = async ({
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
          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Select a method to sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <CredentialsSigninForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn
