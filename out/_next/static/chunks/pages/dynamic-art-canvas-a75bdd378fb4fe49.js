(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[646],{193:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/dynamic-art-canvas",function(){return n(9943)}])},9943:function(e,t,n){"use strict";n.r(t);var r=n(5893),i=n(7294),o=n(1664),l=n.n(o);t.default=function(){let e=(0,i.useRef)(null),t=(0,i.useRef)(0),n=(0,i.useRef)(0),o=(0,i.useRef)(Date.now());(0,i.useEffect)(()=>{let r=e.current,i=r.getContext("2d");r.width=window.innerWidth,r.height=window.innerHeight;let l=(e,t,n,r,o)=>{if(o){let l=i.createRadialGradient(e,t,0,e,t,n);l.addColorStop(0,r),l.addColorStop(1,o),i.fillStyle=l}else i.fillStyle=r;i.beginPath(),i.arc(e,t,n,0,2*Math.PI),i.fill()},a=(e,r)=>{let i=Date.now(),a=i-o.current,c=e-t.current,u=r-n.current;l(e,r,Math.max(10,Math.sqrt(c*c+u*u)/a*10),"rgba(".concat(255*Math.random(),", ").concat(255*Math.random(),", ").concat(255*Math.random(),", 0.6)"),null),t.current=e,n.current=r,o.current=i},c=e=>{let t=r.getBoundingClientRect();a(e.clientX-t.left,e.clientY-t.top)},u=e=>{e.preventDefault();let t=e.touches[0],n=r.getBoundingClientRect();a(t.clientX-n.left,t.clientY-n.top)};return r.addEventListener("mousemove",c),r.addEventListener("touchmove",u),()=>{r.removeEventListener("mousemove",c),r.removeEventListener("touchmove",u)}},[]);let a=()=>{let t=e.current;t.getContext("2d").clearRect(0,0,t.width,t.height)};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("canvas",{ref:e,style:{display:"block",background:"linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 1) 100%)"}}),(0,r.jsx)("div",{style:{position:"fixed",top:20,right:20,width:50,height:50,borderRadius:"50%",background:"rgba(255, 255, 255, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"},onClick:a,onTouchStart:a,children:"Clear"}),(0,r.jsx)(l(),{href:"/",style:{position:"fixed",top:20,left:20,color:"black",fontSize:"20px"},children:"Home"})]})}}},function(e){e.O(0,[664,888,774,179],function(){return e(e.s=193)}),_N_E=e.O()}]);