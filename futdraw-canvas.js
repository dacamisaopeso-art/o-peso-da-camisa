/* Tela fixa para todos: o preenchimento fechado é reproduzido pixel a pixel. */
(function(root){
 'use strict';
 function flood(data,width,height,x,y,color){x=Math.max(0,Math.min(width-1,Math.floor(x)));y=Math.max(0,Math.min(height-1,Math.floor(y)));const pixels=new Uint32Array(data.buffer,data.byteOffset,width*height),rgb=color.match(/[a-f0-9]{2}/gi).map(n=>parseInt(n,16)),target=pixels[y*width+x],next=(255<<24)|(rgb[2]<<16)|(rgb[1]<<8)|rgb[0];if(target===(next>>>0))return false;const queue=new Uint32Array(width*height);let head=0,tail=0;queue[tail++]=y*width+x;pixels[y*width+x]=next;while(head<tail){const p=queue[head++],col=p%width;for(const n of [col? p-1:-1,col<width-1?p+1:-1,p>=width?p-width:-1,p+width<pixels.length?p+width:-1])if(n>=0&&pixels[n]===target){pixels[n]=next;queue[tail++]=n;}}return true;}
 function reduced(ops){const out=[];for(const o of ops){if(o.kind==='clear')out.length=0;else if(o.kind==='undo'){const group=out.at(-1)?.group;if(group)while(out.length&&out.at(-1).group===group)out.pop();else out.pop();}else out.push(o);}return out;}
 function create(canvas){const ctx=canvas.getContext('2d',{willReadFrequently:true});let history=[],ids=new Set();canvas.width=960;canvas.height=600;
 function blank(){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,960,600);}
 function paint(o){if(o.kind==='fill'){const image=ctx.getImageData(0,0,960,600);if(flood(image.data,960,600,o.points[0][0],o.points[0][1],o.color))ctx.putImageData(image,0,0);return;}ctx.strokeStyle=ctx.fillStyle=o.color;ctx.lineWidth=o.size;ctx.lineCap=ctx.lineJoin='round';ctx.beginPath();const p=o.points;ctx.moveTo(...p[0]);if(p.length===1){ctx.arc(p[0][0],p[0][1],o.size/2,0,Math.PI*2);ctx.fill();}else{for(const q of p.slice(1))ctx.lineTo(...q);ctx.stroke();}}
 function redraw(){blank();for(const o of reduced(history))paint(o);}
 function add(o){if(ids.has(o.id))return;ids.add(o.id);history.push(o);if(o.kind==='clear'||o.kind==='undo')redraw();else paint(o);}
 blank();return {add,reset(){history=[];ids=new Set();blank();},preview:paint,redraw,history:()=>history.slice()};}
 const api={flood,reduced,create};root.OPC_FUTDRAW_CANVAS=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
