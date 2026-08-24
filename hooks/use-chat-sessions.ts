"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "trails-agent-chats"
const MAX_SESSIONS = 30
const TITLE_MAX_LENGTH = 48

export type ChatSession<M> = {
  id: string
  title: string
  updatedAt: number
  messages: M[]
}

type StoredSessions<M> = ChatSession<M>[]

function readSessions<M>(): StoredSessions<M> {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredSessions<M>
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeSessions<M>(sessions: StoredSessions<M>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    // storage full or unavailable, drop silently
  }
}

export function deriveTitle(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ")
  if (trimmed.length <= TITLE_MAX_LENGTH) return trimmed || "New chat"
  return `${trimmed.slice(0, TITLE_MAX_LENGTH - 1)}…`
}

export function useChatSessions<M>() {
  const [sessions, setSessions] = useState<ChatSession<M>[]>([])

  useEffect(() => {
    // localStorage is unavailable during SSR; sync it in after mount so the
    // server-rendered empty state and the first client render agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessions(readSessions<M>())
  }, [])

  const saveSession = useCallback(
    (id: string, title: string, messages: M[]) => {
      setSessions((current) => {
        const next: ChatSession<M>[] = [
          { id, title, updatedAt: Date.now(), messages },
          ...current.filter((session) => session.id !== id),
        ]
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, MAX_SESSIONS)
        writeSessions(next)
        return next
      })
    },
    []
  )

  const deleteSession = useCallback((id: string) => {
    setSessions((current) => {
      const next = current.filter((session) => session.id !== id)
      writeSessions(next)
      return next
    })
  }, [])

  const getSession = useCallback(
    (id: string) => readSessions<M>().find((session) => session.id === id),
    []
  )

  return { sessions, saveSession, deleteSession, getSession }
}
