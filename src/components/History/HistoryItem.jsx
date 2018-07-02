import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const DescriptionHeadline = styled.h6`
  color: #ffffff;
  margin-left: 15px;
`;

export class HistoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    convertTimestamp = (timestamp) => {
        var parsed = new Date(timestamp*1000);
        return parsed.toLocaleDateString() + " " + parsed.toLocaleTimeString();
    }
    render() {
        return (
            <Container>
                <Row>
                    <FontAwesomeIcon color="white" icon={faEye}/>
                    <DescriptionHeadline>[{this.convertTimestamp(this.props.timestamp)}]</DescriptionHeadline>
                    <DescriptionHeadline className="margin-left-10">{this.props.message}</DescriptionHeadline>
                </Row>
            </Container>
        );
    }
}

export default withRouter(HistoryItem);