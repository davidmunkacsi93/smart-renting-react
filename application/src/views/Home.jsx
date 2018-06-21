import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';

const StyledCol = styled(Col)`
  color: #ffffff;
`;

const StyledRow = styled(Row)`
  margin-top: 50px;
  margin-bottom: 50px;
`;

const HomeView = () => (
    <ViewLayout>
      <Container>
        <StyledRow>
            Welcome to the Ethereum based Smart Renting application!
        </StyledRow>
      </Container>
    </ViewLayout>
  );
  
  export default HomeView;
  