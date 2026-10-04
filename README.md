# Agrisure

Front-end prototype for **Agrisure Security Company (Pvt) Ltd**, a product-authentication platform that helps Zimbabwean farmers check that seeds, fertilizers, pesticides and stock feeds are genuine.

Tagline: **Scan. Verify. Farm with confidence.**

There is no backend. Codes, scans and reports live in a React store and are mirrored to `localStorage`, so the demo works offline after `npm install`.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## GitHub Pages

The production build uses base path `/Agrisure/`, so assets load on [https://spicorn.github.io/Agrisure/](https://spicorn.github.io/Agrisure/) instead of the domain root. Local `npm run dev` stays at `/`.

```bash
npm run deploy
```

That publishes the `dist` folder to the `gh-pages` branch. In the repo settings, set Pages to deploy from the **gh-pages** branch and the **root** folder. Direct links such as `/demo` are kept by copying `index.html` to `404.html`.

## Demo script

1. Open the landing page, then click **Try the demo**.
2. Scratch the seed-bag panel. The code fills the phone. Tap **Verify** and see **Genuine** (SeedCo SC 727, batch 2026-HIT).
3. Tap **Try again**, verify the same code, and see **Already used / possible clone**.
4. Enter any other code (or tap `AGR000000X`), see **Counterfeit**, then submit a report.
5. Switch the phone language to **Shona**, then **Ndebele**.
6. Open the **SMS** tab, choose **TelOne**, send `AGR260028S` to **33444**, and read the reply.
7. Open **Issue codes** (`/manufacturer`), generate 12 codes, then verify one of them on `/demo`.
8. Open `/dashboard` and check the KPIs, live feed and hotspot map.
9. Open `/audit`, follow the block chain, then press **Tamper test** to show the ledger breaking.

**Reset demo** on the farmer page restores the original codes and history. Use it before a pitch if you have already consumed the sample codes.

### Sample codes

| Code | Result |
| --- | --- |
| `AGR269514Q` | Genuine SeedCo SC 727 maize seed, batch 2026-HIT (then already used) |
| `AGR260028S` | Genuine FarmSafe 30EC, batch B2407-112 |
| `AGR264129J` | Genuine Windmill Compound D |
| `AGR263337W` | Already verified in Murehwa on 03 Oct 2026 |
| Anything else | Counterfeit |

## Course

Harare Institute of Technology — Department of Forensic Accounting and Auditing — 2026  
HIT 1101 Technopreneurship 1
