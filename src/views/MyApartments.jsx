import React from 'react';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
// import createBrowserHistory from 'history/createBrowserHistory';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import { ErrorHeadline } from '../components/Headlines/MainHeadline'

// const history = createBrowserHistory();
export class MyApartments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      isLoggedIn: UserManager.isLoggedIn()
    }
  }
  
  async componentWillMount() {

  }

  render() {
    return (
      <ViewLayout>
        <Container>
        { this.state.isLoggedIn
              ?
              <React.Fragment>
                <MainHeadline>
                  My Apartments
                </MainHeadline>
              </React.Fragment>
              :
              <React.Fragment>
                <ErrorHeadline>
                  You are not logged in currently! Please go to the homepage to log in.
                </ErrorHeadline>
              </React.Fragment>
            }
        </Container>
      </ViewLayout>
    );
  }
}

  
export default withRouter(MyApartments);