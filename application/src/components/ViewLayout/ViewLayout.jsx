import React from 'react';
import styled from 'styled-components';
import { any } from 'prop-types';
import Header from '../Header';
import Footer from '../Footer';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #102132;
`;

const ViewContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
`;

export const ViewLayout = ({children}) => (
    <LayoutWrapper>
        <Header/>
        <ViewContent>{children}</ViewContent>
        <Footer/>
    </LayoutWrapper>
);

ViewLayout.propTypes = {
    children: any.isRequired,
  };
  
export default ViewLayout;
