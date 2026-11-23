import { useState } from "react";
import { addShoutout, deleteShoutout } from "../api/shoutouts";
import { useAuth } from "../auth/AuthContext";

/** Shows the shout outs left for Brian, with a form to post one for logged-in users. */
export default function ShoutoutBoard({ shoutouts, account, syncShoutouts }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  /** Posts the shout out from the form, then refreshes the board. */
  const tryAdd = async (formData) => {
    setError(null);
    const body = formData.get("body");

    try {
      await addShoutout(token, body);
      syncShoutouts();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="rounded border border-neutral-800 bg-neutral-900 p-4 flex flex-col lg:absolute lg:inset-0">
      <h2 className="mt-0">Shout Out Board</h2>
      {token && (
        <form action={tryAdd} className="flex flex-col items-start gap-2 mb-4">
          <label className="w-full">
            <span className="sr-only">Leave a shout out</span>
            <textarea
              name="body"
              placeholder="Leave a suggestion or comment for Brian"
              rows={4}
              required
              className="w-full border rounded px-2 py-1 bg-neutral-950 placeholder:text-neutral-500"
            />
          </label>
          <button>Post</button>
          {error && <p role="alert">{error}</p>}
        </form>
      )}
      {shoutouts.length === 0 ? (
        <p>No shout outs yet.</p>
      ) : (
        <ul className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-96 lg:max-h-none lg:flex-1 lg:min-h-0">
          {shoutouts.map((shoutout) => (
            <ShoutoutItem
              key={shoutout.id}
              shoutout={shoutout}
              account={account}
              syncShoutouts={syncShoutouts}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

/** Shows one shout out, with a Delete button if it belongs to the logged-in user. */
function ShoutoutItem({ shoutout, account, syncShoutouts }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  /** Deletes this shout out, then refreshes the board. */
  const tryDelete = async () => {
    setError(null);

    try {
      await deleteShoutout(token, shoutout.id);
      syncShoutouts();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li className="border-b border-neutral-700 pb-2">
      <div className="flex justify-between gap-2 text-sm text-neutral-400">
        <p>{shoutout.username}</p>
        <p>{new Date(shoutout.date_posted).toLocaleDateString()}</p>
      </div>
      <p>{shoutout.body}</p>
      {token && account && account.id === shoutout.user_id && (
        <button onClick={tryDelete}>Delete</button>
      )}
      {error && <p role="alert">{error}</p>}
    </li>
  );
}
