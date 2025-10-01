"use client"

// Generate or retrieve guest session ID
export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = localStorage.getItem("guest_session_id")

  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem("guest_session_id", sessionId)
  }

  return sessionId
}

export function clearSessionId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("guest_session_id")
  }
}
