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
 import UserManager from '../../manager/UserManager';
import createBrowserHistory from 'history/createBrowserHistory';

const StyledNavbar = styled(Navbar)`
  background-color: #18293b !important;
`;

const ClickableNavLink = styled(NavLink)`
 cursor: pointer;
`

export class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            isOpen: false,
            isLoggedIn: UserManager.getCurrentUser() == null
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    logout() {
        UserManager.setCurrentUser(null);
        const history = createBrowserHistory();
        history.push('/');
        window.parent.location = window.parent.location.href;
      }
    

    render() {
        return(
            <div>
                <StyledNavbar color="dark" dark expand="md">
                    <NavbarBrand href="/">Smart Rent</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {
                                this.state.isLoggedIn 
                                ? 
                                <React.Fragment>
                                    <NavItem>
                                    <NavLink href="/apartments">My Apartments</NavLink>
                                    </NavItem>
                                    <NavItem >
                                        <NavLink href="/rents">My Rents</NavLink>
                                    </NavItem>
                                    <NavItem >
                                        <ClickableNavLink onClick={this.logout}>Logout</ClickableNavLink>
                                    </NavItem> 
                                </React.Fragment>
                                :
                                <NavItem>
                                    <NavLink href="/register">Register</NavLink>
                                </NavItem>                   
                            }
                        </Nav>
                    </Collapse>
                </StyledNavbar>
            </div>
        );
    }
}
