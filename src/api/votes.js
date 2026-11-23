const API = import.meta.env.VITE_API;

/** Fetches an array of all votes on the movie with the given ID. */
export async function getVotes(movieId) {
  try {
    const response = await fetch(API + "/movies/" + movieId + "/votes");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Asks the API to save the user's thumbs up or down on the movie with the given ID.
 * A valid token is required.
 */
export async function setVote(token, movieId, thumbsUp) {
  if (!token) {
    throw Error("You must be logged in to vote.");
  }

  const response = await fetch(API + "/movies/" + movieId + "/votes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ thumbsUp }),
  });

  if (!response.ok) {
    const result = await response.text();
    throw Error(result);
  }
}
