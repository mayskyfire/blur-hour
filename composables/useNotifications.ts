export const useNotifications = () => {
  const notifications = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>('notifications', () => [])

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString()
    notifications.value.push({ id, message, type })
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 3000)
  }

  return {
    notifications: readonly(notifications),
    notify,
    success: (msg: string) => notify(msg, 'success'),
    error: (msg: string) => notify(msg, 'error'),
    info: (msg: string) => notify(msg, 'info')
  }
}
