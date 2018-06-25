import HomeView from './views/Home';
import MyHomeView from './views/MyHome';
import MyApartmentsView from './views/MyApartments';
import MyRentsView from './views/MyRents';
import RegisterView from './views/Register';

export const publicRoutes = [
    {
      path: '/',
      exact: true,
      page: HomeView,
    },
    {
      path: '/myhome',
      exact: true,
      page: MyHomeView,
    },
    {
      path: '/apartments',
      exact: true,
      page: MyApartmentsView,
    },
    {
      path: '/rents',
      exact: true,
      page: MyRentsView,
    },
    {
      path: '/register',
      exact: true,
      page: RegisterView,
    }
];