(() => {
"use strict";
async function boot(){
  const parts=[];
  for(let i=0;i<6;i++){
    const r=await fetch("game.part"+i+".js.txt");
    if(!r.ok) throw new Error("missing game.part"+i+".js.txt");
    parts.push(await r.text());
  }
  (0,eval)(parts.join(""));
}
boot().catch(e=>{
  document.body.insertAdjacentHTML("beforeend","<pre style=\"color:#f88;padding:1rem\">"+e+"</pre>");
  console.error(e);
});
})();
