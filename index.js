const express = require("express");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.MONGODB_URL) ;

app.use(express.json());

app.get("/healthy", (req, res)=> res.send("I am Healthy"));

//  start writing your routes here
const userRoutes = require('./routes/user');
const todoRoutes = require('./routes/todo');

app.use('/api/user', userRoutes);   
app.use('/api/todo', todoRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.listen(port, ()=> console.log(`server is running at http://localhost:${port}`));

