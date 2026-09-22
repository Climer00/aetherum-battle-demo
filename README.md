# Aetherum Battle Demo

NES Final Fantasy-style browser battle: **Conductor Duelist** (you) vs **Dock Brute**.

**Pixel sprites stay on the canvas.** All readable UI (status, battle log with dice, buttons, hand cards) is crisp HTML/CSS so card names and rolls are easy to read.

## Play

Open the live demo (no build step):

**https://raw.githack.com/Climer00/aetherum-battle-demo/main/index.html**

Prefer a pinned SHA URL after each push (cache-friendly):

`https://raw.githack.com/Climer00/aetherum-battle-demo/<commit-sha>/index.html`

Alternates:
- https://cdn.jsdelivr.net/gh/Climer00/aetherum-battle-demo@main/index.html
- Clone and open `index.html` (static server optional for local file:// depending on browser)

Files: `index.html`, `style.css`, `game.js`. No gzip boot — `game.js` is loaded directly.

## How to play

1. Click **Start Fight** (or the canvas title).
2. **Your turn:** you get **5 AP**. Click a hand card or **Strike 1AP**.
3. **Strike modifiers** (Spark Edge, Precise Cut, Feint): click the card first, then **Strike** to attach (max one mod). AP = 1 + mod cost.
4. **Defense** (Guard, Sidestep) raises AC until your next turn.
5. **Riposte Setup** enables enhanced Riposte for the fight.
6. **End Turn** banks unused AP (bank cap 4).
7. **Enemy turn:** watch for **WIND-UP!** If you have banked AP, click **Riposte** during the window.
8. The battle log shows full dice, e.g. `Strike: d20=14 +5 = 19 vs AC 15 — HIT — 1d8+2 [6+2] = 8 dmg`.
9. Win by dropping the Brute to 0 HP. Click **Restart**.

## Rules summary

| Rule | Detail |
|------|--------|
| AP | 5 per player turn |
| Bank | +2 refresh at turn start, **cap 4**; unused AP can bank (respect cap) |
| Riposte | Reaction — spend **1 banked AP** during enemy Wind-Up (not a hand card) |
| Attack | Basic Strike always available (1 AP). Max **one** modifier card on a strike |
| Dice | Attack roll (d20 + bonus) vs AC; damage dice on hit |
| Recycle | Most cards return to hand at start of your turn. **Spark Edge** & **Lunge** are encounter-once (ONCE badge) |

### Default hand (7)

Spark Edge · Lunge · Guard · Precise Cut · Feint · Sidestep · Riposte Setup

### Full card pool (10)

Also in engine data (not default hand): **Press** (2 AP), **Bind** (strike +2), **Challenge** (1 AP).

### Enemy — Dock Brute

Pattern: Club → Wind-Up → Heavy Blow; occasional Shove. Medium armor, telegraphed Wind-Up for clear Riposte windows.

## Controls

| Input | Action |
|-------|--------|
| Hand card button | Play / select modifier |
| Strike 1AP | Basic strike (± selected mod) |
| End Turn | Bank leftover AP, enemy acts |
| Riposte | Spend 1 bank during Wind-Up |
| Start / Restart | Begin or rematch |

## Tech

- Logical canvas **256×224**, integer-scaled — draws **only** battle background, sprites, and simple HP bars
- Readable UI in system fonts (14–16px) via HTML overlay
- Procedural NES-ish palette sprites (`fillRect`)
- Plain `game.js` (no `game.gz.b64` eval boot)
