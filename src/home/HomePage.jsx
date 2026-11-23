import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getRecentMovies, getRandomMovies } from "../api/movies";
import { getShoutouts } from "../api/shoutouts";
import { getAccount } from "../api/users";
import { useAuth } from "../auth/AuthContext";

import MovieList from "../movies/MovieList";
import ShoutoutBoard from "./ShoutoutBoard";
import { tagColors, getStars } from "../movies/tags";

/** Shows an intro to the site, a random reviewed pick with a few more random picks, Brian's most recently logged movies and the shout out board. */
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
    <>
      <section className="rounded border border-neutral-800 bg-neutral-900 p-4 mb-8">
        <h1>Welcome to the Horror Vault</h1>
        <p className="max-w-3xl">
          Horror Vault is a horror movie database built from my own Letterboxd
          ratings and reviews. Every movie is tagged by its subgenres, so you
          can browse by the kind of horror you&apos;re in the mood for and find
          similar movies based off my ratings.
        </p>
        <p className="max-w-3xl mt-2">
          Search, sort and filter by tag on the <Link to="/movies">Movies</Link>{" "}
          page. <Link to="/register">Make an account</Link> to save movies to
          your watchlist, give them a thumbs up or down, leave comments and send
          me a suggestion on the Shout Out Board.
        </p>
      </section>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 lg:w-3/5 flex flex-col gap-8">
          <section className="rounded border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="mt-0">Random Picks</h2>
            {randomMovies.length > 0 && <BrianPick movie={randomMovies[0]} />}
            <MovieList movies={randomMovies.slice(1)} small />
          </section>
          <section className="rounded border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="mt-0">Brian&apos;s Recently Seen</h2>
            <MovieList movies={recentMovies} scroll />
          </section>
        </div>
        <div className="lg:w-2/5 lg:relative">
          <ShoutoutBoard
            shoutouts={shoutouts}
            account={account}
            syncShoutouts={syncShoutouts}
          />
        </div>
      </div>
    </>
  );
}

/** Shows one movie's poster, year, rating (with a heart if Brian liked it), tags and the start of Brian's review. */
function BrianPick({ movie }) {
  return (
    <section className="flex flex-col sm:flex-row gap-4 mb-4">
      <Link to={"/movies/" + movie.id} title={movie.title} className="shrink-0">
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={"Poster of " + movie.title} />
        ) : (
          <div className="w-32 aspect-[2/3] bg-black border border-neutral-700 flex items-center justify-center text-center p-2">
            {movie.title}
          </div>
        )}
      </Link>
      <div>
        <ul className="flex flex-wrap items-center gap-2 mb-2">
          <li className="rounded px-1 bg-blue-950">{movie.year}</li>
          <li className="rounded px-1 whitespace-nowrap bg-green-900">
            {getStars(movie.rating)}
          </li>
          {movie.liked && (
            <li
              aria-label="Liked"
              className="text-2xl leading-none text-red-600"
            >
              ♥
            </li>
          )}
          {[movie.subgenre, movie.subgenre_2, movie.subgenre_3]
            .filter((tag) => tag)
            .map((tag) => (
              <li
                key={tag}
                className={
                  "rounded px-1 text-white " +
                  (tagColors[tag] || "bg-neutral-600")
                }
              >
                {tag}
              </li>
            ))}
        </ul>
        <p className="rounded bg-neutral-950 p-3 line-clamp-6 whitespace-pre-line">
          {movie.review}
        </p>
        <Link
          to={"/movies/" + movie.id}
          className="inline-block mt-4 border rounded px-2 py-1 text-neutral-200 hover:bg-neutral-800"
        >
          Read the full review
        </Link>
      </div>
    </section>
  );
}
