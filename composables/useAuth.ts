import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth'

export const useAuth = () => {
  if (!process.client) {
    return {
      user: ref(null),
      loading: ref(false),
      signInAnonymously: async () => {},
      signOut: async () => {},
      initAuth: () => {}
    }
  }

  const { auth } = useFirebase()
  const currentUser = useState<User | null>('currentUser', () => null)
  const loading = useState('authLoading', () => true)

  const signIn = async () => {
    if (currentUser.value) return currentUser.value
    
    try {
      loading.value = true
      const result = await signInAnonymously(auth)
      currentUser.value = result.user
      return result.user
    } catch (error) {
      console.error('Sign in error:', error)
      currentUser.value = null
      throw error
    } finally {
      loading.value = false
    }
  }

  const initAuth = () => {
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      loading.value = false
    })
  }

  return { currentUser: readonly(currentUser), loading: readonly(loading), signIn, initAuth }
}
