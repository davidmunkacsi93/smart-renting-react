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