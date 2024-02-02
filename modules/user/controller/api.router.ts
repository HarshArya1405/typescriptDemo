import express from 'express';
const apiRouter :express.Router = express.Router();

apiRouter.get('/',(req,res)=>{
    let data:object={
        name:'harsh',
        age:20
    }
    res.send(data)
})

export default apiRouter