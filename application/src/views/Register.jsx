import React from 'react';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';

const RegisterView = () => (
    <ViewLayout>
      <Container>
        <SecondaryHeadline>
            Fill out the following form to register:
        </SecondaryHeadline>
      </Container>
    </ViewLayout>
  );
  
  export default RegisterView;