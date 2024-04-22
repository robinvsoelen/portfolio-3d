import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getFirestore, query, collection, orderBy, limit, startAfter, getDocs, doc, updateDoc } from 'firebase/firestore';
import './artwork.css';
import { getAuth, signInAnonymously } from "firebase/auth";

const ShowArtwork = () => {
    const [artworks, setArtworks] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialFetchDone, setInitialFetchDone] = useState(false); // New flag to track initial fetch
    const [sort, setSort] = useState('date');
    const [hasMore, setHasMore] = useState(true);
  
    const db = getFirestore();
  
    const fetchArtworks = useCallback(async () => {
        if (!hasMore || loading || initialFetchDone) return;
        setLoading(true);
      
        let q = query(collection(db, "artworks"), orderBy(sort === 'date' ? "date" : "upvotes", "desc"), limit(10));
      
        if (lastVisible) {
          q = query(q, startAfter(lastVisible));
        }
      
        const querySnapshot = await getDocs(q);
        const newArtworks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
        // Filter out artworks that are already present
        const filteredArtworks = newArtworks.filter(newArtwork => 
          !artworks.some(existingArtwork => existingArtwork.id === newArtwork.id)
        );
      
        if (filteredArtworks.length < 10) {
          setHasMore(false); // Assuming no more artworks to fetch if the latest fetch is less than the limit
        }
      
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setArtworks(prevState => {
            const combinedArtworks = [...prevState, ...filteredArtworks];
            // Create a new Map to filter out duplicates, preserving the order
            const uniqueArtworksMap = new Map(combinedArtworks.map(artwork => [artwork.id, artwork]));
            // Convert the Map back to an array
            return Array.from(uniqueArtworksMap.values());
          });
                  setLoading(false);
        setInitialFetchDone(true);
      }, [db, lastVisible, sort, loading, hasMore, initialFetchDone, artworks]);

    // Initial fetch
    useEffect(() => {
      fetchArtworks();

    }, [fetchArtworks]);
  
    // Observe when to load more artworks
    useEffect(() => {
      if (!hasMore || loading) return;
  
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            fetchArtworks();
          }
        },
        { threshold: 0.1 }
      );
  
      // Assuming you have a way to uniquely select the last item
      const lastElement = document.querySelector('.artworkItem:last-child');
      if (lastElement) 
      {
        observer.observe(lastElement);
      }
  
      return () => observer.disconnect();
    }, [loading, hasMore, fetchArtworks]);
  
    const handleSortChange = (e) => {
      setSort(e.target.value);
      setArtworks([]);
      setLastVisible(null);
      setHasMore(true);
      setInitialFetchDone(false); // Reset for a new initial fetch after sort change
    };

    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };
    

    const upvoteArtwork = async (id, currentUpvotes) => {
        const auth = getAuth();
      
        // Ensure the user is signed in anonymously; if not, sign them in.
        if (!auth.currentUser) {
          try {
            await signInAnonymously(auth);
            console.log("User signed in anonymously");
          } catch (error) {
            console.error("Anonymous sign-in failed", error);
            alert("You must be signed in to upvote.");
            return;
          }
        }
        
        const db = getFirestore();
        const artworkRef = doc(db, "artworks", id);
        let updatedUpvotes = currentUpvotes;
        const upvotedKey = `upvoted-${id}`;
        const hasUpvoted = localStorage.getItem(upvotedKey) === 'true';
      
        try {
          if (hasUpvoted) {
            // If previously upvoted, decrement the upvote count
            updatedUpvotes -= 1;
            localStorage.removeItem(upvotedKey); // Remove the item to undo the upvote
          } else {
            // If not previously upvoted, increment the upvote count
            updatedUpvotes += 1;
            localStorage.setItem(upvotedKey, 'true'); // Mark as upvoted
          }
      
          // Update Firestore
          await updateDoc(artworkRef, {
            upvotes: updatedUpvotes
          });
      
          // Update local state to reflect the new upvote count
          setArtworks(artworks.map(artwork => {
            if (artwork.id === id) {
              return { ...artwork, upvotes: updatedUpvotes };
            }
            return artwork;
          }));
        } catch (error) {
          console.error("Error toggling upvote on artwork: ", error);
          alert("There was a problem toggling the upvote on the artwork.");
        }
      };
      

  return (
    <div className='galleryContainer'>
      <select style={{margin:'20px'}} value={sort} onChange={handleSortChange}>
        <option value="date">Sort by Date</option>
        <option value="upvotes">Sort by Upvotes</option>
      </select>
      <div className='artworkShowContainer'>
        {artworks.map((artwork, index) => (
          <div className='artworkItem' key={artwork.id}>
            <img className='artImage' src={artwork.imageUrl} alt={truncateText(artwork.title, 50)} />
            <h2>{truncateText(artwork.title, 50)}</h2> 
            <p style={{marginTop:'-10px'}}><i>Artist: <b>{truncateText(artwork.artist, 30)}</b></i></p>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
            {localStorage.getItem(`upvoted-${artwork.id}`) ? 
                <img src='assets/img/upvoted.svg' alt="Upvoted" className='upvoteButton' onClick={() => upvoteArtwork(artwork.id, artwork.upvotes)} /> :
                <img src='assets/img/upvote.svg' alt="Upvote" className='upvoteButton' onClick={() => upvoteArtwork(artwork.id, artwork.upvotes)} />
            }
            <span style={{ marginLeft: '10px' }}>+{artwork.upvotes}</span>
            </div>
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default ShowArtwork;
