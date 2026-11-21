# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/recx82-ship-it/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/recx82-ship-it/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Double Take** — a spot-the-difference game you play in a desktop browser. Two near-identical pictures sit side by side; find all seven differences in each scene before the clock runs out. Five original scenes, all drawn from code (no image files, no network requests): a sunny garden, a cosy kitchen, a moonlit camp, a toy room, and a snowy village. A wrong click costs 5 seconds, a hint costs 50 points, and a finished level pays a time bonus. Keyboard and mouse: click a difference in either picture, `H` for a hint, `P` to pause, `M` to mute, `N` for the next level.

## Run it

```sh
cd game && python3 -m http.server 8080
```

Then open http://localhost:8080 in desktop Chrome. Or serve it any other way — the game is plain static files under `game/`, and `main.ts` (Node 22) copies `game/` and `screenshots/` to `/output` and writes `dossier.json` for the make.fun judge.

---

<sub>Entered on [make.fun](https://make.fun/?ref=17s3abg9&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
