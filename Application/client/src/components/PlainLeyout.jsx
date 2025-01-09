import { Outlet, Link } from "react-router-dom";

export function PlainLeyout() {
    return (
    <>
        <nav>
            <Link to="/signup">Register</Link>
            <Link to="/login">Login</Link>
        </nav>
        <Outlet />
    </>
);
}