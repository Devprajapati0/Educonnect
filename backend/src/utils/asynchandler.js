const asynhandler = (request)=>{
    return (req,res,next)=>{
        Promise.resolve(request(req,res,next)).catch((err) => next(err))
    }
}

export  {asynhandler}