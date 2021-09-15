const { PDFDocument } = require('pdf-lib');
const doc = PDFDocument.create();
console.log(doc);
let body = document.querySelector("body");
let viewer=null;
var thePdf = null;

console.log("s");
let sl=document.querySelector(".signed");
function clearPage(){
  dropArea.innerHTML = null;
  dropArea.innerHTML = `<div class="area"></div>`;
  return(dropArea);
}

function renderHtml(){
  let mainElement=document.createElement('div');
  mainElement.setAttribute('class','mainElement');
  mainElement.innerHTML=`
  <div class="subElement">
  </div>
  <footer>
  <button id="nextbtn" onclick="openModal();">ADD SIGN</button>
  </footer>
    `
  return(mainElement);
}

function addImage(){
  let modalbg=document.querySelector('.modal-bg');
  modalbg.classList.remove('bg-active');
  let imageData=document.querySelector('.signature-pad').toDataURL("image/png",1.0);
  let image=new Image;
  image.onload=function(){
    sub=document.querySelector(".subElement");
    sub.innerHTML=`<div class="signed"></div><button class="download" onclick="download();">Download</button>
    `;
    let sign=document.querySelector(".signed");
    sign.setAttribute('src',image.src);
    console.log("image Loaded");
    sign.innerHTML=`<img id="imgsrc" src=${image.src} ></img>`;
  

    interact('.signed')
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },
  
      listeners: {
        move (event) {
          var target = event.target
          var x = (parseFloat(target.getAttribute('data-x')) || 0)
          var y = (parseFloat(target.getAttribute('data-y')) || 0)
  
          // update the element's style
          target.style.width = event.rect.width + 'px'
          target.style.height = event.rect.height + 'px'
  
          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top
  
          target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
  
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
          
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),
  
        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 }
        })
      ],
  
      inertia: true
    })
    .draggable({onmove: dragMoveListener})
        function dragMoveListener (event) {
          var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          // translate the element
          target.style.webkitTransform = target.style.transform
                                      = 'translate(' + x + 'px, ' + y + 'px)';
          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
}
  }
  image.src=imageData;
 
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

return imageData;
}

function modal(){
  
  document.querySelector(".area").innerHTML=`
  <div class="modal-bg">
    <div class="modal">
        <div class="wrapper ml-2">
            <canvas id="signature-pad" class="signature-pad" width='400' height='300'></canvas>
        </div>
        <button class="modal-close" onclick="closeModal();">X</button>
    </div>
    <button class="addbtn" onclick="addImage();">ADD</button>
</div>
  `
  var signaturePad=  document.getElementById('signature-pad');

  function resizeCanvas() {

      var ratio =  Math.max(window.devicePixelRatio || 1, 1);
      signaturePad.width = signaturePad.offsetWidth * ratio;
      signaturePad.height = signaturePad.offsetHeight * ratio;
      
  }
  
  window.onresize = resizeCanvas;
  resizeCanvas();
  
  var signaturePad = new SignaturePad(signaturePad, {
    backgroundColor: 'rgb(255,255,255)'
  });


}

function openModal(){
  modal();
  let modalbg=document.querySelector('.modal-bg');
  modalbg.classList.add('bg-active');
}


function closeModal(){
  let modalbg=document.querySelector('.modal-bg');
  modalbg.classList.remove('bg-active');
}


function download()
{
  imageData=document.querySelector('.signature-pad').toDataURL("image/png",1.0);

    ca=document.querySelector(".pdf-page-canvas");
   

    canvasd=ca.toDataURL('image/jpeg');



    console.log(canvasd);
    var b64encoded = btoa(Uint8ToString(pdfData));
    console.log(b64encoded);
    var pdf = new jsPDF('p', 'pt', 'a4');
		pdf.addImage(canvasd, 'JPEG', 0, 0);

    pdf.save('test.pdf');

}

function Uint8ToString(u8a){
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
  }
  return c.join("");
}
// Usage


function renderPage(pageNumber, canvas) {
  thePdf.getPage(pageNumber).then(function(page) {
  console.log("page Loaded");

  var desiredWidth = 500;
  var viewport = page.getViewport({ scale: 1, });
  var scale = desiredWidth / viewport.width;
  var scaledViewport = page.getViewport({ scale: scale, });
  console.log(scaledViewport);
  canvas.height = scaledViewport.height;
  canvas.width = scaledViewport.width;
  canvas.button=scaledViewport.button;

  var canvasContext = canvas.getContext('2d');
  var renderContext = {
    canvasContext: canvasContext,
    viewport: scaledViewport
  };         
  page.render(renderContext).promise.then(function(){
  return console.log('Page rendered');
});
});
}


function renderAll(data){
  clearPage();
    
  body.appendChild(renderHtml());
    let pdfjs = window['pdfjs-dist/build/pdf'];
    pdfjs.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    pdfjs.getDocument({data:data}).promise.then(function(pdf) {     
    thePdf = pdf;
    mainel=document.querySelector(".mainElement");
    let viewer = document.createElement('div');
    viewer.className='viewer';
    mainel.appendChild(viewer);
    sl=document.querySelector(".mainElement").src;
    console.log(sl);
    //sl.appendChild(viewer);
    for(page = 1; page <= pdf.numPages; page++) {
      console.log(pdf.numPages);
      let canvas = document.createElement("canvas");
      canvas.className = 'pdf-page-canvas';    
      viewer.appendChild(canvas); 
      renderPage(page, canvas);
    }
  });
}







{
dropArea = document.querySelector(".drag-area");
dragText = dropArea.querySelector(".dragText");
button = dropArea.querySelector("button");
input = dropArea.querySelector("input");
button.onclick = () => {
    input.click();
}

input.addEventListener("change", function(){
    file = this.files[0];
    dropArea.classList.add("active");

});


dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File"
});


dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File"
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    var pdfjs = window['pdfjs-dist/build/pdf'];
    pdfjs.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    pdfjs.disableWorker = true;
    file = event.dataTransfer.files[0];
		var fileReader = new FileReader();  
    fileReader.readAsArrayBuffer(file);
		fileReader.onload = (e)=>
    {	pdfData = new Uint8Array(e.target.result);
      console.log(pdfData);
      renderAll(pdfData)};

})}