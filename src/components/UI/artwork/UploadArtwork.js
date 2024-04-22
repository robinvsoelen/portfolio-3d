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
    const [hasUploaded, setHasUploaded] = useState(false);

    const [loading, setLoading] = useState(false);

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); 
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

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
        
                const storage = getStorage();
                const storageRef = ref(storage, `drawings/${fileName}`);
        
                return uploadBytes(storageRef, blob);
            })
            .then((snapshot) => {
                return getDownloadURL(snapshot.ref); 
            })
            .then((url) => {
                const db = getFirestore();
                return addDoc(collection(db, "artworks"), { 
                    imageUrl: url,
                    artist: artist,
                    title: title,
                    email: email,
                    upvotes: 0,
                    date: new Date()
                });
            })
            .then(() => {
                resetCanvas(); 
                setArtist('');
                setHasUploaded(true);
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
            <input type="text" maxLength="50" value={artist} onChange={handleArtistChange} placeholder="Artist Name" disabled={loading} />
            <input type="text" maxLength="30" value={title} onChange={handleTitleChange} placeholder="Artwork title" disabled={loading} />
            <span style={{fontSize: 12, marginLeft: 10, textAlign: 'left'}}><input type="checkbox" checked={emailConsent} onChange={handleEmailConsent} disabled={loading} /> I want to receive an email whenever Robin feels he has something to say (which won't be that often) </span>
            
            {emailConsent && <input type="text" value={email} onChange={handleEmailChange} placeholder="Email" disabled={loading} />}
            <button onClick={uploadImage} disabled={loading || hasUploaded}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {hasUploaded && <h1>Your art has been uploaded!</h1>}
        </div>
    );
};

export default UploadArtwork;