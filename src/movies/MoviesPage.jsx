import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getMovies } from "../api/movies";
import { getSubgenres } from "../api/subgenres";
import { useAuth } from "../auth/AuthContext";

import MovieList from "./MovieList";
import { tagColors } from "./tags";

export default function MoviesPage() {
  const { token } = useAuth();

  const [movies, setMovies] = useState([]);
  const [subgenres, setSubgenres] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [shownTags, setShownTags] = useState(
    searchParams.get("show") ? searchParams.get("show").split(",") : [],
  );
  const [hiddenTags, setHiddenTags] = useState(
    searchParams.get("hide") ? searchParams.get("hide").split(",") : [],
  );

  const half = Math.ceil(subgenres.length / 2);

  const sort = searchParams.get("sort") || "title";
  const order = searchParams.get("order") || "asc";
  const watched = searchParams.get("watched") || "";

  const syncMovies = async () => {
    const data = await getMovies(token, searchParams.toString());
    setMovies(data);
  };

  const syncSubgenres = async () => {
    const data = await getSubgenres();
    setSubgenres(data);
  };

  const changeParams = (changes) => {
    const params = new URLSearchParams(searchParams);
    for (const name in changes) {
      if (changes[name]) {
        params.set(name, changes[name]);
      } else {
        params.delete(name);
      }
    }
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    syncSubgenres();
  }, []);

  useEffect(() => {
    syncMovies();
  }, [searchParams, token]);

  useEffect(() => {
    if (search === (searchParams.get("search") || "")) return;
    const timer = setTimeout(() => changeParams({ search }), 300);
    return () => clearTimeout(timer);
  }, [search, searchParams]);

  const toggleShow = (name) => {
    if (shownTags.includes(name)) {
      setShownTags(shownTags.filter((tag) => tag !== name));
    } else {
      setShownTags([...shownTags, name]);
      setHiddenTags(hiddenTags.filter((tag) => tag !== name));
    }
  };

  const toggleHide = (name) => {
    if (hiddenTags.includes(name)) {
      setHiddenTags(hiddenTags.filter((tag) => tag !== name));
    } else {
      setHiddenTags([...hiddenTags, name]);
      setShownTags(shownTags.filter((tag) => tag !== name));
    }
  };

  const tryReset = () => {
    setShownTags([]);
    setHiddenTags([]);
    changeParams({ show: "", hide: "" });
  };

  const tryApply = (e) => {
    e.preventDefault();
    changeParams({
      search,
      show: shownTags.join(","),
      hide: hiddenTags.join(","),
    });
  };

  return (
    <>
      <h1>Movies</h1>
      <form
        onSubmit={tryApply}
        className="flex flex-wrap items-center gap-4 mb-4"
      >
        <label className="w-full sm:w-auto">
          <span className="sr-only">Search By Title</span>
          <input
            type="text"
            name="search"
            placeholder="Search By Title"
            className="w-full sm:w-80 border rounded px-2 py-1 bg-neutral-900 placeholder:text-neutral-500 focus:placeholder:text-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <details className="relative">
          <summary>Subgenres</summary>
          <div className="absolute z-10 w-max bg-neutral-900 p-2 text-sm sm:text-base">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-0 sm:divide-x sm:divide-neutral-600">
              <SubgenreColumn
                subgenres={subgenres.slice(0, half)}
                shownTags={shownTags}
                hiddenTags={hiddenTags}
                toggleShow={toggleShow}
                toggleHide={toggleHide}
              />
              <SubgenreColumn
                subgenres={subgenres.slice(half)}
                shownTags={shownTags}
                hiddenTags={hiddenTags}
                toggleShow={toggleShow}
                toggleHide={toggleHide}
              />
            </div>
            <div className="flex gap-4 mt-2">
              <button className="border rounded px-2">Apply</button>
              <button
                type="button"
                className="border rounded px-2"
                onClick={tryReset}
              >
                Reset
              </button>
            </div>
          </div>
        </details>
        <label className="flex items-center gap-2">
          Sort by
          <select
            name="sort"
            value={sort}
            onChange={(e) => changeParams({ sort: e.target.value })}
          >
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="logged">Date logged</option>
            <option value="rating">Brian&apos;s Rating</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Order
          <select
            name="order"
            value={order}
            onChange={(e) => changeParams({ order: e.target.value })}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        {token && (
          <label className="flex items-center gap-2">
            Hide watched
            <input
              type="checkbox"
              name="watched"
              checked={watched === "hide"}
              onChange={(e) =>
                changeParams({ watched: e.target.checked ? "hide" : "" })
              }
            />
          </label>
        )}
      </form>
      <p>{movies.length} movies</p>
      <MovieList movies={movies} />
    </>
  );
}

function SubgenreColumn({
  subgenres,
  shownTags,
  hiddenTags,
  toggleShow,
  toggleHide,
}) {
  return (
    <ul className="flex flex-col gap-1 sm:px-4">
      {subgenres.map((genre) => (
        <SubgenreChoice
          key={genre.id}
          name={genre.name}
          shownTags={shownTags}
          hiddenTags={hiddenTags}
          toggleShow={toggleShow}
          toggleHide={toggleHide}
        />
      ))}
    </ul>
  );
}

function SubgenreChoice({
  name,
  shownTags,
  hiddenTags,
  toggleShow,
  toggleHide,
}) {
  const shown = shownTags.includes(name);
  const hidden = hiddenTags.includes(name);

  return (
    <li className="flex justify-between items-center gap-4">
      <span
        className={
          "rounded px-2 text-white whitespace-nowrap " +
          (tagColors[name] || "bg-neutral-600")
        }
      >
        {name}
      </span>
      <span className="flex gap-3">
        <label>
          Show
          <input
            type="checkbox"
            checked={shown}
            disabled={!shown && shownTags.length === 3}
            onChange={() => toggleShow(name)}
          />
        </label>
        <label>
          Hide
          <input
            type="checkbox"
            checked={hidden}
            onChange={() => toggleHide(name)}
          />
        </label>
      </span>
    </li>
  );
}
