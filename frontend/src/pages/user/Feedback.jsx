import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Feedback = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const check = async () => {
      try {
        const res = await API.get(`/feedback/${id}`);
        if (res.data) setExisting(res.data);
      } catch (_) {}
    };
    check();
  }, [id]);

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating'); return; }
    try {
      setLoading(true);
      await API.post(`/feedback/${id}`, { rating, comment });
      navigate('/user/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  if (existing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Feedback Already Submitted</h2>
          <div className="flex justify-center gap-1 my-4">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className={`text-2xl ${s <= existing.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          {existing.comment && <p className="text-gray-500 text-sm italic">"{existing.comment}"</p>}
          <button onClick={() => navigate('/user/complaints')} className="mt-6 text-sm text-emerald-600 hover:underline">
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⭐</div>
          <h2 className="text-xl font-bold text-gray-800">Rate the Response</h2>
          <p className="text-sm text-gray-500 mt-1">How satisfied are you with how this was handled?</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <div className="flex justify-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="text-4xl transition-transform hover:scale-110"
            >
              <span className={star <= (hovered || rating) ? 'text-amber-400' : 'text-gray-200'}>★</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm font-medium text-amber-600 mb-5 h-5">
          {LABELS[hovered || rating]}
        </p>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)..."
          rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>

        <button
          onClick={() => navigate('/user/complaints')}
          className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600 transition"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Feedback;