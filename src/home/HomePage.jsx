import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getRecentMovies, getRandomMovies } from "../api/movies";
import { getShoutouts } from "../api/shoutouts";
import { getAccount } from "../api/users";
import { useAuth } from "../auth/AuthContext";

import MovieList from "../movies/MovieList";
import ShoutoutBoard from "./ShoutoutBoard";

/** Shows a random reviewed pick, Brian's most recently logged movies, a few more random picks and the shout out board. */
export default function HomePage() {
  const { token } = useAuth();

  const [recentMovies, setRecentMovies] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [shoutouts, setShoutouts] = useState([]);
  const [account, setAccount] = useState(null);

  /** Gets the most recently logged movies from the API and saves them in state. */
  const syncRecentMovies = async () => {
    const data = await getRecentMovies();
    setRecentMovies(data);
  };

  /** Gets 4 random highly rated movies from the API, the first with a review, and saves them in state. */
  const syncRandomMovies = async () => {
    const data = await getRandomMovies();
    setRandomMovies(data);
  };

  /** Gets the shout outs from the API and saves them in state. */
  const syncShoutouts = async () => {
    const data = await getShoutouts();
    setShoutouts(data);
  };

  /** Gets the logged-in user's account from the API and saves it in state. */
  const syncAccount = async () => {
    const data = await getAccount(token);
    setAccount(data);
  };

  useEffect(() => {
    syncRecentMovies();
    syncRandomMovies();
    syncShoutouts();
    if (token) syncAccount();
  }, []);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="min-w-0 lg:w-3/5">
        <section className="rounded border border-neutral-800 p-4">
          {randomMovies.length > 0 && <BrianPick movie={randomMovies[0]} />}
          <h2>Random Picks</h2>
          <MovieList movies={randomMovies.slice(1)} small />
        </section>
        <h2>Brian&apos;s Recently Seen</h2>
        <MovieList movies={recentMovies} scroll />
      </div>
      <div className="lg:w-2/5">
        <ShoutoutBoard
          shoutouts={shoutouts}
          account={account}
          syncShoutouts={syncShoutouts}
        />
      </div>
    </div>
  );
}

/** Shows one movie's poster, title, rating and the start of Brian's review. */
function BrianPick({ movie }) {
  return (
    <section className="flex flex-col sm:flex-row gap-4">
      <Link to={"/movies/" + movie.id} title={movie.title}>
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={"Poster of " + movie.title} />
        ) : (
          <div className="w-32 aspect-[2/3] bg-black border border-neutral-700 flex items-center justify-center text-center p-2">
            {movie.title}
          </div>
        )}
      </Link>
      <div>
        <h1>Brian&apos;s Pick: {movie.title}</h1>
        <p>{movie.year}</p>
        <p>Rating: {movie.rating}/5</p>
        <p className="line-clamp-6 whitespace-pre-line my-2">{movie.review}</p>
        <Link to={"/movies/" + movie.id}>Read the full review</Link>
      </div>
    </section>
  );
}
