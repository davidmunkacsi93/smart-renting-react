import React from 'react';
import styled from 'styled-components';
import { func } from 'prop-types'
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

const DescriptionHeadline = styled.h6`
  color: #ffffff;
`;

const IconButton = styled(Button)`
  background-color: #102132;
  border: none;
`

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
                <Col className="margin-top-10" sm="10" md="4">
                    <DescriptionHeadline>{this.props.username} wants to rent your apartment.</DescriptionHeadline>
                </Col>
                <Col className="margin-top-10" sm="1" md="1">
                    <IconButton onClick={this.props.handleAccept}>
                        <FontAwesomeIcon className="color-green" size="2x" icon={faCheck}/>
                    </IconButton>
                </Col>
                <Col className="margin-top-10" sm="1" md="1">
                    <IconButton onClick={this.props.handleDecline}>
                        <FontAwesomeIcon className="color-red" size="2x" icon={faTimes}/>
                    </IconButton>
                </Col>
                </Row>
            </Container>
        );
    }
}

PermissionRequest.propTypes = {
    handleAccept: func.isRequired,
    handleDecline: func.isRequired
};

export default withRouter(PermissionRequest);