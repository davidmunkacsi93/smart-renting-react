import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.h1`
  padding: 20px;
  color: #ffffff;
`;

const ErrorHeader = styled.h1`
  padding: 20px;
  color: red;
`;

export const ErrorHeadline = ({ children }) => (
  <ErrorHeader>{children}</ErrorHeader>
);

export const MainHeadline = ({ children }) => (
  <StyledHeader>{children}</StyledHeader>
);


