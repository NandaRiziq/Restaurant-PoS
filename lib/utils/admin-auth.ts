"use client"

// Simple admin authentication (username: admin, password: admin)
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin"
const ADMIN_SESSION_KEY = "admin_session"

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_SESSION_KEY, "true")
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true"
}
