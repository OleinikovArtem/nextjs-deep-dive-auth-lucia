'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import { auth } from '@/actions/auth-actions'
import { AuthFormMode } from '@/types'

export default function AuthForm({ mode }: { mode: AuthFormMode }) {
  const [state, action, isPending] = useActionState(
    auth.bind(null, mode), {} as { errors: Record<string, string> }
  )

  return (
    <form id="auth-form" action={action}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon"/>
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email"/>
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password"/>
      </p>
      {state?.errors && <ul id="form-errors">
        {Object.keys(state.errors).map((error) => (
          <li key={error}>{state.errors[error]}</li>
        ))}
      </ul>}
      <p>
        <button type="submit">
          { mode === 'login' ? 'Login' : 'Create an account' }
        </button>
      </p>
      <p>
        {mode === 'login' && <Link href="/?mode=signup">Create an account.</Link>}
        {mode === 'signup' && <Link href="/?mode=login">Login with existing account.</Link>}
      </p>
    </form>
  )
}
