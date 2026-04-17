import { useState } from 'react';

function MediaUpload({ onFileSelect }) {
    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
    };

    return (
        <div>
            <input type="file" accept="image/*,video/*" onChange={handleFile} />

            {preview && (
                <div className="mt-2">
                    <img
                        src={preview}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded"
                    />
                </div>
            )}
        </div>
    );
}

export default MediaUpload;