import React from 'react';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';

const MyApartmentsView = () => (
    <ViewLayout>
      <Container>
        <MainHeadline>
            My Apartments
        </MainHeadline>
      </Container>
    </ViewLayout>
  );
  
  export default MyApartmentsView;