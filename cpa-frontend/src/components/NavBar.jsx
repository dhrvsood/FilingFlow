import { NavLink } from './NavLink';

export const NavBar = () => {
    const links = [
        { linkName: "All Returns", linkDestination: "/taxReturns" },
        { linkName: "Clients", linkDestination: "/clients" },
        { linkName: "Sectors", linkDestination: "/sectors" },
        { linkName: "Settings", linkDestination: "/settings" },
    ]

    return (
        <nav>
            { links.map(link => {
                return (<NavLink linkObject={ link } key={ link.linkName } />)
            })}
        </nav>
    );
}