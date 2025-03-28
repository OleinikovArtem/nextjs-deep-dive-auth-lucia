import { Lucia } from 'lucia'
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'
import db from '@/lib/db'
import { User } from '@/types'
import { cookies } from 'next/headers'

const adapter = new BetterSqlite3Adapter(db, {
  user: 'users',
  session: 'sessions',
})

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: { secure: process.env.NODE_ENV === 'production' },
  },
})

export async function createAuthSession(userId: User['id']) {
  const session = await lucia.createSession(String(userId), {})
  const sessionCookie = await lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return session
}

export async function verifyAuthSession() {
  const sessionCookie = (await cookies()).get(lucia.sessionCookieName)
  const sessionId = sessionCookie?.value

  if (!sessionCookie || !sessionId) {
    return { session: null, user: null }
  }

  const result = await lucia.validateSession(sessionId!)

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }

    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
  } catch (error) {
  }

  return result
}

export async function destroyAuthSession() {
  const { session } = await verifyAuthSession()

  if (!session) {
    return { error: 'Unauthorized!' }
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )
}
