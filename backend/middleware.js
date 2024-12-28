require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];
    
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        } else{
            
            return res.status(403).json({});
        }
        
    } catch(err){
        console.log(err.message);
        return res.status(403).json({message:"Error in middleware"});
    }
}

module.exports = {
    authMiddleware
}