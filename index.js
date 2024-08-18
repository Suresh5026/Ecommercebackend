const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const  { connectMongoDb } = require("./Database/db");
const app = express();
connectMongoDb();


require('dotenv').config();
const PORT = process.env.PORT
const HOSTNAME = process.env.HOSTNAME

app.use(bodyParser.json());
app.use(cors({
    origin: 'https://unrivaled-granita-71b7e2.netlify.app', 
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

