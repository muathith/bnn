"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  isDemo: boolean
  loginAsDemo: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemo: false,
  loginAsDemo: () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const isDemoRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      if (!firebaseUser && !isDemoRef.current && pathname !== "/login") {
        router.push("/login")
      } else if ((firebaseUser || isDemoRef.current) && pathname === "/login") {
        router.push("/")
      }
    })

    return () => unsubscribe()
  }, [router, pathname])

  const loginAsDemo = () => {
    isDemoRef.current = true
    setIsDemo(true)
    setUser({ uid: "demo-user", email: "demo@bcare.sa" } as any)
    setLoading(false)
    router.push("/")
  }

  const logout = async () => {
    try {
      isDemoRef.current = false
      setIsDemo(false)
      await auth.signOut()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
