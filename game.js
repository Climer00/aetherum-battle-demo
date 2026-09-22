(() => {
"use strict";
const P = {
black:"#000000",dark:"#1a1a2e",navy:"#16213e",blue:"#0f3460",mid:"#533483",
copper:"#c47a3a",copperLt:"#e8a85c",aether:"#5eead4",white:"#f0e8d0",gray:"#8a8a9a",
red:"#c23b3b",redLt:"#e85a5a",green:"#3d9e5f",skin:"#e8c4a0",brown:"#6b4423",
brute:"#5a6a4a",bruteLt:"#8a9a6a"
};
const W=256,H=224;
const canvas=document.getElementById("c");
const ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=false;
const el={
ap:document.getElementById("statAp"),
bank:document.getElementById("statBank"),
ac:document.getElementById("statAc"),
turn:document.getElementById("statTurn"),
riposte:document.getElementById("statRiposte"),
mod:document.getElementById("statMod"),
log:document.getElementById("log"),
hand:document.getElementById("hand"),
handHint:document.getElementById("handHint"),
overlay:document.getElementById("overlayMsg"),
btnFight:document.getElementById("btnFight"),
btnStrike:document.getElementById("btnStrike"),
btnEnd:document.getElementById("btnEnd"),
btnRiposte:document.getElementById("btnRiposte"),
btnRestart:document.getElementById("btnRestart")
};
function fit(){
const maxW=Math.min(window.innerWidth-24,720);
const s=Math.max(1,Math.floor(Math.min(maxW/W,(window.innerHeight*0.45)/H)));
canvas.style.width=(W*s)+"px";canvas.style.height=(H*s)+"px";
}
window.addEventListener("resize",fit);fit();
const CARD_POOL=[
{id:"spark",name:"Spark Edge",cost:1,type:"modifier",encounterOnce:true,hitBonus:2,dmgBonus:0,desc:"+2 to hit (ONCE)"},
{id:"lunge",name:"Lunge",cost:2,type:"maneuver",encounterOnce:true,hitBonus:1,dmgBonus:2,desc:"Dash strike +dmg (ONCE)"},
{id:"guard",name:"Guard",cost:1,type:"defense",acBonus:3,turns:1,desc:"+3 AC until next turn"},
{id:"precise",name:"Precise Cut",cost:1,type:"modifier",hitBonus:1,dmgBonus:0,desc:"Strike mod +1 hit"},
{id:"feint",name:"Feint",cost:1,type:"modifier",hitBonus:1,dmgBonus:0,desc:"Strike mod +1 hit"},
{id:"sidestep",name:"Sidestep",cost:1,type:"defense",acBonus:2,turns:1,desc:"+2 AC / maneuver"},
{id:"riposte_setup",name:"Riposte Setup",cost:1,type:"setup",desc:"Enable enhanced Riposte"},
{id:"press",name:"Press",cost:2,type:"maneuver",hitBonus:0,dmgBonus:3,desc:"Heavy advance +3 dmg"},
{id:"bind",name:"Bind",cost:1,type:"modifier",hitBonus:2,dmgBonus:0,desc:"Strike mod +2 hit"},
{id:"challenge",name:"Challenge",cost:1,type:"maneuver",hitBonus:2,dmgBonus:0,desc:"Provoke: next hit +2"}
];
const DEFAULT_HAND=["spark","lunge","guard","precise","feint","sidestep","riposte_setup"];
function cardById(id){return CARD_POOL.find(c=>c.id===id);}
function d(n){return 1+Math.floor(Math.random()*n);}
function roll(expr){
const m=expr.match(/(\d+)d(\d+)([+-]\d+)?/);
if(!m)return{total:0,rolls:[],mod:0,sides:0,n:0,expr};
const n=+m[1],sides=+m[2],mod=m[3]?+m[3]:0;
const rolls=[];for(let i=0;i<n;i++)rolls.push(d(sides));
const sum=rolls.reduce((a,b)=>a+b,0);
return{total:sum+mod,rolls,mod,sides,n,sum,expr};
}
function fmtD20(r){const modStr=r.mod>=0?"+"+r.mod:String(r.mod);return"d20="+r.rolls[0]+" "+modStr+" = "+r.total;}
function fmtDmg(r,extra){
extra=extra||0;let s=r.n+"d"+r.sides;
if(r.mod)s+=(r.mod>=0?"+"+r.mod:r.mod);
s+=" ["+r.rolls.join("+");
if(r.mod)s+=(r.mod>=0?"+"+r.mod:r.mod);
s+="]";if(extra)s+=" +"+extra;
const total=r.total+extra;s+=" = "+total;return{text:s,total};
}
const state={
screen:"title",phase:"player",ap:5,bank:0,selectedMod:null,
hand:[],discardedOnce:new Set(),inHand:new Set(),
hero:null,enemy:null,log:[],
enemyPattern:0,enemyPhase:null,telegraph:null,
riposteReady:false,riposteSetup:false,
animTimer:0,hitFlash:0,shake:0,turn:0,
uiDirty:true,_afterEnemy:false,_riposteDone:false
};
function log(msg,cls){state.log.push({text:msg,cls:cls||"sys"});if(state.log.length>40)state.log.shift();state.uiDirty=true;}
function initFight(){
state.screen="fight";state.phase="player";state.ap=5;state.bank=0;state.selectedMod=null;
state.discardedOnce=new Set();state.hand=DEFAULT_HAND.slice();state.inHand=new Set(state.hand);
state.riposteSetup=false;state.riposteReady=false;state.telegraph=null;
state.enemyPattern=0;state.enemyPhase=null;state.turn=1;state.log=[];
state.animTimer=0;state.hitFlash=0;state.shake=0;state._afterEnemy=false;state._riposteDone=false;
state.hero={name:"Conductor Duelist",hp:42,maxHp:42,ac:14,baseAc:14,atkBonus:5,dmg:"1d8+2",tempAc:0,tempAcTurns:0,x:168,y:72,pose:"idle"};
state.enemy={name:"Dock Brute",hp:58,maxHp:58,ac:15,atkBonus:4,x:48,y:68,pose:"idle"};
log("Fight! Conductor vs Dock Brute.","sys");
log("Your turn — 5 AP. Bank +2/turn (cap 4).","sys");
startPlayerTurn(true);state.uiDirty=true;
}
function startPlayerTurn(first){
state.phase="player";state.selectedMod=null;if(!first)state.turn++;
const before=state.bank;state.bank=Math.min(4,state.bank+2);
if(state.bank>before)log("Bank +"+(state.bank-before)+" (bank "+state.bank+"/4).","sys");
state.ap=5;
if(state.hero.tempAcTurns>0){state.hero.tempAcTurns--;if(state.hero.tempAcTurns<=0){state.hero.tempAc=0;state.hero.ac=state.hero.baseAc;log("Guard/Sidestep fades.","sys");}}
for(const id of DEFAULT_HAND){if(state.discardedOnce.has(id))continue;if(!state.inHand.has(id)){state.hand.push(id);state.inHand.add(id);}}
state.hand=DEFAULT_HAND.filter(id=>state.inHand.has(id));
if(!first)log("— Turn "+state.turn+": "+state.ap+" AP —","sys");
state.uiDirty=true;
}
function spendAp(n){if(state.ap<n)return false;state.ap-=n;state.uiDirty=true;return true;}
function endPlayerTurn(){
if(state.ap>0){const room=4-state.bank;const banked=Math.min(room,state.ap);
if(banked>0){state.bank+=banked;log("Banked "+banked+" → "+state.bank+"/4","sys");}
if(state.ap>banked)log((state.ap-banked)+" AP lost (full).","warn");}
state.ap=0;state.selectedMod=null;state.uiDirty=true;beginEnemyTurn();
}
function heroAc(){return state.hero.baseAc+(state.hero.tempAc||0);}
function playCard(id){
if(state.phase!=="player")return;const c=cardById(id);
if(!c||!state.inHand.has(id))return;
if(state.ap<c.cost){log("Need "+c.cost+" AP for "+c.name+".","warn");return;}
if(c.type==="modifier"){
if(state.selectedMod===id){state.selectedMod=null;log("Modifier cleared.","sys");}
else{state.selectedMod=id;log(c.name+" ready","sys");}
state.uiDirty=true;return;
}
if(!spendAp(c.cost))return;removeFromHand(id,c);
if(c.type==="defense"){state.hero.tempAc=Math.max(state.hero.tempAc||0,c.acBonus);state.hero.tempAcTurns=c.turns;log(c.name+": +"+c.acBonus+" AC (now "+heroAc()+").","sys");}
else if(c.type==="setup"){state.riposteSetup=true;log("Riposte Setup armed.","warn");}
else if(c.type==="maneuver"){resolveHeroAttack(c);}
state.uiDirty=true;
}
function removeFromHand(id,c){
state.inHand.delete(id);state.hand=state.hand.filter(x=>x!==id);
if(c&&c.encounterOnce){state.discardedOnce.add(id);log(c.name+" — ONCE (discarded).","warn");}
state.uiDirty=true;
}
function doBasicStrike(){
if(state.phase!=="player")return;
const mod=state.selectedMod?cardById(state.selectedMod):null;
const cost=1+(mod?mod.cost:0);
if(state.ap<cost){log("Need "+cost+" AP (strike"+(mod?" + "+mod.name:"")+").","warn");return;}
spendAp(1);if(mod){spendAp(mod.cost);removeFromHand(mod.id,mod);state.selectedMod=null;}
resolveHeroAttack(mod);
}
function resolveHeroAttack(mod){
state.phase="resolve";
const hitB=(mod&&mod.hitBonus)||0;const dmgB=(mod&&mod.dmgBonus)||0;
const atk=roll("1d20+"+(state.hero.atkBonus+hitB));const ac=state.enemy.ac;
const label=mod?(mod.type==="maneuver"?mod.name:"Strike + "+mod.name):"Strike";
let line=label+": "+fmtD20(atk)+" vs AC "+ac;
if(atk.total>=ac){
const dmg=roll(state.hero.dmg);const fd=fmtDmg(dmg,dmgB);
state.enemy.hp=Math.max(0,state.enemy.hp-fd.total);
state.hitFlash=12;state.shake=6;state.enemy.pose="hurt";
line+=" — HIT — "+fd.text+" dmg";log(line,"hit");
if(state.enemy.hp<=0){setTimeout(()=>{state.screen="win";state.uiDirty=true;},900);state.uiDirty=true;return;}
}else{line+=" — MISS";log(line,"miss");}
state.animTimer=35;state.uiDirty=true;
}
function afterResolve(){
state.enemy.pose="idle";state.hero.pose="idle";
if(state.enemy.hp<=0||state.hero.hp<=0)return;
if(state.phase==="resolve"){if(state.ap>0){state.phase="player";log("AP left: "+state.ap,"sys");}else endPlayerTurn();}
state.uiDirty=true;
}
const PATTERN=["club","windup","club","windup","shove","club","windup"];
function beginEnemyTurn(){
state.phase="enemy";
const act=PATTERN[state.enemyPattern%PATTERN.length];
state.enemyPattern++;state.enemyPhase=act;
if(act==="windup"){
state.telegraph="WIND-UP!";state.enemy.pose="windup";log("Dock Brute Wind-Up!","warn");
state.riposteReady=state.bank>=1;state.phase="riposte_window";state.animTimer=90;
if(state.riposteReady)log(">>> RIPOSTE available (1 bank) <<<","warn");else log("(Need bank for Riposte.)","sys");
}else if(act==="club"){state.telegraph=null;state.enemy.pose="attack";log("Dock Brute swings Club!","sys");enemyAttack("1d8+3","Club");}
else if(act==="heavy"){state.telegraph=null;state.enemy.pose="attack";log("Dock Brute Heavy Blow!","warn");enemyAttack("2d8+3","Heavy Blow");}
else if(act==="shove"){state.telegraph=null;state.enemy.pose="attack";log("Dock Brute Shoves!","sys");enemyAttack("1d6+2","Shove");}
state.uiDirty=true;
}
function enemyAttack(dmgExpr,name){
state.phase="resolve";
const atk=roll("1d20+"+state.enemy.atkBonus);const ac=heroAc();
let line=name+": "+fmtD20(atk)+" vs AC "+ac;
if(atk.total>=ac){
const dmg=roll(dmgExpr);const fd=fmtDmg(dmg,0);
state.hero.hp=Math.max(0,state.hero.hp-fd.total);
state.hitFlash=12;state.shake=8;state.hero.pose="hurt";
line+=" — HIT — "+fd.text+" dmg";log(line,"hit");
if(state.hero.hp<=0){setTimeout(()=>{state.screen="lose";state.uiDirty=true;},900);state.uiDirty=true;return;}
}else{line+=" — MISS";log(line,"miss");}
state.animTimer=40;state._afterEnemy=true;state.uiDirty=true;
}
function doRiposte(){
if(state.phase!=="riposte_window")return;
if(state.bank<1){log("No banked AP!","warn");return;}
state.bank-=1;state.riposteReady=false;state.phase="resolve";state.telegraph=null;
const bonus=state.riposteSetup?3:1;const dmgB=state.riposteSetup?2:0;
const atk=roll("1d20+"+(state.hero.atkBonus+bonus));
let line="RIPOSTE (1 bank): "+fmtD20(atk)+" vs AC "+state.enemy.ac;
if(atk.total>=state.enemy.ac){
const dmg=roll(state.hero.dmg);const fd=fmtDmg(dmg,dmgB);
state.enemy.hp=Math.max(0,state.enemy.hp-fd.total);
state.hitFlash=14;state.shake=8;state.enemy.pose="hurt";
line+=" — HIT — "+fd.text+" dmg";if(state.riposteSetup)line+=" (setup bonus)";log(line,"hit");
if(state.enemy.hp<=0){setTimeout(()=>{state.screen="win";state.uiDirty=true;},800);state.uiDirty=true;return;}
}else{line+=" — MISS";log(line,"miss");}
state.enemyPhase=null;state.animTimer=35;state._riposteDone=true;state._afterEnemy=true;state.uiDirty=true;
}
function afterEnemyOrRiposte(){
state.enemy.pose="idle";state.hero.pose="idle";state.telegraph=null;
if(state.enemy.hp<=0||state.hero.hp<=0)return;
if(state._riposteDone){state._riposteDone=false;state._afterEnemy=false;startPlayerTurn(false);return;}
if(state.enemyPhase==="windup"){state.enemyPhase="heavy";state.enemy.pose="attack";log("Heavy Blow lands!","warn");enemyAttack("2d8+3","Heavy Blow");return;}
if(state._afterEnemy){state._afterEnemy=false;startPlayerTurn(false);}
state.uiDirty=true;
}
function syncUI(){
if(!state.uiDirty)return;state.uiDirty=false;
const fighting=state.screen==="fight";const player=fighting&&state.phase==="player";const ripWin=fighting&&state.phase==="riposte_window";
if(state.hero){
el.ap.textContent=state.ap+"/5";el.bank.textContent=state.bank+"/4";
el.ac.textContent=String(heroAc());el.turn.textContent=String(state.turn);
el.riposte.textContent=state.riposteSetup?"Setup ON":"basic";
el.mod.textContent=state.selectedMod?cardById(state.selectedMod).name:"none";
}else{el.ap.textContent="—";el.bank.textContent="—";el.ac.textContent="—";el.turn.textContent="—";el.riposte.textContent="—";el.mod.textContent="none";}
el.log.innerHTML="";
state.log.forEach(entry=>{const div=document.createElement("div");div.className="line "+(entry.cls||"sys");div.textContent=entry.text;el.log.appendChild(div);});
el.log.scrollTop=el.log.scrollHeight;
if(state.screen==="title"){el.overlay.className="";el.overlay.textContent="Start Fight";}
else if(state.screen==="win"){el.overlay.className="";el.overlay.textContent="VICTORY";}
else if(state.screen==="lose"){el.overlay.className="lose";el.overlay.textContent="DEFEAT";}
else if(state.telegraph){el.overlay.className="";el.overlay.textContent=state.telegraph;}
else{el.overlay.className="hidden";el.overlay.textContent="";}
el.btnFight.classList.toggle("hidden",fighting||state.screen==="win"||state.screen==="lose");
el.btnRestart.classList.toggle("hidden",state.screen!=="win"&&state.screen!=="lose");
el.btnStrike.disabled=!player;el.btnEnd.disabled=!player;
el.btnRiposte.classList.toggle("hidden",!ripWin);
el.btnRiposte.disabled=!(ripWin&&state.bank>=1);
el.btnRiposte.textContent=state.bank>=1?"Riposte (1 Bank)":"Riposte (no bank)";
el.handHint.textContent=player?(state.selectedMod?" · mod: "+cardById(state.selectedMod).name:" · card or Strike"):(ripWin?" · Wind-Up!":"");
el.hand.innerHTML="";
DEFAULT_HAND.forEach(id=>{
const c=cardById(id);const inHand=state.inHand.has(id);const onceGone=state.discardedOnce.has(id);const sel=state.selectedMod===id;
const btn=document.createElement("button");btn.type="button";
btn.className="card"+(sel?" selected":"")+(onceGone?" once-gone":"");
btn.disabled=!player||!inHand;
const onceBadge=c.encounterOnce?'<span class="badge-once">'+(onceGone?"USED":"ONCE")+"</span>":"";
btn.innerHTML='<div class="cname">'+c.name+onceBadge+"</div>"+'<div class="cmeta">'+c.cost+" AP · "+c.type+"</div>"+'<div class="ctype">'+(inHand?"in hand":(onceGone?"once-used":"next turn"))+"</div>"+'<div class="cdesc">'+c.desc+"</div>";
btn.addEventListener("click",()=>playCard(id));el.hand.appendChild(btn);
});
}
el.btnFight.addEventListener("click",()=>initFight());
el.btnRestart.addEventListener("click",()=>initFight());
el.btnStrike.addEventListener("click",()=>doBasicStrike());
el.btnEnd.addEventListener("click",()=>endPlayerTurn());
el.btnRiposte.addEventListener("click",()=>doRiposte());
canvas.addEventListener("click",()=>{if(state.screen==="title"||state.screen==="win"||state.screen==="lose")initFight();});
function fill(c){ctx.fillStyle=c;}
function rect(x,y,w,h,c){if(c)fill(c);ctx.fillRect(x|0,y|0,w|0,h|0);}
function drawHero(hx,hy){
const flash=state.hitFlash>0&&state.hero&&state.hero.pose==="hurt";
rect(hx+10,hy+10,12,14,flash?P.redLt:P.navy);rect(hx+11,hy+12,10,3,P.copper);rect(hx+14,hy+16,4,6,P.aether);
rect(hx+12,hy+4,8,7,P.skin);rect(hx+12,hy+3,8,2,P.dark);rect(hx+8,hy+10,3,12,P.mid);
rect(hx+11,hy+24,4,8,P.dark);rect(hx+17,hy+24,4,8,P.dark);rect(hx+22,hy+8,2,18,P.gray);
rect(hx+21,hy+7,4,2,P.copperLt);rect(hx+22,hy+6,2,2,P.white);
}
function drawBrute(ex,ey){
const flash=state.hitFlash>0&&state.enemy&&state.enemy.pose==="hurt";
const wind=state.enemy&&state.enemy.pose==="windup";
rect(ex+4,ey+10,24,18,flash?P.redLt:P.brute);rect(ex+6,ey+12,20,4,P.brown);
rect(ex+10,ey+2,12,10,P.skin);rect(ex+10,ey+1,12,3,P.brown);
const ax=wind?ex+28:ex+26;rect(ex-2,ey+12,8,6,P.bruteLt);rect(ax,ey+(wind?4:12),8,6,P.bruteLt);
rect(ax+6,ey+(wind?-4:6),4,16,P.brown);rect(ax+4,ey+(wind?-8:2),8,6,P.brown);
rect(ex+8,ey+28,6,6,P.dark);rect(ex+18,ey+28,6,6,P.dark);
}
function drawHpBar(x,y,w,hp,max){rect(x,y,w,5,P.black);const pct=Math.max(0,hp/max);rect(x+1,y+1,Math.floor((w-2)*pct),3,pct>0.3?P.green:P.red);}
function drawFightSprites(){
rect(0,0,W,H,P.dark);rect(0,110,W,50,P.navy);for(let i=0;i<16;i++)rect(i*16,110,1,50,P.blue);rect(0,0,W,16,P.black);
const ox=state.shake>0?((Math.random()*3)|0)-1:0;const oy=state.shake>0?((Math.random()*3)|0)-1:0;
if(state.enemy)drawBrute(state.enemy.x+ox,state.enemy.y+oy);
if(state.hero)drawHero(state.hero.x+ox,state.hero.y+oy);
if(state.enemy)drawHpBar(8,10,70,state.enemy.hp,state.enemy.maxHp);
if(state.hero)drawHpBar(168,10,70,state.hero.hp,state.hero.maxHp);
rect(8,18,4,4,P.bruteLt);rect(168,18,4,4,P.aether);
}
function drawIdleBg(){rect(0,0,W,H,P.black);rect(0,80,W,80,P.dark);drawBrute(48,68);drawHero(168,72);}
function tick(){
if(state.hitFlash>0)state.hitFlash--;if(state.shake>0)state.shake--;
if(state.animTimer>0){state.animTimer--;if(state.animTimer===0){
if(state.phase==="resolve"){if(state._afterEnemy||state._riposteDone)afterEnemyOrRiposte();else afterResolve();}
else if(state.phase==="riposte_window"){state.riposteReady=false;afterEnemyOrRiposte();}
state.uiDirty=true;}}
if(state.screen==="fight")drawFightSprites();else drawIdleBg();
syncUI();requestAnimationFrame(tick);
}
state.screen="title";state.uiDirty=true;tick();
})();
