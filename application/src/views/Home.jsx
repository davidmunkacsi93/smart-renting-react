import React from 'react';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';

const HomeView = () => (
    <ViewLayout>
      <Container>
        <MainHeadline>
          Welcome to the Ehereum based smart renting application!
        </MainHeadline>
        <SecondaryHeadline>
          Please log in to continue!
        </SecondaryHeadline>
      </Container>
    </ViewLayout>
  );
  
  export default HomeView;
  