const express = require('express');
const app = express();

const zod=require('zod')
const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

const PORT = process.env.PORT || 3000;
app.use(express.json())
const secretkey="Prk@123$#"

const jwt=require("jsonwebtoken");

function setUser(user){
    // const payload={
        
    //     ...user
    // }

    return jwt.sign(user,secretkey)
}

function getUser(token){
    if(!token){
        return null
    }
    return jwt.verify(token,secret)
    
}

app.post("/login",(req,resp)=>{

    const emailResponse=emailSchema.safeParse(req.headers.email)
    const passwordResponse = passwordSchema.safeParse(req.headers.password);
    console.log("--->",passwordResponse)
    if(!emailResponse.success&&!passwordResponse.success){
        return resp.status(403).json({
            message:"Please end the correct email and password of minimum length 6"
        })
    }else if(!emailResponse.success){
        return resp.status(403).json({
            message:"Please end the correct email "
        })
    }else if(!passwordResponse.success){
        return resp.status(403).json({
            message:"Please end the password of minimum length 6"
        })
    }
    const user={
        id:1,
        name:req.headers.username,
        email:req.headers.email,
        
    }
    jwt.sign({user},secretkey,{expiresIn:"300s"},(error,token)=>{
        resp.json(
            {
                token,...user
            })
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});