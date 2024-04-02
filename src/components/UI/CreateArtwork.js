import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const CreateArtwork = () => {
  const [file, setFile] = useState(null);
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleArtistChange = (e) => {
    setArtist(e.target.value);
  };

  const uploadImage = async () => {
    if (!file || !artist) {
      alert("File and artist name are required");
      return;
    }

    setLoading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    // Now save the metadata in Firestore
    const db = getFirestore();
    await addDoc(collection(db, "artworks"), {
      imageUrl: url,
      artist: artist,
      date: new Date() // This stores the current date/time
    });

    setLoading(false);
    alert("Artwork uploaded successfully!");
    // Reset fields
    setFile(null);
    setArtist('');
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={loading} />
      <input type="text" value={artist} onChange={handleArtistChange} placeholder="Artist Name" disabled={loading} />
      <button onClick={uploadImage} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default CreateArtwork;