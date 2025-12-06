export default defineNuxtRouteMiddleware((to) => {
  const { currentUser, loading } = useAuth()
  if (loading.value) return
  const publicPages = ['/', '/onboarding', '/quick-profile', '/mode-selection']
  if (!publicPages.includes(to.path) && !currentUser.value) {
    return navigateTo('/')
  }
})
