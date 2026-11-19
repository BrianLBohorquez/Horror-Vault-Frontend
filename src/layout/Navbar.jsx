import { NavLink } from "react-router";

import { useAuth } from "../auth/AuthContext";

/** Shows links to each page, with Log in or Log out depending on whether a user is logged in. */
export default function Navbar() {
  const { token, logout } = useAuth();
  return (
    <header id="navbar">
      <NavLink id="brand" to="/">
        <p>Horror Vault</p>
      </NavLink>
      <nav>
        <NavLink to="/movies">Movies</NavLink>
        {token ? (
          <>
            <NavLink to="/watchlist">Watchlist</NavLink>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </nav>
    </header>
  );
}
