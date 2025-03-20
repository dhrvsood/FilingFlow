// import { NavLink } from './NavLink';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export const NavBar = () => {
    const links = [
        { linkName: "All Returns", linkDestination: "/taxReturns" },
        { linkName: "Clients", linkDestination: "/clients" },
        { linkName: "Sectors", linkDestination: "/sectors" },
        { linkName: "Settings", linkDestination: "/settings" },
    ]

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="taxReturns">FilingFlow</Navbar.Brand>
                <Nav className="me-auto">
                    { links.map(link => (
                        <Nav.Link href={ link.linkDestination } key={ link.linkName }>
                            { link.linkName }
                        </Nav.Link>
                    )) }
                </Nav>
            </Container>
        </Navbar>
    );
    
}

        // <nav>
        //     { links.map(link => {
        //         return (<NavLink linkObject={ link } key={ link.linkName } />)
        //     })}
        // </nav>