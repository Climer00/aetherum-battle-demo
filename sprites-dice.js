window.AETHERUM_SPRITES=window.AETHERUM_SPRITES||{};
(function(){
function px(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w|0,h|0);}
function diamond(ctx,cx,cy,r,fill,edge,inner){
  ctx.beginPath();
  ctx.moveTo(cx,cy-r);ctx.lineTo(cx+r,cy);ctx.lineTo(cx,cy+r);ctx.lineTo(cx-r,cy);ctx.closePath();
  ctx.fillStyle=fill;ctx.fill();
  ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.stroke();
  if(inner){
    ctx.beginPath();
    ctx.moveTo(cx,cy-(r-5));ctx.lineTo(cx+(r-5),cy);ctx.lineTo(cx,cy+(r-5));ctx.lineTo(cx-(r-5),cy);ctx.closePath();
    ctx.fillStyle=inner;ctx.fill();
  }
}
function num(ctx,cx,cy,t,col){
  ctx.fillStyle=col;ctx.font="bold 12px ui-monospace,monospace";
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t,cx,cy+1);
}
function mk(w,h,draw){
  const c=document.createElement("canvas");c.width=w;c.height=h;
  const x=c.getContext("2d");x.imageSmoothingEnabled=false;draw(x);return c.toDataURL();
}
const C={navy:"#14101c",gold:"#d4a017",cop:"#c47a3a",lt:"#e8a85c",teal:"#5eead4",cream:"#f0e8d0",red:"#c23b3b",redlt:"#e85a5a",ink:"#1a1030"};
window.AETHERUM_SPRITES.die_d20=mk(48,48,x=>{
  px(x,0,0,48,48,"rgba(0,0,0,0)");diamond(x,24,24,20,C.cop,C.gold,C.ink);num(x,24,24,"20",C.teal);
});
window.AETHERUM_SPRITES.die_d20_crit=mk(48,48,x=>{
  diamond(x,24,24,20,C.gold,C.lt,C.ink);num(x,24,24,"20",C.gold);
});
window.AETHERUM_SPRITES.die_d20_fumble=mk(48,48,x=>{
  diamond(x,24,24,20,C.red,C.redlt,C.ink);num(x,24,24,"1",C.redlt);
});
window.AETHERUM_SPRITES.die_d8=mk(40,40,x=>{
  x.beginPath();x.moveTo(20,3);x.lineTo(36,20);x.lineTo(20,37);x.lineTo(4,20);x.closePath();
  x.fillStyle=C.cop;x.fill();x.strokeStyle=C.gold;x.lineWidth=2;x.stroke();
  x.beginPath();x.moveTo(20,10);x.lineTo(30,20);x.lineTo(20,30);x.lineTo(10,20);x.closePath();
  x.fillStyle=C.ink;x.fill();num(x,20,21,"8",C.teal);
});
function d6(face){
  return mk(32,32,x=>{
    px(x,1,1,30,30,C.navy);
    px(x,2,2,28,28,C.ink);
    x.strokeStyle=C.gold;x.lineWidth=2;x.strokeRect(2.5,2.5,27,27);
    const pip=[[8,8],[24,8],[8,16],[16,16],[24,16],[8,24],[24,24]];
    const map={1:[3],2:[0,6],3:[0,3,6],4:[0,1,5,6],5:[0,1,3,5,6],6:[0,1,2,4,5,6]};
    (map[face]||[]).forEach(i=>{const p=pip[i];px(x,p[0]-2,p[1]-2,5,5,C.cream);px(x,p[0]-1,p[1]-1,3,3,C.teal);});
  });
}
for(let i=1;i<=6;i++) window.AETHERUM_SPRITES["die_d6_"+i]=d6(i);
})();
