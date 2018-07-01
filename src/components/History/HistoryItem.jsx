import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const DescriptionHeadline = styled.h6`
  color: #ffffff;
`;

export class PermissionRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <Container>
                <Row>
                    <FontAwesomeIcon color="white" icon={faEye}/>
                    <DescriptionHeadline className="margin-left-10">{this.props.transactionMessage}</DescriptionHeadline>
                </Row>
            </Container>
        );
    }
}

export default withRouter(PermissionRequest);