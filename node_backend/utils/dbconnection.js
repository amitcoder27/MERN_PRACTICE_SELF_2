const mongoose=require('mongoose')

// const URL =mongosh "mongodb+srv://cluster0.aqdd1ex.mongodb.net/" --apiVersion 1 --username amitcoder27 --password xXDCGiZlqC05q0ty


// mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority


// db.js




const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://amitcoder27:xXDCGiZlqC05q0ty@cluster0.aqdd1ex.mongodb.net/myAppDB?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully --->>>');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

