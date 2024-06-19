import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import CredentialsProvider from 'next-auth/providers/credentials'
import { eq } from 'drizzle-orm'
import { compareSync } from 'bcrypt-ts-edge'

import db from './db/drizzle'
import { carts, users } from './db/schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }: any) => {
      if (user) {
        if (trigger === 'signIn' || trigger === 'signUp') {
          const sessionCartId = cookies().get('sessionCartId')?.value

          if (!sessionCartId) throw new Error('Session Cart Not Found')

          const sessionCartExists = await db.query.carts.findFirst({
            where: eq(carts.sessionCartId, sessionCartId),
          })

          if (sessionCartExists && !sessionCartExists.userId) {
            const userCartExists = await db.query.carts.findFirst({
              where: eq(carts.userId, user.id),
            })

            if (userCartExists) {
              cookies().set('beforeSigninSessionCartId', sessionCartId)
              cookies().set('sessionCartId', userCartExists.sessionCartId)
            } else {
              db.update(carts)
                .set({ userId: user.id })
                .where(eq(carts.id, sessionCartExists.id))
            }
          }
        }
      }
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name
      }
      return token
    },

    session: async ({ session, user, trigger, token }: any) => {
      session.user.id = token.sub
      session.user.role = token.role
      session.user.name = token.name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },

    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ]
      const { pathname } = request.nextUrl

      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false

      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID()
        const newRequestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        })
        response.cookies.set('sessionCartId', sessionCartId)
        return response
      } else {
        return true
      }
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
