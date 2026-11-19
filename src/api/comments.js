const API = import.meta.env.VITE_API;

/** Fetches an array of all comments on the movie with the given ID. */
export async function getComments(movieId) {
  try {
    const response = await fetch(API + "/movies/" + movieId + "/comments");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Asks the API to add a comment to the movie with the given ID.
 * A valid token is required.
 */
export async function addComment(token, movieId, body) {
  if (!token) {
    throw Error("You must be logged in to comment.");
  }

  const response = await fetch(API + "/movies/" + movieId + "/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ body }),
  });

  if (!response.ok) {
    const result = await response.text();
    throw Error(result);
  }
}

/**
 * Asks the API to delete the comment with the given ID.
 * A valid token is required.
 */
export async function deleteComment(token, id) {
  if (!token) {
    throw Error("You must be logged in to delete a comment.");
  }

  const response = await fetch(API + "/comments/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.text();
    throw Error(result);
  }
}
