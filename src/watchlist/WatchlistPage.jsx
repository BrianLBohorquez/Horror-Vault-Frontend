import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getWatchlist } from "../api/watchlist";
import { useAuth } from "../auth/AuthContext";

import Watchlist from "./Watchlist";

/** Shows the logged-in user's watchlist, or links to log in or register. */
export default function WatchlistPage() {
  const { token } = useAuth();

  const [watchlist, setWatchlist] = useState([]);

  /** Gets the user's watchlist from the API and saves it in state. */
  const syncWatchlist = async () => {
    const data = await getWatchlist(token);
    setWatchlist(data);
  };

  useEffect(() => {
    if (token) syncWatchlist();
  }, []);

  if (!token) {
    return (
      <section className="rounded border border-neutral-800 bg-neutral-900 p-4">
        <h1>Watchlist</h1>
        <p>You need to be logged in to see your watchlist.</p>
        <div className="flex gap-4 mt-4">
          <Link
            to="/login"
            className="border rounded px-2 py-1 text-neutral-200 hover:bg-neutral-800"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="border rounded px-2 py-1 text-neutral-200 hover:bg-neutral-800"
          >
            Register
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded border border-neutral-800 bg-neutral-900 p-4">
      <h1>Watchlist</h1>
      <Watchlist watchlist={watchlist} syncWatchlist={syncWatchlist} />
    </section>
  );
}
