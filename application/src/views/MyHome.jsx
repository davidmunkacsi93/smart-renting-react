import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';

export class MyHomeView extends React.Component {
  constructor(props) {
    super(props);
    var currentUser = UserManager.getCurrentUser();
    console.log(currentUser);
    this.state = {
      username: currentUser ? currentUser.username : '',
      isLoggedIn: UserManager.isLoggedIn()
    }
    this.handleChange = this.handleChange.bind(this);
  }

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
                  Welcome {this.state.username} to the based smart renting application!
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
  