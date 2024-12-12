const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const env = require('dotenv');
env.config()
const port = process.env.PORT;


app.use(express.json())


const db = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_STRING);
        console.log("database connection established");
        
    } catch (error) {
        console.log("error connecting to database");
        
    }
}

db()


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema)



app.get('/', (req, res) => {
    res.send('Homepage');
})

app.post('/signup', async (req,res)=>{
    try {
        const {userName,email,password} =req.body;

        const existingUser = await User.findOne({email:email});

        if(existingUser){
            return res.status(400).json({msg: 'Email already exists kindly login'});
        }

    const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            userName: userName,
            email: email,
            password: hashPassword
        })
        
        await newUser.save();
        return res.status(200).json({msg:"User saved successfully"})

    } catch (error) {
        return res.status(500).json({msg: "internal server error"})
    }
})



app.post('/login',async (req, res)=>{
    try {
        const {email,password} =req.body;

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(400).json({msg: 'Invalid email credentials'})
        }           
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({msg: 'Invalid password credentials'})
        }
        const dataInfo = {
            email: user.email,
            password: user.password
        }
        return res.status(200).json({msg: 'Logged in successfully', dataInfo})
    } catch (error) {
        return res.status(500).json({msg:"internal server error"})
    }
})

app.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`);
})

/*

The laptop4dev project is an initiative that gives laptops to 
people learning new tech skills.
 It’s that time of the year to give new laptops to people. it consists of:

Endpoint to accept data of interested applicants (Data to take are first name, 
last name, email address,
 phone no, why you need the laptop)

Endpoint to view all applicants data

Endpoint to know total number of applicants
*/