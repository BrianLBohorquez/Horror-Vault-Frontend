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
    <div className="w-fit rounded bg-neutral-950 p-2 flex flex-col items-center gap-2">
      {token && (
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-1">
            <p>Agree</p>
            <button
              className="border-green-700 bg-green-900"
              onClick={() => tryVote(true)}
              disabled={myVote && myVote.thumbs_up}
              aria-label="Agree"
            >
              👍
            </button>
          </div>
          <p>or</p>
          <div className="flex flex-col items-center gap-1">
            <p>Disagree</p>
            <button
              className="border-red-700 bg-red-900"
              onClick={() => tryVote(false)}
              disabled={myVote && !myVote.thumbs_up}
              aria-label="Disagree"
            >
              👎
            </button>
          </div>
        </div>
      )}
      {votes.length === 0 ? (
        <p>No votes yet.</p>
      ) : (
        <p>
          {percent}% agree ({votes.length} total)
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
