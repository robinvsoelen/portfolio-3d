import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from "firebase/auth";
import React, { useRef, useEffect, useState } from 'react';

const UploadArtwork = ({canvasRef}) => {
    const [file, setFile] = useState(null);
    const [artist, setArtist] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [emailConsent, setEmailConsent] = useState(false)
    
    const [loading, setLoading] = useState(false);

    const handleArtistChange = (e) => {
        setArtist(e.target.value);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailConsent = (e) => {
        setEmailConsent(e.target.checked);
    };

    const uploadImage = async () => {
        if (!artist) {
            alert("File and artist name are required");
            return;
        }

        if (!canvasRef.current) 
        {
            console.log("no canvasref")
            return;
        }

        const auth = getAuth();
        signInAnonymously(auth)
            .then(() => {
                console.log("Signed in");
                setLoading(true);
                const dataUrl = canvasRef.current.toDataURL("image/png");
                return fetch(dataUrl);
            })
            .then((fetchRes) => {
                return fetchRes.blob();
            })
            .then((blob) => {
                const fileName = `drawing_${new Date().toISOString()}.png`;
        
                // Get a reference to the location where you want to upload the drawing in Firebase Storage
                const storage = getStorage();
                const storageRef = ref(storage, `drawings/${fileName}`);
        
                // Upload the drawing
                return uploadBytes(storageRef, blob);
            })
            .then((snapshot) => {
                console.log(snapshot)
                return getDownloadURL(snapshot.ref); // Return the promise to chain it
            })
            .then((url) => {
                console.log(url)
                const db = getFirestore();
                return addDoc(collection(db, "artworks"), { // Return the promise to chain it
                    imageUrl: url,
                    artist: artist,
                    title: title,
                    email: email,
                    upvotes: 0,
                    date: new Date()
                });
            })
            .then(() => {
                alert("Artwork uploaded successfully!");
                setFile(null);
                setArtist('');
            })
            .catch((error) => {
                console.error("Something went wrong:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="uploadArtworkContainer">
            <input type="text" value={artist} onChange={handleArtistChange} placeholder="Artist Name" disabled={loading} />
            <input type="text" value={title} onChange={handleTitleChange} placeholder="Artwork title" disabled={loading} />
            <span style={{fontSize: 12, marginLeft: 10, textAlign: 'left'}}><input type="checkbox" checked={emailConsent} onChange={handleEmailConsent} disabled={loading} /> I want to receive an email whenever Robin feels he has something to say (won't be that often) </span>
            
            {emailConsent && <input type="text" value={email} onChange={handleEmailChange} placeholder="Email" disabled={loading} />}
            <button onClick={uploadImage} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default UploadArtwork;