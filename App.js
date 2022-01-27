const express = require('express');
const PORT=8999;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))

const {connectDB} =require('./config/db')
connectDB()
// app.use(cors())
//load routes
const allRoutes= require('./routes/emproutes');
app.use("/api",allRoutes)

app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log("work on 8999")
}) 
