import * as React from 'react';
import { object } from 'prop-types';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';

export class MyHomeView extends React.Component {
  constructor(props) {
    super(props);
    var currentUser = UserManager.getCurrentUser();
    this.state = {
      currentUser: currentUser,
      isLoggedIn: currentUser != null
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
          { this.state.isLoggedIn
            ?
              <React.Fragment>
                <MainHeadline>
                  Hello {this.state.currentUser.name}! Welcome back!
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

MyHomeView.propTypes = {
  match: object.isRequired,
};

export default withRouter(MyHomeView);
  