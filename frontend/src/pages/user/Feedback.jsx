import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

const Feedback = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [text, setText] = useState("");

  const submitFeedback = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.post(
        `http://localhost:5000/api/complaints/${id}/feedback`,
        { text },
        config
      );

      alert("Feedback submitted");
      setText("");
    } catch (err) {
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Give Feedback</h2>

      <form onSubmit={submitFeedback}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border mb-3"
          placeholder="Write your feedback..."
          required
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Feedback;