import React, { useState } from 'react';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async () => { // Make the function async
  console.log('Registering user:', data);

  try {
    const response = await fetch('http://localhost:4000/register', { // Replace /register with your actual API endpoint
      method: 'POST', // Or 'GET', 'PUT', 'DELETE' depending on your API
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers like authorization tokens if needed
      },
      body: JSON.stringify(data), // Send your data as JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong with the registration.');
    }

    const result = await response.json();
    console.log('Registration successful:', result);
    // Handle successful registration, e.g., show a success message, redirect, etc.

  } catch (error) {
    console.error('Error during registration:', error.message);
    // Handle errors, e.g., show an error message to the user
  }
};

  return (
    <div>
      <input
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

      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default Register;
