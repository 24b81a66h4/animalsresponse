import { useState } from 'react';
import CategorySelect from './CategorySelect';
import MediaUpload from './MediaUpload';
import { createComplaint } from '../../services/complaint.api';

function ComplaintForm() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'Injury',
        priority: 'Medium'
    });

    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createComplaint(form);
            alert('Complaint submitted');
        } catch (err) {
            alert('Error submitting complaint');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">

            <input
                placeholder="Title"
                className="border p-2 w-full rounded"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
                placeholder="Description"
                className="border p-2 w-full rounded"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <CategorySelect
                value={form.category}
                onChange={(val) => setForm({ ...form, category: val })}
            />

            <select
                className="border p-2 w-full rounded"
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <MediaUpload onFileSelect={setFile} />

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Submit Complaint
            </button>

        </form>
    );
}

export default ComplaintForm;