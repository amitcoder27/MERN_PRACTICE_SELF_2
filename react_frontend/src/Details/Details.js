import React, { useEffect, useState } from 'react'; // Assuming React component
import { useNavigate } from 'react-router-dom';


function Details() {
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate()

   

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true); // Set loading state
                setError(null); // Clear any previous errors

                  const response = await fetch('http://localhost:4000/details', {
                    method: 'GET',
                    credentials: 'include', // THIS sends cookies (including httpOnly ones)
                    });

            
                console.log(response,"response");
                

                if (!response.ok) { // Check for HTTP errors (e.g., 401, 404, 500)
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json(); // Parse the JSON response
                console.log('User details:', data);
                setDetails(data); // Set the fetched data to state

            } catch (err) {
                console.error('Failed to fetch user details:', err);
                    
                  
                setError(err.message); // Set error state
                setDetails(null); // Clear details on error
            } finally {
                setLoading(false); // Always set loading to false when done
            }
        };

        fetchDetails();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <div>Loading details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!details) {
        return <div>No details available.</div>; // Or a message indicating not logged in
    }

    return (
        <div>
            <h2>User Details</h2>
            {/* Render your details here, e.g. */}
            <p>Name:{details?.user?.name}</p>
             <p>Email:{details?.user?.email}</p>
              <p>Phone:{details?.user?.phone}</p>
        </div>
    );
}

export default Details;