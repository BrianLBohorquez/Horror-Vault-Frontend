import { Link } from "react-router";
import { tagColors, tagShortNames } from "./tags";

/** Shows a list of movies, each linking to its own page, in one sideways-scrolling row when scroll is set and with smaller posters when small is set. */
export default function MovieList({ movies, scroll, small }) {
  return (
    <ul
      className={
        scroll
          ? "flex items-start gap-6 overflow-x-auto snap-x pb-2"
          : "flex flex-wrap items-start gap-6"
      }
    >
      {movies.map((movie) => (
        <MovieListItem key={movie.id} movie={movie} small={small} />
      ))}
    </ul>
  );
}

/** Shows one movie's poster, year, rating and tags. */
function MovieListItem({ movie, small }) {
  const width = small ? "w-28" : "w-32";
  const cardWidth = small ? "w-30" : "w-34";
  const pillSize = small ? "text-[0.625rem] px-0.5" : "text-xs px-1";

  return (
    <li className={cardWidth + " shrink-0 snap-start rounded bg-red-950 p-1"}>
      <Link to={"/movies/" + movie.id} title={movie.title}>
        {movie.poster_url ? (
          <img
            className={width}
            src={movie.poster_url}
            alt={"Poster of " + movie.title}
            loading="lazy"
          />
        ) : (
          <div
            className={
              width +
              " aspect-[2/3] bg-black border border-neutral-700 flex items-center justify-center text-center p-2"
            }
          >
            {movie.title}
          </div>
        )}
      </Link>
      <div className="flex justify-between items-start gap-1 mt-1">
        <div className="flex flex-col items-start gap-1 shrink-0">
          <p className={"rounded bg-blue-950 " + pillSize}>{movie.year}</p>
          {movie.rating ? (
            <p className={"rounded whitespace-nowrap bg-green-900 " + pillSize}>
              {movie.rating}/5 ★
            </p>
          ) : (
            <p className={"rounded bg-red-900 " + pillSize}>Not rated</p>
          )}
        </div>
        <ul className="flex flex-row-reverse flex-wrap gap-1">
          {[movie.subgenre, movie.subgenre_2, movie.subgenre_3]
            .filter((tag) => tag)
            .map((tag) => (
              <li
                key={tag}
                title={tag}
                className={
                  "rounded text-white " +
                  pillSize +
                  " " +
                  (tagColors[tag] || "bg-neutral-600")
                }
              >
                {tagShortNames[tag] || tag}
              </li>
            ))}
        </ul>
      </div>
    </li>
  );
}
