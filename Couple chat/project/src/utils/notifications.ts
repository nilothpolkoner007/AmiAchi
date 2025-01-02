interface NotificationOptions {
  title: string;
  body: string;
  priority?: 'normal' | 'high';
  icon?: string;
  tag?: string;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

export async function sendNotification(options: NotificationOptions) {
  try {
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon,
        tag: options.tag,
        
        requireInteraction: options.priority === 'high',
        silent: options.priority !== 'high',
      });

      if (options.priority === 'high' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

export async function sendEmergencyNotification(
  userId: string,
  location: GeolocationCoordinates
) {
  await sendNotification({
    title: 'Emergency Alert',
    body: 'Emergency alert triggered! Location shared.',
    priority: 'high',
    icon: '/emergency-icon.png',
    tag: 'emergency'
  });
}