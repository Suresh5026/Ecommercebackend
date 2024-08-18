const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
require('dotenv').config();
const  { connectMongoDb } = require("./Database/db");

const PORT = process.env.PORT
const HOSTNAME = process.env.HOSTNAME

const app = express();
connectMongoDb();
app.use(bodyParser.json());

app.use(cors({
    origin: 'https://ubiquitous-mousse-e69a4f.netlify.app', 
    credentials: true
}))
app.use('/user',require('./Model/userController'));
app.use('/product',require('./Model/productController'));
app.use('/payment',require('./Model/paymentController'));

app.get("/",(req,res)=>{
    res.send("Server running success!!!")
});


app.listen(PORT,HOSTNAME,()=>{
    console.log(`Server is running PORT : ${PORT}`);
    
})

