import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
 } from 'reactstrap';

 const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StyledNavbar = styled(Navbar)`
  background-color: #18293b !important;
`;

export class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        return(
            <div>
                <StyledNavbar color="dark" dark expand="md">
                    <NavbarBrand href="/">Smart Rent</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <StyledLink to="/apartments">
                                    <NavLink>My Apartments</NavLink>
                                </StyledLink>
                            </NavItem>
                            <NavItem>
                                <StyledLink to="/rents">
                                    <NavLink>My Rents</NavLink>
                                </StyledLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </StyledNavbar>
            </div>
        );
    }
}
