import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { getMovies } from "../api/movies";
import { getSubgenres } from "../api/subgenres";
import { useAuth } from "../auth/AuthContext";

import MovieList from "./MovieList";

const tagColors = {
  Slasher: "bg-red-600",
  Supernatural: "bg-indigo-600",
  "Horror Comedy": "bg-yellow-600",
  Psychological: "bg-violet-600",
  "Creature Feature": "bg-green-600",
  "Sci-Fi Horror": "bg-cyan-600",
  "Occult & Possession": "bg-purple-600",
  "Home Invasion & Survival": "bg-orange-600",
  "Serial Killer": "bg-slate-600",
  "Body Horror": "bg-pink-600",
  "Torture & Death Traps": "bg-stone-600",
  Zombie: "bg-lime-600",
  Vampire: "bg-rose-600",
  "Folk Horror": "bg-amber-600",
  "Found Footage": "bg-teal-600",
  "Family Spooky": "bg-sky-600",
  Campy: "bg-emerald-600",
  "Erotic Horror": "bg-fuchsia-600",
  "Thriller/Suspense": "bg-zinc-600",
  "Action Horror": "bg-blue-600",
  "Art House": "bg-amber-800",
  "Spook House": "bg-indigo-900",
};

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
      <form onSubmit={tryApply}>
        <label>
          Search
          <input
            type="text"
            name="search"
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
        <label>
          Sort by
          <select
            name="sort"
            value={sort}
            onChange={(e) => changeParams({ sort: e.target.value })}
          >
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="logged">Date logged</option>
            <option value="rating">My rating</option>
          </select>
        </label>
        <label>
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
          <label>
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
