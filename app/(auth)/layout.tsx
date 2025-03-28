import '../globals.css'
import { Metadata } from 'next'
import { logout } from '@/actions/auth-actions'

export const metadata: Metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
}

export default function AuthRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header id="auth-header">
        <p>Welcome back!</p>
        <form action={logout}>
          <button>Logout</button>
        </form>
      </header>
      {children}
    </>
  )
}
