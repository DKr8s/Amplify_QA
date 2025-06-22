import React, { useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Question } from './models';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { uploadData } from '@aws-amplify/storage';

export default function NewQuestionWithImage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || text.length < 10) {
      alert('❗The question must be at least 10 characters long');
      return;
    }

    try {
      setUploading(true);
      let finalImageUrl = null;

      if (imageUrlInput?.trim()) {
        finalImageUrl = imageUrlInput.trim();
      } else if (file) {
        const filename = `${Date.now()}-${file.name}`;
        await uploadData({
          key: filename,
          data: file,
          options: {
            contentType: file.type,
            accessLevel: 'public',
          },
        }).result;

        // Tạo URL tĩnh
        const region = 'us-east-1';
        const bucket = 'questionanswerdemo6b8e2-staging';
        finalImageUrl = `https://${bucket}.s3.${region}.amazonaws.com/public/${filename}`;
      }
      console.log("✅ finalImageUrl được lưu vào DB:", finalImageUrl);

      await DataStore.save(
        new Question({
          Text: text,
          Author: user?.username || author || 'anonymous',
          imageUrl: finalImageUrl,
        })
      );

      alert('✅ The question has been saved!');
      resetForm();
    } catch (error) {
      console.error('❌ Error during upload:', error);
      alert('❌ An error occurred while saving the question');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
    setImageUrlInput('');
  };

  const handleImageUrlInput = (e) => {
    setImageUrlInput(e.target.value);
    setFile(null);
    setPreviewUrl(null);
  };

  const resetForm = () => {
    setText('');
    setAuthor('');
    setFile(null);
    setPreviewUrl(null);
    setImageUrlInput('');
  };

  const imagePreviewSrc = imageUrlInput || previewUrl;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'white',
        padding: '2rem',
        maxWidth: '600px',
        margin: '2rem auto',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        📥 <span style={{ fontWeight: 600 }}>Write your question here</span> 📥
      </h2>

      {!user && (
        <input
          type="text"
          placeholder="Author (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={inputStyle}
        />
      )}

      <textarea
        rows={5}
        placeholder="Enter your question (at least 10 characters)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={inputStyle}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={!!imageUrlInput}
        style={{ marginBottom: '0.5rem' }}
      />

      <input
        type="text"
        placeholder="Or paste image URL here"
        value={imageUrlInput}
        onChange={handleImageUrlInput}
        disabled={!!file}
        style={inputStyle}
      />

      {imagePreviewSrc && (
        <div className="w-full max-w-[500px] h-[300px] mx-auto mb-4 overflow-hidden rounded-lg border border-gray-300 bg-white shadow">
          <img
            src={imagePreviewSrc}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={resetForm}
          disabled={uploading}
          style={buttonStyleOutline}
        >
          Clear
        </button>

        <button
          type="submit"
          disabled={uploading}
          style={buttonStylePrimary}
        >
          {uploading ? 'Sending...' : 'Submit question'}
        </button>
      </div>
    </form>
  );
}

// 🔧 Reuse styles
const inputStyle = {
  width: '100%',
  marginBottom: '1rem',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const buttonStyleOutline = {
  padding: '10px 20px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: 'white',
  cursor: 'pointer',
};

const buttonStylePrimary = {
  padding: '10px 20px',
  backgroundColor: '#084DC5',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  marginLeft: '1rem',
};
