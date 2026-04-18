import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const STATUS_COLORS = {
    pending:     "bg-yellow-100 text-yellow-800",
    open:        "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    resolved:    "bg-green-100 text-green-800",
    closed:      "bg-gray-100 text-gray-700",
};

const PRIORITY_COLORS = {
    low:      "bg-green-100 text-green-800",
    medium:   "bg-yellow-100 text-yellow-800",
    high:     "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
};

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setComplaint(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id, user]);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
    if (!complaint) return <div className="p-8 text-center text-gray-400">Complaint not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-5">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/user/complaints')}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-1"
                >
                    ← Back to My Complaints
                </button>

                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{complaint.title}</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[complaint.status] || "bg-gray-100"}`}>
                                {complaint.status}
                            </span>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${PRIORITY_COLORS[complaint.priority] || "bg-gray-100"}`}>
                                {complaint.priority} priority
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 mt-4 text-sm leading-relaxed">{complaint.description}</p>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                        {complaint.location?.address && (
                            <span>📍 {complaint.location.address}</span>
                        )}
                        <span>🏷 {complaint.category?.replace("_", " ")}</span>
                        {complaint.assigned_to && (
                            <span>👤 Assigned to: {complaint.assigned_to.name}</span>
                        )}
                    </div>
                </div>

                {/* Media Gallery */}
                {complaint.media?.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-sm font-medium text-gray-700 mb-3">
                            Attached Media ({complaint.media.length})
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {complaint.media.map((m, i) => (
                                <div
                                    key={i}
                                    onClick={() => setLightbox(m)}
                                    className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100 cursor-pointer group"
                                >
                                    {m.resource_type === "video" ? (
                                        <video src={m.url} className="w-full h-full object-cover" muted />
                                    ) : (
                                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 text-white text-2xl">
                                            {m.resource_type === "video" ? "▶" : "🔍"}
                                        </span>
                                    </div>
                                    {m.resource_type === "video" && (
                                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                            Video
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feedback Banner for resolved complaints */}
                {complaint.status === 'resolved' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-2">⭐</div>
                        <h3 className="font-semibold text-amber-800 mb-1">This complaint has been resolved!</h3>
                        <p className="text-sm text-amber-600 mb-4">How satisfied are you with the response? Share your feedback to help improve the service.</p>
                        <button
                            onClick={() => navigate(`/user/feedback/${id}`)}
                            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition shadow-sm"
                        >
                            Leave Feedback
                        </button>
                    </div>
                )}

            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        {lightbox.resource_type === "video" ? (
                            <video src={lightbox.url} controls autoPlay className="w-full rounded-xl" />
                        ) : (
                            <img src={lightbox.url} alt="" className="w-full rounded-xl object-contain max-h-[80vh]" />
                        )}
                        <button
                            onClick={() => setLightbox(null)}
                            className="mt-3 text-white text-sm underline block mx-auto"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintDetail;