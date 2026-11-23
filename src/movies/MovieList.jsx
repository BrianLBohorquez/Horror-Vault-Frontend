import { Link } from "react-router";
import { tagColors, tagShortNames, getStars } from "./tags";

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

/** Shows one movie's poster, year, rating (with a heart if Brian liked it) and tags. */
function MovieListItem({ movie, small }) {
  const width = small ? "w-28" : "w-32";
  const cardWidth = small ? "w-30" : "w-34";
  const pillSize = small ? "text-[0.625rem] px-0.5" : "text-xs px-1";
  const starSize = small
    ? "text-[0.625rem] px-0.5"
    : "text-[0.625rem] leading-4 px-1";
  const tags = [movie.subgenre, movie.subgenre_2, movie.subgenre_3].filter(
    (tag) => tag,
  );

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
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex justify-between items-start gap-1">
          <p className={"rounded bg-blue-950 " + pillSize}>{movie.year}</p>
          <TagList tags={tags.slice(0, 2)} pillSize={pillSize} />
        </div>
        <div className="flex justify-between items-start gap-1">
          <div className="flex items-center gap-1 shrink-0">
            {movie.rating ? (
              <p
                className={"rounded whitespace-nowrap bg-green-900 " + starSize}
              >
                {getStars(movie.rating)}
              </p>
            ) : (
              <p className={"rounded bg-red-900 " + pillSize}>Not rated</p>
            )}
            {movie.liked && (
              <span
                aria-label="Liked"
                className={
                  "leading-none text-red-600 " + (small ? "text-xs" : "text-sm")
                }
              >
                ♥
              </span>
            )}
          </div>
          <TagList tags={tags.slice(2)} pillSize={pillSize} />
        </div>
      </div>
    </li>
  );
}

/** Shows a movie's tags as small colored pills, lined up from the right. */
function TagList({ tags, pillSize }) {
  return (
    <ul className="flex flex-row-reverse gap-1">
      {tags.map((tag) => (
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
  );
}
