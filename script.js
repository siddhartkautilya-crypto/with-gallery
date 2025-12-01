const video=document.getElementById("camera");
const startBtn=document.getElementById("startBtn");
const countdownEl=document.getElementById("countdown");
const downloadZip=document.getElementById("downloadZip");
let photos=[];

async function startCamera(){
 const stream=await navigator.mediaDevices.getUserMedia({video:true});
 video.srcObject=stream;
}

function countdown(n){
 return new Promise(res=>{
  countdownEl.textContent=n;
  let x=setInterval(()=>{
   n--; countdownEl.textContent=n;
   if(n===0){ clearInterval(x); countdownEl.textContent=""; res(); }
  },1000);
 });
}

function takePhoto(){
 const c=document.createElement("canvas");
 c.width=video.videoWidth;
 c.height=video.videoHeight;
 c.getContext("2d").drawImage(video,0,0);
 return c.toDataURL("image/png");
}

async function uploadPhoto(img,i){
 await fetch("/upload",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({image:img,index:i})
 });
}

async function startSession(){
 startBtn.style.display="none";
 photos=[];
 for(let i=0;i<5;i++){
  await countdown(3);
  let p=takePhoto();
  photos.push(p);
  await uploadPhoto(p,i);
 }
 makeZip();
}

function makeZip(){
 let zip=new JSZip();
 photos.forEach((img,i)=> zip.file("photo_"+(i+1)+".png", img.split(",")[1], {base64:true}) );
 zip.generateAsync({type:"blob"}).then(out=>{
  let url=URL.createObjectURL(out);
  downloadZip.href=url;
  downloadZip.download="photos.zip";
  downloadZip.style.display="block";
 });
}

startCamera();
startBtn.onclick=startSession;
