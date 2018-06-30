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

const DescriptionHeadline = styled.h4`
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

export const ApartmentItem = (apartment) => (
  <Container>
    <ContentWrapper>
      <LeftItemCardContent>
        <Thumbnail onClick={() => history.replace(`details/${apartment._id}`)}>
          <img src={thumbnail1} alt="apartment thumbnail" width={150} height={100} />
        </Thumbnail>
        <ApartmentDetails>
          <TitleHeadline>{apartment.street}</TitleHeadline>
          <DescriptionHeadline>{apartment.description}</DescriptionHeadline>
        </ApartmentDetails>
      </LeftItemCardContent>
      <PrimaryButton secondary="true" onClick={() => history.replace(`details/${apartment._id}`)}>
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
