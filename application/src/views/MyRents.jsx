import React from 'react';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';

const MyRentsView = () => (
    <ViewLayout>
      <Container>
        <MainHeadline>
            My Rents
        </MainHeadline>
      </Container>
    </ViewLayout>
  );
  
  export default MyRentsView;