const http=require("http")
const fs=require("fs")
const {parse}=require("querystring")
const crypto=require("crypto")
const {MongoClient}=require("mongodb")


let server=http.createServer((req,res)=>{
    if(req.method==="POST")
    {
       if(req.headers["content-type"]==="application/x-www-form-urlencoded"){
        //data
        let body=""
        req.on("data",(chunks)=>{
            // res.end(chunks)
            body+=chunks
        })
        //end
        req.on("end",async ()=>{
            // console.log(body);
            // res.end("Data is recieved in form of url encoded")

            // console.log(parse(body));
            // res.end("Data is recieved in form of url encoded")

            // res.end("Data is recieved in form of url encoded");
            // res.end(parse(body));//cany send object btw client and server it should be converted to json or the data should be in string format
            
            // let parsedBody=parse(body)
            // res.end(JSON.stringify(parsedBody))

             let parsedBody=parse(body)
             let password=parsedBody.password;


             let hashitPassword=crypto.createHmac('sha256',
            'secret').update(password).digest('hex')

            // console.log(hashitPassword);
            // res.end("password is hashed")
            // res.end(JSON.stringify(parsedBody))
            //without res.end it wont end because response is required from server

            let data={
                name:parsedBody.name,
                email:parsedBody.email,
                password:hashitPassword
            }
            // res.end(JSON.stringify(data))//password hashed

           let client=await MongoClient.connect("mongodb://127.0.0.1")

           await client.db("userDB").collection("user").insertOne(data)
           res.end("Successfully resgistred and data is stored into database ")
        })
    }
        else{
            res.end("data is not urlencoded")
        }
    
    }
    else
    {
        if(req.url==="/" || req.url==="/home")
    {
        res.writeHead(200,"Okay",{"content-type":"text/html"})
        const html=fs.readFileSync("./home.html","utf-8")
        res.end(html)
    }
    else if(req.url==="/css")
    {
        res.writeHead(200,"Okay",{"content-type":"text/css"})
        const css=fs.readFileSync("./style.css","utf-8")
        res.end(css) 
    }
    else if(req.url==="/contact")
    {
        res.writeHead(200,"Okay",{"content-type":"text/html"})
        const html=fs.readFileSync("./contact.html","utf-8")
        res.end(html) 
    }
    else if(req.url==="/aboutus")
    {
        res.writeHead(200,"Okay",{"content-type":"text/html"})
        const html=fs.readFileSync("./aboutus.html","utf-8")
        res.end(html) 
    }
    else if(req.url==="/SignUp")
    {
        res.writeHead(200,"Okay",{"content-type":"text/html"})
        const html=fs.readFileSync("./SignUp.html","utf-8")
        res.end(html) 
    }       
    else
    {
        res.writeHead(404,"Not found",{"content-type":"text/html"})
        const html=fs.readFileSync("./pnf.html","utf-8")
        res.end(html) 
    }
}
})


server.listen(5000,(err)=>{
   if(err) console.log(err);
   
   console.log("server is running");
   
})


