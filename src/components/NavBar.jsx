// import { NavLink } from './NavLink';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export const NavBar = () => {
    const links = [
        { linkName: "Settings", linkDestination: "/settings" },
        { linkName: "Sectors", linkDestination: "/sectors" },
        { linkName: "Clients", linkDestination: "/clients" },
        { linkName: "All Returns", linkDestination: "/taxReturns" }
    ]

    return (
        <Navbar expand="lg" className="bg-body-secondary">
            <Container>
                <Navbar.Brand href="settings">FilingFlow</Navbar.Brand>
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