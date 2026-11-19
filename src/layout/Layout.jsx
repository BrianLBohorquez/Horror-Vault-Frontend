import { Outlet } from "react-router";

import Navbar from "./Navbar";

/** Shows the navbar above whichever page is open. */
export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
