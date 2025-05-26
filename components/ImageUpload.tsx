import React, { useState } from 'react';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('modelName', 'YourModelName'); // Replace with your model name
    formData.append('action', 'uploadImage');
    formData.append('image', selectedImage);
console.log(formData);

    try {
      const response = await fetch('/api/global', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
      } else {
        alert('Image upload failed.');
      }
    } catch (error) {
      console.error(error);
      alert('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <p>Selected Image: {selectedImage.name}</p>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
