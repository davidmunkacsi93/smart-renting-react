import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';

const StyledCol = styled(Col)`
  color: #ffffff;
`;

const StyledRow = styled(Row)`
  margin-top: 50px;
  margin-bottom: 50px;
`;

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