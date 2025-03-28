'use server'

import { createUser, getUserByEmail } from '@/lib/user'
import { hashUserPassword, verifyPassword } from '@/lib/hash'
import { redirect } from 'next/navigation'
import { createAuthSession, destroyAuthSession } from '@/lib/auth'
import { AuthFormMode } from '@/types'

const email_regex = /^\S+@\S+\.\S+$/


export async function signup(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null

  const errors: Record<string, string> = {}

  if (email && !email_regex.test(email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (password && password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  try {
    const userId = createUser(email!, hashUserPassword(password!)) as number
    await createAuthSession(userId)
    redirect('/training')

  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { errors: { email: 'The email address is already in use' } }
    }
    throw error
  }
}

export async function login(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null

  const existingUser = await getUserByEmail(email!)

  if (existingUser && !verifyPassword(existingUser.password, password!)) {
    return { errors: { email: 'Could not authenticate user, please check your credentials' } }
  }

  await createAuthSession(existingUser?.id)
  redirect('/training')
}

export async function auth(mode: AuthFormMode, prevState: unknown, formData: FormData) {
  return mode === 'login' ? login(prevState, formData) : signup(prevState, formData)
}

export async function logout() {
  await destroyAuthSession()
  redirect('/')
}
