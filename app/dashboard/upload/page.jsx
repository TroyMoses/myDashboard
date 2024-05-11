'use client'

import React, { useState } from 'react';
import upload from '../../lib/multer'; // Import Multer configuration

const ImageUploadForm = () => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', selectedFile);

      await upload.single('image')(req, res, async (err) => {
        if (err) {
          console.error(err);
          // Handle upload error (e.g., display an error message)
          return;
        }

        const { filename } = req.file; // Get filename from Multer
        const imageUrl = `/uploads/${filename}`; // Construct image URL path

        const newImage = new Image({ title, imageUrl });
        await newImage.save();

        console.log('Image uploaded successfully!');
        // Handle successful upload (e.g., show a success message, clear form)
        setTitle('');
        setSelectedFile(null);
      });
    } catch (error) {
      console.error(error);
      // Handle general errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <br />
      <label htmlFor="image">Image:</label>
      <input type="file" id="image" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <br />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ImageUploadForm;
