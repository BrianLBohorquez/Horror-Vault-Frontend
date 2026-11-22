import { Link } from "react-router";
import { tagColors, tagShortNames } from "./tags";

/** Shows a list of movies, each linking to its own page. */
export default function MovieList({ movies }) {
  return (
    <ul className="flex flex-wrap gap-6">
      {movies.map((movie) => (
        <MovieListItem key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}

/** Shows one movie's poster, year, rating and tags. */
function MovieListItem({ movie }) {
  return (
    <li className="w-32">
      <Link to={"/movies/" + movie.id} title={movie.title}>
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={"Poster of " + movie.title}
            loading="lazy"
          />
        ) : (
          <div className="w-32 aspect-[2/3] bg-black border border-neutral-700 flex items-center justify-center text-center p-2">
            {movie.title}
          </div>
        )}
      </Link>
      <div className="flex justify-between items-center gap-2 my-1">
        <p className="rounded px-1 text-xs bg-red-900">{movie.year}</p>
        {movie.rating ? (
          <p className="rounded px-1 text-xs bg-red-900">{movie.rating}/5</p>
        ) : (
          <p className="rounded px-1 text-xs bg-red-900">Not rated</p>
        )}
      </div>
      <ul className="flex flex-wrap gap-1">
        {[movie.subgenre, movie.subgenre_2, movie.subgenre_3]
          .filter((tag) => tag)
          .map((tag) => (
            <li
              key={tag}
              title={tag}
              className={
                "rounded px-1 text-xs text-white " +
                (tagColors[tag] || "bg-neutral-600")
              }
            >
              {tagShortNames[tag] || tag}
            </li>
          ))}
      </ul>
    </li>
  );
}
