import HomeView from './views/Home';
import MyHomeView from './views/MyHome';
import MyApartmentsView from './views/MyApartments';
import MyRentsView from './views/MyRents';
import RegisterView from './views/Register';
import NewApartmentView from './views/NewApartment';
import ApartmentDetailsLandlord from './views/ApartmentDetailsLandlord';
import ApartmentDetailsTenant from './views/ApartmentDetailsTenant';

import UserManager from './manager/UserManager';

const currentAccount = UserManager.getCurrentAccount();

export const publicRoutes = [
    {
      path: '/',
      exact: true,
      page: currentAccount == null ? HomeView : MyHomeView,
    },
    {
      path: '/apartments',
      exact: true,
      page: MyApartmentsView,
    },
    {
      path: '/newapartment',
      exact: true,
      page: NewApartmentView,
    },
    {
      path: '/landlorddetails/:id',
      exact: true,
      page: ApartmentDetailsLandlord,
    },
    {
      path: '/tentantdetails/:id',
      exact: true,
      page: ApartmentDetailsTenant,
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