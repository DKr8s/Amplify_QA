import React, { useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Question } from './models';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { uploadData, getUrl } from '@aws-amplify/storage';

export default function NewQuestionWithImage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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

        const result = await getUrl({
          key: filename,
          options: { accessLevel: 'public' },
        });

        finalImageUrl = result.url?.href || result.url || null;
        setImageUrl(finalImageUrl);
      }

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
    setImageUrlInput(''); // reset image URL if uploading file
  };

  const handleImageUrlInput = (e) => {
    setImageUrlInput(e.target.value);
    setFile(null); // reset file input if using URL
    setPreviewUrl(null);
  };

  const resetForm = () => {
    setText('');
    setAuthor('');
    setFile(null);
    setPreviewUrl(null);
    setImageUrlInput('');
    setImageUrl('');
  };

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
          style={{
            width: '100%',
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
      )}

      <textarea
        rows={5}
        placeholder="Enter your question (at least 10 characters)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%',
          marginBottom: '1rem',
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '1rem',
        }}
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
        style={{
          width: '100%',
          marginBottom: '1rem',
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '1rem',
        }}
      />

      {(previewUrl || imageUrlInput) && (
        <img
          src={imageUrlInput || previewUrl}
          alt="Preview"
          style={{
            maxWidth: '100%',
            maxHeight: '300px',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #eee',
          }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={resetForm}
          disabled={uploading}
          style={{
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#084DC5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginLeft: '1rem',
          }}
        >
          {uploading ? 'Sending...' : 'Submit question'}
        </button>
      </div>
    </form>
  );
}
