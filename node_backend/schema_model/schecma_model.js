const mongoose=require('mongoose')
const demo_schema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
         type:String,
        require:true

    },
    password:{
         type:String,
        require:true

    },
    phone:{
         type:String,
        require:true

    },



})

//model

const User_model= new mongoose.model("Mern_Demo",demo_schema)
module.exports=User_model