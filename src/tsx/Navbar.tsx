import React from "react";
import NavbarA from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

import parrot from "../img/parrot.png";
import { Nav } from "react-bootstrap";

export default function Navbar() {
    return (
        <NavbarA expand="lg" bg="black" variant="dark" className="mt-2 align-items-center">
            <Container>
                <NavbarA.Brand as={Link} to="/" ><img src={parrot} alt="Home" className="navbar-img d-inline-block align-text-top" /></NavbarA.Brand>
                <NavbarA.Toggle aria-controls="navbarobjects" />
                <NavbarA.Collapse id="navbarobjects" >
                    <Nav>
                        <Nav.Link as={Link} to="/work" className="text-light">Work</Nav.Link>
                    </Nav>
                    <Nav className="me-auto" >
                        <Nav.Link as={Link} to="/writeups" className="text-light" >Writeups</Nav.Link>
                    </Nav>
                </NavbarA.Collapse>
            </Container>
        </NavbarA>
    )
}