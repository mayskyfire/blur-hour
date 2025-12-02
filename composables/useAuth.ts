import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth'

export const useAuth = () => {
  const { auth } = useFirebase()
  const currentUser = useState<User | null>('currentUser', () => null)
  const loading = useState('authLoading', () => true)

  const signIn = async () => {
    try {
      const result = await signInAnonymously(auth)
      currentUser.value = result.user
      return result.user
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
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
