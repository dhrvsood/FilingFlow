import { Link } from 'react-router';

export const NavLink = ({ linkObject }) => {
    const { linkDestination, linkName } = linkObject;

    return (
        <Link to={ linkDestination}>{ linkName }</Link>
    );
}