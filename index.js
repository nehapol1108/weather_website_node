const http = require("http");
const fs = require("fs");
var requests = require("requests");
// const express = require("express");
// var app =express();
const homeFile = fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let tempa = tempVal.replace("{%tempval%}",orgVal.main.temp);
    tempa = tempa.replace("{%tempmax%}",orgVal.main.temp_max);
    tempa = tempa.replace("{%tempmin%}",orgVal.main.temp_min);
    tempa = tempa.replace("{%location%}",orgVal.name);
    tempa = tempa.replace("{%country%}",orgVal.sys.country);
    tempa = tempa.replace( "{%tempstatus%}",orgVal.weather[0].main);  
    return tempa;

}
// app.use(express.static("./home.html"));
const server = http.createServer((req,res)=>{
        if(req.url=="/"){
           requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=3316fd7879e2e511e9b94a67cd339104")
           .on("data",(chunk)=>{
               const objData = JSON.parse(chunk);
               const arrData = [objData];
            //    console.log(arrData[0].main.temp);
           const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");
        //    console.log(realTimeData);
           res.write(realTimeData);
           })
           .on("end",(err)=>{
               if(err) return console.log("connection closed dure to error" + err);
               res.end();
           });
        }
        else{
            res.end("file not found");
        }
})

server.listen(8000,"127.0.0.1",()=>{
    console.log("listening to server 8000")
});