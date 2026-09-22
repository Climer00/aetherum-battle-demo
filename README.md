# Aetherum Battle Demo

NES Final Fantasy-style browser battle: **Conductor Duelist** (you) vs **Dock Brute**.

## Play

**https://raw.githack.com/Climer00/aetherum-battle-demo/main/index.html**

Also: https://cdn.jsdelivr.net/gh/Climer00/aetherum-battle-demo@main/index.html

`index.html` loads `style.css` and boots the engine from `game.gz.b64` (gzip+base64) so raw.githack works in one page load. No build step.

## How to play

1. Click the title screen to start.
2. **Your turn:** you get **5 AP**. Click a hand card or **Strike 1AP**.
3. **Strike modifiers** (Spark Edge, Precise Cut, Feint): click the card first, then **Strike** to attach (max one mod). AP = 1 + mod cost.
4. **Defense** (Guard, Sidestep) raises AC until your next turn.
5. **Riposte Setup** enables enhanced Riposte for the fight.
6. **End Turn** banks unused AP (bank cap 4).
7. **Enemy turn:** watch for **WIND-UP!** telegraph. If you have banked AP, click **RIPOSTE** during the window.
8. Win by dropping the Brute to 0 HP. Click to restart.

## Rules summary

| Rule | Detail |
|------|--------|
| AP | 5 per player turn |
| Bank | +2 refresh at turn start, **cap 4**; unused AP can bank (respect cap) |
| Riposte | Reaction — spend **1 banked AP** during enemy Wind-Up (not a hand card) |
| Attack | Basic Strike always available (1 AP). Max **one** modifier on a strike |
| Dice | Attack roll (d20 + bonus) vs AC; damage dice on hit |
| Recycle | Most cards return at turn start. **Spark Edge** & **Lunge** are encounter-once (ONCE stamp) |

### Default hand (7)

Spark Edge · Lunge · Guard · Precise Cut · Feint · Sidestep · Riposte Setup

### Full card pool (10)

Also in engine data (not default hand): **Press** (2 AP), **Bind** (strike +2), **Challenge** (1 AP).

### Enemy — Dock Brute

Pattern: Club → Wind-Up → Heavy Blow; occasional Shove. Medium armor, telegraphed Wind-Up. HP tuned for ~3–4 player turns.

## Controls

| Input | Action |
|-------|--------|
| Click card | Play / select modifier |
| Strike 1AP | Basic strike (± selected mod) |
| End Turn | Bank leftover AP, enemy acts |
| RIPOSTE | Spend 1 bank during Wind-Up |
| Click (title/end) | Start / restart |

## Tech

- Logical canvas **256×224**, integer-scaled
- Procedural NES-ish palette sprites (`fillRect`)
- `index.html` + `game.gz.b64` + `style.css`
