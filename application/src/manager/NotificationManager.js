import * as ReactNotifications from 'react-notifications';

const createNotification = (type, message, title) => {
    console.log(message);
    switch(type) {
        case 'success':
            ReactNotifications.NotificationManager.success(message, title, 3000);
            break;
        case 'warning':
            ReactNotifications.NotificationManager.warning(message, title, 3000);
            break;
        case 'info':
            ReactNotifications.NotificationManager.info(message, title, 3000);
            break;
        case 'error':
            ReactNotifications.NotificationManager.error(message, title, 3000);
            break;
        default:
            ReactNotifications.NotificationManager.error("Bad parameter", "System error", 3000);
            break;
    }
  }

const NotificationManager = {
    createNotification: createNotification
}

export default NotificationManager;