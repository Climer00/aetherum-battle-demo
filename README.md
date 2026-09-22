# Aetherum Battle Demo

NES Final Fantasy-style browser battle: **Conductor Duelist** (you) vs **Dock Brute**.

**Pixel sprites stay on the canvas.** All readable UI (status, battle log with dice, buttons, hand cards, chips, peek sheet) is crisp HTML/CSS.

## Play

Prefer pinned SHAs, not `/main/`.

**Bank-first (verified combat):**
https://raw.githack.com/Climer00/aetherum-battle-demo/fde0fb964a3351b122055384573af84719f82c79/index.html

**Tabletop pack + Guard chip wired:**
https://raw.githack.com/Climer00/aetherum-battle-demo/94ac3566df6f5d43b236088dc00af753cc49cb18/index.html

**Cover toggle + Feint v4 valid part-join (this drop):**
Use the latest main commit SHA after the Feint-encode drop (prefer that pin over `/main/`).

Clone and open `index.html` (needs a local server — `game.js` fetches `game.part0.js.txt` … `game.part6.js.txt`).

## How to play

1. Click **Start Fight**. Initiative rolls; winner goes first.
2. **Your turn:** **5 AP**. Bank starts at **0**, cap **4**. No free bank refresh.
3. Click a hand card or **Strike 1AP**. Max **one** modifier per Strike.
4. Spend order is **bank first**, then turn AP. The turn does **not** auto-end while bank remains.
5. **End Turn** moves leftover turn AP into the bank (overflow past 4 is lost).
6. Enemy **WIND-UP!** — if bank ≥ 1 you get **Use / Skip** Riposte. Skip keeps bank and Setup. Use spends **1 bank**.
7. Log + dice theater show the d20 vs AC and damage dice.
8. Drop the Brute to 0 HP. **Restart** to rematch.

## Locked combat rules

| Rule | Detail |
|------|--------|
| Turn | Turn-based. d20 vs AC + damage dice still roll. AP/cards replace action economy only. |
| AP | 5 per player turn |
| Bank | Start **0**, cap **4**. End Turn banks leftover turn AP. **No** free +2 refresh. |
| Spend | Bank first, then turn AP |
| Riposte | Reaction on Wind-Up if bank ≥ 1. Use spends 1 bank. Skip keeps bank. |
| Attack | Basic Strike always (1 AP). Max one modifier per strike. |
| Cards | Cost AP only (no Aetherium slots in this demo). |
| Recycle | Most cards return at turn start. **Spark Edge** and **Lunge** are encounter-once. |

### Default hand (7)

Spark Edge · Lunge · Guard · Precise Cut · Feint · Sidestep · Riposte Setup

Pool also has Press, Bind, Challenge (not in the default hand).

### Enemy — Dock Brute

Club → Wind-Up → Heavy; occasional Shove.

### Status chips (hard-locked)

- **Guard** — +2 armor until next turn start
- **Feint** — next Strike +1 to hit (consumes on that Strike)
- **Riposte Setup** — next Riposte +1 damage die (consumes on Use; Skip keeps Setup)
- **Sidestep** — next attack vs you −2 to hit (consumes when attacked)
- **Wind-Up** — next Brute attack is Heavy; clears on that swing
- **Shove** — target −1 to hit until their next turn end

Approved chip art: Guard v3 and Feint v4 (48×48) are wired via part-join and decode as valid PNGs. Sidestep / Riposte Setup / Wind-Up / Shove art is glance-approved but **held from wiring**. Cover test toggle (None / Half −1 / Full −2) is live and applies only to attacks vs the hero.

## Tech

- Canvas **256×224**, integer-scaled — background, sprites, HP bars, canvas chip stamps
- Readable UI in system fonts via HTML overlay
- Engine split across `game.part0.js.txt` … `game.part6.js.txt`; `game.js` concatenates and evals them
- Art workflow: glance-approve new art before any repo commit

## Tabletop pack (in flight)

Dice theater, initiative roll, status chips on portraits + `#chipRow`, DM voice one-liners, peek character-sheet strip. Cover mods exist as a hook only (`half` −1 / `full` −2). Dice-pip pixel art still glance-first.
