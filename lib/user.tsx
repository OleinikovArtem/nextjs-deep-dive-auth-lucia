import db from '@/lib/db'
import { User } from '@/types'

export function createUser(email: string, password: string) {
  const stmt = db
    .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
    .run(email, password)

  return stmt.lastInsertRowid
}

export function getUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined
}
