import { useState } from "react";
import { Link } from "react-router";
import { updateWatchlistItem, removeFromWatchlist } from "../api/watchlist";
import { useAuth } from "../auth/AuthContext";

/** Shows the user's watchlist, or a message if it's empty. */
export default function Watchlist({ watchlist, syncWatchlist }) {
  if (watchlist.length === 0) return <p>Your watchlist is empty.</p>;

  return (
    <ul className="flex flex-wrap items-start gap-6">
      {watchlist.map((item) => (
        <WatchlistItem
          key={item.id}
          item={item}
          syncWatchlist={syncWatchlist}
        />
      ))}
    </ul>
  );
}

/** Shows one watchlist movie with a Watched checkbox and a Remove button. */
function WatchlistItem({ item, syncWatchlist }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  /** Marks this movie as watched or unwatched, then refreshes the watchlist. */
  const tryWatched = async () => {
    setError(null);

    try {
      await updateWatchlistItem(token, item.id, !item.watched);
      syncWatchlist();
    } catch (e) {
      setError(e.message);
    }
  };

  /** Removes this movie from the watchlist, then refreshes it. */
  const tryRemove = async () => {
    setError(null);

    try {
      await removeFromWatchlist(token, item.id);
      syncWatchlist();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li
      className={
        "relative w-34 rounded bg-red-950 p-1 flex flex-col gap-1" +
        (item.watched ? " opacity-50" : "")
      }
    >
      <button
        onClick={tryRemove}
        aria-label="Remove"
        title="Remove"
        className="absolute top-2 right-2 bg-neutral-900 px-1.5 py-0.5 text-sm leading-none"
      >
        ✕
      </button>
      <Link to={"/movies/" + item.movie_id} title={item.title}>
        {item.poster_url ? (
          <img
            src={item.poster_url}
            alt={"Poster of " + item.title}
            loading="lazy"
          />
        ) : (
          <div className="w-32 aspect-[2/3] bg-black border border-neutral-700 flex items-center justify-center text-center p-2">
            {item.title}
          </div>
        )}
      </Link>
      <div className="flex justify-between items-center gap-1">
        <p className="rounded px-1 text-xs bg-blue-950">{item.year}</p>
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" checked={item.watched} onChange={tryWatched} />
          Watched
        </label>
      </div>
      {error && <p role="alert">{error}</p>}
    </li>
  );
}
