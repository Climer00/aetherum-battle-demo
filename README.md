# Aetherum Battle Demo

NES Final Fantasy-style browser battle: **Conductor Duelist** (you) vs **Dock Brute**.

**Pixel sprites stay on the canvas.** All readable UI (status, battle log with dice, buttons, hand cards) is crisp HTML/CSS so card names and rolls are easy to read.

## Play

Pinned SHA (recommended — cache-friendly):

**https://raw.githack.com/Climer00/aetherum-battle-demo/0d9f42021c0917add11dcd7877d7f4fea219c03e/index.html**

Branch tip:

https://raw.githack.com/Climer00/aetherum-battle-demo/main/index.html

Alternates:
- https://cdn.jsdelivr.net/gh/Climer00/aetherum-battle-demo@0d9f42021c0917add11dcd7877d7f4fea219c03e/index.html
- Clone and open `index.html`

Files: `index.html`, `style.css`, `game.js`. No gzip boot — `game.js` loads directly.

## How to play

1. Click **Start Fight**.
2. **Your turn:** **5 AP**. Click a hand card or **Strike 1AP**.
3. **Strike modifiers** (Spark Edge, Precise Cut, Feint): click the card first, then **Strike** (max one mod). AP = 1 + mod cost.
4. **Defense** (Guard, Sidestep) raises AC until your next turn.
5. **Riposte Setup** enables enhanced Riposte for the fight.
6. **End Turn** banks unused AP (cap 4).
7. Enemy **WIND-UP!** — click **Riposte** if you have banked AP.
8. Log shows full dice, e.g. `Strike: d20=14 +5 = 19 vs AC 15 — HIT — 1d8+2 [6+2] = 8 dmg`.
9. Drop the Brute to 0 HP. **Restart** to rematch.

## Rules summary

| Rule | Detail |
|------|--------|
| AP | 5 per player turn |
| Bank | +2 refresh at turn start, **cap 4** |
| Riposte | Spend **1 banked AP** during Wind-Up |
| Attack | Basic Strike (1 AP). Max **one** modifier |
| Dice | d20 + bonus vs AC; damage dice on hit |
| Recycle | Most cards return next turn. **Spark Edge** & **Lunge** are ONCE |

### Default hand (7)

Spark Edge · Lunge · Guard · Precise Cut · Feint · Sidestep · Riposte Setup

### Enemy — Dock Brute

Club → Wind-Up → Heavy Blow; occasional Shove.

## Tech

- Canvas **256×224**, integer-scaled — background, sprites, HP bars only
- Readable UI in system fonts (14–16px) via HTML overlay
- Plain `game.js` (no `game.gz.b64` eval boot)
