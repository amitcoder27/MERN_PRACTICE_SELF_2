import React, { useState, useEffect } from 'react';
import UpdateForm from '../Update/updateform';

function UserList() {
  const [users, setUsers] = useState([]); // State to store the fetched users
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to store any fetch errors
  const [selectedId,setSelectedId]=useState("")
  const[toedit,setToedit]=useState(false)


  const handleEdit = async (idToUpdate)=>{
    setSelectedId(idToUpdate)
    setToedit(true)
    }
const handleDelete = async (idToDelete) => { // Renamed parameter to avoid confusion with `id` in body
  console.log('Attempting to delete user with ID in body:', idToDelete);

  try {
    const response = await fetch('http://localhost:4000/delete', { // <--- NEW URL
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', // <-- IMPORTANT: Required when sending a body
      },
      body: JSON.stringify({ id: idToDelete }), // <--- Send the ID inside an object in the body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'No JSON error message provided.' }));
      throw new Error(errorData.message || 'Something went wrong with the deletion.');
    }

    const result = await response.json();
    console.log('Deletion successful:', result.message, result.user);
  
    // Update your frontend state here to remove the deleted user
    setUsers(prevUsers => prevUsers.filter(user => user._id !== idToDelete));

  } catch (error) {
    console.error('Error during deletion:', error.message);
    // Handle errors in UI
  }
};
  useEffect(() => {
    // This function will be called when the component mounts
    const fetchUsers = async () => {
      try {
        // Updated API endpoint to match the new structure: /api/users
        const response = await fetch('http://localhost:4000/');

        if (!response.ok) {
          // If the response is not OK (e.g., 404, 500), throw an error
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users.');
        }

        const data = await response.json(); // Parse the JSON response
        setUsers(data); // Update the state with the fetched users
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message); // Set the error state
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete (success or error)
      }
    };

    fetchUsers(); // Call the fetch function when the component mounts
  }, []); // The empty dependency array [] ensures this effect runs only once after the initial render

  if (loading) {
    return <div className="text-center p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

 return (
  <div className="container mx-auto p-4">
    <h2 className="text-2xl font-bold mb-4">Registered Users</h2>

    {users.length === 0 ? (
      <p className="text-gray-600">No users found. Register one first!</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
         {users.map(user => (
  <tr key={user.id} className="hover:bg-gray-100">
    <td className="py-2 px-4 border-b">{user.name}</td>
    <td className="py-2 px-4 border-b">{user.email}</td>
    <td className="py-2 px-4 border-b">{user.phone}</td>
    <td className="py-2 px-4 border-b">
      <button
      style={{color:"grey", cursor:"pointer"}}
        onClick={() => handleEdit(user._id)}
      >
        Edit
      </button>
    </td>
    <td className="py-2 px-4 border-b">
      <button
          style={{color:"red",cursor:"pointer"}}
        onClick={() => handleDelete(user._id)}
      >
        Delete
      </button>
    </td>
  </tr>
))}

          </tbody>
        </table>
        {toedit && <UpdateForm setForm={setToedit} idToupdate={selectedId}/>}
      </div>
    )}
   

  </div>
);

}

export default UserList;