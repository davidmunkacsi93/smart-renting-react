import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import thumbnail from '../../assets/thumbnail3.jpg';

const TitleHeadline = styled.h3`
  color: #ffffff;
`;

const MediumHeadline = styled.h4`
  color: #ffffff;
`;

const SmallHeadline = styled.h5`
  color: #ffffff;
`;

const DescriptionHeadline = styled.h6`
  color: #ffffff;
`;

const Thumbnail = styled.div`
  padding-right: 10px;
  cursor: pointer;
`;

export const ApartmentDetails = (apartment) => (
  <Container>
    <Row>
      <Col className="margin-top-10" sm="12" md="4">
        <Thumbnail>
          <img src={thumbnail} alt="apartment thumbnail" width={250} height={250} />
        </Thumbnail>
      </Col>
      <Col className="margin-top-10" sm="12" md="8">
        <TitleHeadline>Owner: {apartment.username}</TitleHeadline>
        <TitleHeadline>{apartment.postCode} {apartment.city}</TitleHeadline>
        <MediumHeadline>{apartment.street} {apartment.houseNumber}</MediumHeadline>
        <SmallHeadline>Floor: {apartment.floor}</SmallHeadline>
        <SmallHeadline>Required deposit: {apartment.deposit} €</SmallHeadline>
        <SmallHeadline>Rent: {apartment.rent} €</SmallHeadline>
        <DescriptionHeadline>{apartment.description}</DescriptionHeadline>
      </Col>
    </Row>
  </Container>
);

export default withRouter(ApartmentDetails);
