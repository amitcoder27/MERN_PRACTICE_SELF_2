import React, { useEffect, useState } from 'react';

const UpdateForm = ({idToupdate,setForm}) => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  console.log(data);
  
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  useEffect(()=>{
        const fetchUsers = async () => {
      try {
        // Updated API endpoint to match the new structure: /api/users
        const response = await fetch(`http://localhost:4000/find/${idToupdate}`);

        if (!response.ok) {
          // If the response is not OK (e.g., 404, 500), throw an error
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users.');
        }

        const data = await response.json(); // Parse the JSON response
        setData(data); // Update the state with the fetched users
      } catch (err) {
        console.error('Error fetching users:', err);
      
      } 
    };

    fetchUsers();
  },[idToupdate])

const handleSubmit = async () => { // Make the function async
  console.log('Update user:', data);

  try {
    const response = await fetch(`http://localhost:4000/update/${idToupdate}`, { // Replace /register with your actual API endpoint
      method: 'PUT', // Or 'GET', 'PUT', 'DELETE' depending on your API
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers like authorization tokens if needed
      },
      body: JSON.stringify(data), // Send your data as JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong with the Updatation.');
    }

    const result = await response.json();
    console.log('Updation successful:', result);
    setForm(false)
    // Handle successful registration, e.g., show a success message, redirect, etc.

  } catch (error) {
    console.error('Error during Updation:', error.message);
    // Handle errors, e.g., show an error message to the user
  }
};

  return (
    <div style={{background:"lightgrey",position:"absolute",top:"30%",left:"25%", width:"50%",height:"300px", borderRadius:"12px" }}>
      <input
      style={{marginTop:"50px"}}
        name="name"
        placeholder="Username"
        type="text"
        value={data.name}
        onChange={handleChange}
      /><br/>
      
      <input
        name="email"
        placeholder="Email"
        type="text"
        value={data.email}
        onChange={handleChange}
      /><br/>

      <input
        name="password"
        placeholder="Password"
        type="number"
        value={data.password}
        onChange={handleChange}
      /><br/>

      <input
        name="phone"
        placeholder="Phone"
        type="text"
        value={data.phone}
        onChange={handleChange}
      /><br/>

      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default UpdateForm;
