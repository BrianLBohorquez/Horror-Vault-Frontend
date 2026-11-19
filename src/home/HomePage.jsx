import { useState, useEffect } from "react";
import { getRecentMovies, getRandomMovies } from "../api/movies";

import MovieList from "../movies/MovieList";

/** Shows Brian's most recently logged movies and a few random picks. */
export default function HomePage() {
  const [recentMovies, setRecentMovies] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);

  /** Gets the most recently logged movies from the API and saves them in state. */
  const syncRecentMovies = async () => {
    const data = await getRecentMovies();
    setRecentMovies(data);
  };

  /** Gets 4 random highly rated movies from the API and saves them in state. */
  const syncRandomMovies = async () => {
    const data = await getRandomMovies();
    setRandomMovies(data);
  };

  useEffect(() => {
    syncRecentMovies();
    syncRandomMovies();
  }, []);

  return (
    <>
      <h1>Brian&apos;s Recently Seen</h1>
      <MovieList movies={recentMovies} />
      <h2>Random Picks</h2>
      <MovieList movies={randomMovies} />
    </>
  );
}
