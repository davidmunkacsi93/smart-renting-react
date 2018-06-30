import HomeView from './views/Home';
import MyHomeView from './views/MyHome';
import MyApartmentsView from './views/MyApartments';
import MyRentsView from './views/MyRents';
import RegisterView from './views/Register';
import NewApartmentView from './views/NewApartment';
import ApartmentDetailsLandlordView from './views/ApartmentDetailsLandlord';
import ApartmentDetailsTenantView from './views/ApartmentDetailsTenant';
import BrowseView from './views/Browse';

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
      page: ApartmentDetailsLandlordView,
    },
    {
      path: '/tenantdetails/:id',
      exact: true,
      page: ApartmentDetailsTenantView,
    },
    {
      path: '/browse',
      exact: true,
      page: BrowseView,
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