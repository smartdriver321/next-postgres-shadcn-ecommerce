'use server'

import { signIn, signOut } from '@/auth'
import { signInformSchema } from '../validator'
import { isRedirectError } from 'next/dist/client/components/redirect'

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInformSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    await signIn('credentials', user)
    return { success: true, message: 'Signin succesfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: 'Invalid email or password' }
  }
}

export const SignOut = async () => {
  await signOut()
}
