const API = import.meta.env.VITE_API;

/** Fetches the movies that match the given search, tags and sort from the API. */
export async function getMovies(token, query) {
  try {
    const response = await fetch(API + "/movies?" + query, {
      headers: token ? { Authorization: "Bearer " + token } : {},
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/** Fetches a single movie from the API using its ID. */
export async function getMovie(id) {
  try {
    const response = await fetch(API + "/movies/" + id);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/** Fetches movies similar to the one with the given ID. */
export async function getSimilarMovies(id) {
  try {
    const response = await fetch(API + "/movies/" + id + "/similar");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/** Fetches the movies Brian logged most recently. */
export async function getRecentMovies() {
  try {
    const response = await fetch(API + "/movies/recent");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/** Fetches 4 random movies that Brian rated highly, the first one with a review. */
export async function getRandomMovies() {
  try {
    const response = await fetch(API + "/movies/random");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}
