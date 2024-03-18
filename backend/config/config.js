const mongoose = require('mongoose')
// mongoose.connect(process.env.MONGODB_CONNECTION)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));