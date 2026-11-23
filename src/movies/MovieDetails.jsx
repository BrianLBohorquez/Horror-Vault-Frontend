import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getMovie, getSimilarMovies } from "../api/movies";
import { addToWatchlist } from "../api/watchlist";
import { getComments } from "../api/comments";
import { getVotes } from "../api/votes";
import { getAccount } from "../api/users";
import { useAuth } from "../auth/AuthContext";

import MovieList from "./MovieList";
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
    <>
      {movie.poster_url ? (
        <img src={movie.poster_url} alt={"Poster of " + movie.title} />
      ) : (
        <div className="w-32 aspect-[2/3] bg-black border border-neutral-700 flex items-center justify-center text-center p-2">
          {movie.title}
        </div>
      )}
      <h1>{movie.title}</h1>
      <p>{movie.year}</p>
      <p>{movie.subgenre}</p>
      {movie.synopsis && <p>{movie.synopsis}</p>}
      {movie.rating ? <p>Rating: {movie.rating}</p> : <p>Not rated</p>}
      {movie.liked && <p>Liked</p>}
      <Votes
        movieId={movie.id}
        votes={votes}
        account={account}
        syncVotes={syncVotes}
      />
      <p>Logged {new Date(movie.date_logged).toLocaleDateString()}</p>
      {movie.review && <p>{movie.review}</p>}
      {movie.letterboxd_url && (
        <a href={movie.letterboxd_url} target="_blank" rel="noreferrer">
          View on Letterboxd
        </a>
      )}
      {token && (
        <button onClick={tryAdd} disabled={added}>
          {added ? "Added to watchlist" : "Add to watchlist"}
        </button>
      )}
      {error && <p role="alert">{error}</p>}
      <Comments
        movieId={movie.id}
        comments={comments}
        account={account}
        syncComments={syncComments}
      />
      <h2>More like this</h2>
      <MovieList movies={similarMovies} />
      <Link to={"/movies?show=" + encodeURIComponent(movie.subgenre)}>
        See more {movie.subgenre}
      </Link>
    </>
  );
}
