export default defineNuxtRouteMiddleware((to) => {
  const { currentUser, loading } = useAuth()
  if (loading.value) return
  const publicPages = ['/', '/onboarding']
  if (!publicPages.includes(to.path) && !currentUser.value) {
    return navigateTo('/')
  }
})
