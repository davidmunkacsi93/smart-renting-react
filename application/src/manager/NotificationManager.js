import { NotificationManager, NotificationContainer } from 'react-notifications';
export const createNotification = (type, message, title) => {
    switch(type) {
        case 'success':
            NotificationManager.success(message, title, 3000);
            break;
        case 'warning':
            NotificationManager.warning(message, title, 3000);
            break;
        case 'info':
            NotificationManager.info(message, title, 3000);
            break;
        case 'error':
            NotificationManager.error(message, title, 3000);
            break;
        default:
            break;
    }
  }