import React, { Component } from 'react';
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

const StyledNavbar = styled(Navbar)`
  background-color: #18293b !important;
`;

export class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            isLoggedIn: false
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
                                <NavLink href="/register">Register</NavLink>
                            </NavItem>
                            {
                                this.state.isLoggedIn ? 
                                <React.Fragment>
                                    <NavItem>
                                    <NavLink href="/apartments">My Apartments</NavLink>
                                    </NavItem>
                                    <NavItem >
                                        <NavLink href="/rents">My Rents</NavLink>
                                    </NavItem> 
                                </React.Fragment>
                                 : null                     
                            }
                        </Nav>
                    </Collapse>
                </StyledNavbar>
            </div>
        );
    }
}
