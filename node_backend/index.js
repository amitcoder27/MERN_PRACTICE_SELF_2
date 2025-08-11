const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const apiRoutes = require('./route');
// Allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // if you're using cookies
}));
app.use(express.json())

// mongodb connection 
const connectDB = require('./utils/dbconnection'); // Make sure path is correct
connectDB();

// 

app.use('/', apiRoutes);

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
