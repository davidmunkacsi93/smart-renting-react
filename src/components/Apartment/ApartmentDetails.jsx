import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import thumbnail from '../../assets/thumbnail3.jpg';

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  align-items: center;

  &:hover {
    background-color: #283545;
  }
`;

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

const FlexDiv = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
`;

const Thumbnail = styled.div`
  padding-right: 10px;
  cursor: pointer;
`;

const LeftItemCardContent = styled.div`
  display: flex;
`;

export const ApartmentDetails = (apartment) => (
  <Container>
    <ContentWrapper>
      <LeftItemCardContent>
        <Thumbnail>
          <img src={thumbnail} alt="apartment thumbnail" width={250} height={250} />
        </Thumbnail>
        <FlexDiv>
          <TitleHeadline>Owner: {apartment.username}</TitleHeadline>
          <TitleHeadline>{apartment.postCode} {apartment.city}</TitleHeadline>
          <MediumHeadline>{apartment.street} {apartment.houseNumber}</MediumHeadline>
          <SmallHeadline>Floor: {apartment.floor}</SmallHeadline>
          <SmallHeadline>Required deposit: {apartment.deposit} €</SmallHeadline>
          <SmallHeadline>Rent: {apartment.rent} €</SmallHeadline>
          <DescriptionHeadline>{apartment.description}</DescriptionHeadline>
        </FlexDiv>
      </LeftItemCardContent>
    </ContentWrapper>
  </Container>
);

export default withRouter(ApartmentDetails);
