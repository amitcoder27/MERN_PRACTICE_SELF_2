import React, { useState } from 'react';

const Login = () => {
  const [data, setData] = useState({email: '',password: '',});

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async () => { // Make the function async
  console.log('Login user:', data);

  try {
    const response = await fetch('http://localhost:4000/login', { // Replace /register with your actual API endpoint
      method: 'POST', // Or 'GET', 'PUT', 'DELETE' depending on your API
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers like authorization tokens if needed
      },
      body: JSON.stringify(data), // Send your data as JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong with the login.');
    }

    const result = await response.json();
    console.log('Login successful:', result);
    // Handle successful registration, e.g., show a success message, redirect, etc.

  } catch (error) {
    console.error('Error during login:', error.message);
    // Handle errors, e.g., show an error message to the user
  }
};

  return (
    <div>
    
      
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

   

      <button onClick={handleSubmit}>Login</button>
    </div>
  );
};

export default Login;
