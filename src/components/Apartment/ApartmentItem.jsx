import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { string, object } from 'prop-types';
import { Container, Button } from 'reactstrap';
import thumbnail1 from '../../assets/thumbnail1.jpg';
import thumbnail2 from '../../assets/thumbnail2.jpg';
import thumbnail3 from '../../assets/thumbnail3.jpg';
import { media } from '../../utils/styleUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

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

const ApartmentDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Thumbnail = styled.div`
  padding-right: 10px;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background-color: #1f3651;
  color: #ffffff;
  width: 50px;

  ${media.mobile`
    display: none !important;
  `};
`;

const LeftItemCardContent = styled.div`
  display: flex;
`;

const getThumbnail = () => {
  var random = Math.floor((Math.random()*3) + 1);
  switch (true) {
    case (random % 3 === 0):
      return thumbnail1;
    case (random % 3 === 1):
      return thumbnail2;
    case (random % 3 === 2):
      return thumbnail3;
    default:
      return thumbnail1;
  }
}

export const ApartmentItem = (apartment) => (
  <Container>
    <ContentWrapper>
      <LeftItemCardContent>
        <Thumbnail onClick={() => {
          history.push(`/landlorddetails?id=${apartment._id}`);
          window.location.reload();
        }}>
          <img src={getThumbnail(this.key)} alt="apartment thumbnail" width={150} height={150} />
        </Thumbnail>
        <ApartmentDetails>
          <TitleHeadline>{apartment.postCode} {apartment.city}</TitleHeadline>
          <MediumHeadline>{apartment.street} {apartment.houseNumber}</MediumHeadline>
          <SmallHeadline>Floor: {apartment.floor}</SmallHeadline>
          <SmallHeadline>Required deposit: {apartment.deposit} €</SmallHeadline>
          <SmallHeadline>Rent: {apartment.rent} €</SmallHeadline>
          <DescriptionHeadline>{apartment.description}</DescriptionHeadline>
        </ApartmentDetails>
      </LeftItemCardContent>
      <PrimaryButton secondary="true" onClick={() => {
          history.push(`/landlorddetails?id=${apartment._id}`);
          window.location.reload();
        }}>
        <FontAwesomeIcon icon={faEye}/>
      </PrimaryButton>  
    </ContentWrapper>
  </Container>
);

ApartmentItem.propTypes = {
  _id: string.isRequired,
  history: object.isRequired,
};

export default withRouter(ApartmentItem);
