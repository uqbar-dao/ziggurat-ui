export const showNotification = async (message: string) => {
  if (window.Notification) {
    if (Notification.permission === 'granted') {
      new Notification(message)
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          new Notification(message)
        }
      })
    }
  }
}
