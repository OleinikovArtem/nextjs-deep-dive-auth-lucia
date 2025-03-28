import AuthForm from '@/components/auth-form'
import { AuthFormMode } from '@/types'

export default async function Home({ searchParams }: {  searchParams: Promise<Record<string, string>> }) {
  const formMode = ((await searchParams).mode || 'login') as AuthFormMode
  return <AuthForm mode={formMode}/>
}
