const API = import.meta.env.VITE_API;

/** Fetches an array of all shout outs. */
export async function getShoutouts() {
  try {
    const response = await fetch(API + "/shoutouts");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Asks the API to add a shout out.
 * A valid token is required.
 */
export async function addShoutout(token, body) {
  if (!token) {
    throw Error("You must be logged in to leave a shout out.");
  }

  const response = await fetch(API + "/shoutouts", {
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
 * Asks the API to delete the shout out with the given ID.
 * A valid token is required.
 */
export async function deleteShoutout(token, id) {
  if (!token) {
    throw Error("You must be logged in to delete a shout out.");
  }

  const response = await fetch(API + "/shoutouts/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.text();
    throw Error(result);
  }
}
