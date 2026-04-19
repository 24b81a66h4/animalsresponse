import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const CATEGORIES = [
  { value: "injured_animal", label: "Injured Animal" },
  { value: "stray_animal",   label: "Stray Animal" },
  { value: "abuse",          label: "Animal Abuse" },
  { value: "trapped",        label: "Trapped Animal" },
  { value: "sick_animal",    label: "Sick Animal" },
  { value: "other",          label: "Other" },
];

const PRIORITIES = [
  { value: "low",      label: "Low",      color: "text-green-700 bg-green-50 border-green-200" },
  { value: "medium",   label: "Medium",   color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  { value: "high",     label: "High",     color: "text-orange-700 bg-orange-50 border-orange-200" },
  { value: "critical", label: "Critical", color: "text-red-700 bg-red-50 border-red-200" },
];

// const API_BASE = import.meta.env.VITE_API_URL; // Removed in favor of API service

const SubmitComplaint = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    priority: "medium",
    address: "",
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const processFiles = (selected) => {
    const valid = Array.from(selected).filter((f) => {
      const ok = f.size <= 50 * 1024 * 1024;
      if (!ok) setError(`${f.name} exceeds 50MB limit`);
      return ok;
    });

    if (files.length + valid.length > 5) {
      setError("Maximum 5 files allowed");
      return;
    }

    setError("");
    setFiles((prev) => [...prev, ...valid]);

    valid.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [
          ...prev,
          { url: e.target.result, type: f.type, name: f.name },
        ]);
      };
      reader.readAsDataURL(f);
    });
  };

  const handleFileChange = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description) {
      setError("Title and description are required");
      return;
    }

    if (!user) {
      setError("You must be logged in to submit a complaint");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("priority", form.priority);
      formData.append("address", form.address);
      files.forEach((f) => formData.append("media", f));

      await API.post(`/complaints`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/user/complaints");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Report an Animal Issue</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below. Photos and videos help NGOs respond faster.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Injured dog near main road"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the situation in detail..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setForm({ ...form, priority: p.value })}
                    className={`text-xs py-1.5 px-2 rounded-lg border font-medium transition ${
                      form.priority === p.value
                        ? p.color + " ring-2 ring-offset-1 ring-current"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Near City Park, Hyderabad"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Photos / Videos
              <span className="ml-2 text-xs text-gray-400 font-normal">
                Up to 5 files · Max 50MB each
              </span>
            </label>

            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                dragOver
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
              }`}
            >
              <div className="text-3xl mb-2">📎</div>
              <p className="text-sm text-gray-600">
                Drag & drop files here or <span className="text-emerald-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{files.length}/5 files selected</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {previews.map((p, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                    {p.type.startsWith("video/") ? (
                      <video src={p.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs px-2 py-1 rounded-lg transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Uploading & Submitting...
              </span>
            ) : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;