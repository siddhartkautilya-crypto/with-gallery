const express=require("express");
const fs=require("fs");
const path=require("path");

const app=express();
app.use(express.json({limit:"50mb"}));
app.use(express.static("public"));

const uploadDir=path.join(__dirname,"uploads");

app.post("/upload",(req,res)=>{
 const {image,index}=req.body;
 const data=image.replace(/^data:image\/png;base64,/,"");
 const filename="photo_"+Date.now()+"_"+index+".png";
 fs.writeFileSync(path.join(uploadDir,filename),data,"base64");
 res.json({status:"ok"});
});

app.use("/photos",express.static(uploadDir));

// ===== GALLERY ROUTE =====
app.get("/gallery",(req,res)=>{
 const files=fs.readdirSync(uploadDir);
 let html = `
 <!DOCTYPE html>
 <html>
 <head>
 <title>Gallery</title>
 <link rel="stylesheet" href="/gallery.css">
 </head>
 <body>
 <h1>Uploaded Photos</h1>
 <div class="gallery">
 `;
 files.forEach(f=>{
   html += `<img src="/photos/${f}">`;
 });
 html += `</div></body></html>`;
 res.send(html);
});

app.listen(3000,()=>console.log("Running on http://localhost:3000"));
