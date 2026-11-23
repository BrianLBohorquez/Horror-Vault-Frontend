import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getMovie, getSimilarMovies } from "../api/movies";
import { addToWatchlist } from "../api/watchlist";
import { getComments } from "../api/comments";
import { getVotes } from "../api/votes";
import { getAccount } from "../api/users";
import { useAuth } from "../auth/AuthContext";

import MovieList from "./MovieList";
import { tagColors, getStars } from "./tags";
import Comments from "./Comments";
import Votes from "./Votes";

/** Shows the details of one movie, with its votes, comments and similar movies. */
export default function MovieDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState([]);
  const [account, setAccount] = useState(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);

  /** Gets this movie's info from the API and saves it in state. */
  const syncMovie = async () => {
    const data = await getMovie(id);
    setMovie(data);
  };

  /** Gets movies similar to this one from the API and saves them in state. */
  const syncSimilarMovies = async () => {
    const data = await getSimilarMovies(id);
    setSimilarMovies(data);
  };

  /** Gets this movie's comments from the API and saves them in state. */
  const syncComments = async () => {
    const data = await getComments(id);
    setComments(data);
  };

  /** Gets this movie's votes from the API and saves them in state. */
  const syncVotes = async () => {
    const data = await getVotes(id);
    setVotes(data);
  };

  /** Gets the logged-in user's account from the API and saves it in state. */
  const syncAccount = async () => {
    const data = await getAccount(token);
    setAccount(data);
  };

  useEffect(() => {
    syncMovie();
    syncSimilarMovies();
    syncComments();
    syncVotes();
    if (token) syncAccount();
    setAdded(false);
    setError(null);
  }, [id]);

  /** Adds this movie to the user's watchlist, then disables the button. */
  const tryAdd = async () => {
    setError(null);

    try {
      await addToWatchlist(token, movie.id);
      setAdded(true);
    } catch (e) {
      setError(e.message);
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded border border-red-900 bg-red-950 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="shrink-0">
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={"Poster of " + movie.title} />
            ) : (
              <div className="w-32 aspect-[2/3] bg-black border border-neutral-700 flex items-center justify-center text-center p-2">
                {movie.title}
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="mb-0 rounded border border-red-600 bg-neutral-950 px-3 py-2 text-white underline decoration-red-600">
                {movie.title}
              </h1>
              {movie.letterboxd_url && (
                <a
                  href={movie.letterboxd_url}
                  target="_blank"
                  rel="noreferrer"
                  className="border rounded px-2 py-1 text-neutral-200 hover:bg-neutral-800"
                >
                  View on Letterboxd
                </a>
              )}
              {token && (
                <button onClick={tryAdd} disabled={added}>
                  {added ? "Added to watchlist" : "Add to watchlist"}
                </button>
              )}
            </div>
            {error && <p role="alert">{error}</p>}
            <ul className="flex flex-wrap items-center gap-2 mb-2">
              <li className="rounded px-1 bg-blue-950">{movie.year}</li>
              {movie.rating ? (
                <li className="rounded px-1 whitespace-nowrap bg-green-900">
                  {getStars(movie.rating)}
                </li>
              ) : (
                <li className="rounded px-1 bg-red-900">Not rated</li>
              )}
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
            {movie.synopsis && (
              <p className="rounded bg-neutral-950 p-3 mb-2">
                {movie.synopsis}
              </p>
            )}
          </div>
          <div className="shrink-0 sm:ml-auto">
            <Votes
              movieId={movie.id}
              votes={votes}
              account={account}
              syncVotes={syncVotes}
            />
          </div>
        </div>
        <p className="rounded bg-neutral-950 p-3 w-fit mt-4">
          Logged {new Date(movie.date_logged).toLocaleDateString()}
        </p>
        {movie.review && (
          <p className="rounded bg-neutral-950 p-3 mt-2 whitespace-pre-line">
            {movie.review}
          </p>
        )}
      </section>
      <section className="rounded border border-neutral-800 bg-neutral-900 p-4">
        <Comments
          movieId={movie.id}
          comments={comments}
          account={account}
          syncComments={syncComments}
        />
      </section>
      <section className="rounded border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mt-0">More like this</h2>
        <MovieList movies={similarMovies} />
        <Link
          to={"/movies?show=" + encodeURIComponent(movie.subgenre)}
          className="inline-block mt-4 border rounded px-2 py-1 text-neutral-200 hover:bg-neutral-800"
        >
          See more {movie.subgenre}
        </Link>
      </section>
    </div>
  );
}
