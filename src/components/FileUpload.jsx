// src/components/FileInput.jsx
import React from 'react';
import axios from 'axios';

const FileUpload = () => {
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('Yourfiles', file); // Must match `req.files.Yourfiles`

        try {
            const res = await axios.post('http://localhost:4000/api/v1/forms/fileUpload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                console.log('Upload Success:', res.data.imageUrl);
                onUploadSuccess?.(res.data.imageUrl); // Optional callback
            } else {
                console.error('Upload Error:', res.data.message);
            }
        } catch (error) {
            console.error('Upload Failed:', error);
        }
    };

    return (
        <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
        />
    );
};

export default FileUpload;
