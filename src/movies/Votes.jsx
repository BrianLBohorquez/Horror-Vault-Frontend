import { useState } from "react";
import { setVote } from "../api/votes";
import { useAuth } from "../auth/AuthContext";

/** Shows what percent of users gave a movie a thumbs up, with buttons to vote for logged-in users. */
export default function Votes({ movieId, votes, account, syncVotes }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const upVotes = votes.filter((vote) => vote.thumbs_up).length;
  const percent = Math.round((upVotes / votes.length) * 100);
  const myVote = account && votes.find((vote) => vote.user_id === account.id);

  /** Saves the user's thumbs up or down, then refreshes the votes. */
  const tryVote = async (thumbsUp) => {
    setError(null);

    try {
      await setVote(token, movieId, thumbsUp);
      syncVotes();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="my-2">
      {votes.length === 0 ? (
        <p>No votes yet.</p>
      ) : (
        <p>
          {percent}% thumbs up ({votes.length} total)
        </p>
      )}
      {token && (
        <div className="flex gap-2">
          <button
            className="border rounded px-2"
            onClick={() => tryVote(true)}
            disabled={myVote && myVote.thumbs_up}
          >
            Thumbs up
          </button>
          <button
            className="border rounded px-2"
            onClick={() => tryVote(false)}
            disabled={myVote && !myVote.thumbs_up}
          >
            Thumbs down
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
