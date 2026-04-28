# 📄 MT700 SWIFT Fields — Documentary Credit Reference

An interactive, client-side reference guide for reading and understanding **MT700 SWIFT messages** used in international **Documentary Credits (Letters of Credit)** under **UCP 600**.

Built for trade finance students, exporters, importers, and bank operators who need a fast, searchable reference when working with real LC documents.

---

## 🌐 Live Demo

> [MT700-SWIFT](https://majo-es.github.io/MT700-SWIFT/)

---

## 📸 Preview

| Collapsed cards | Expanded card |
|---|---|
| All fields organized by section | Click any card to reveal description, SWIFT example, and practical tip |

---

## ✨ Features

- 🔍 **Live search** — filter fields instantly by code number or name
- 🃏 **Expandable cards** — click any field to reveal its full description, a real SWIFT example, and a practical tip
- 🏷️ **Color-coded badges** — instantly see whether a field is relevant to the exporter, the banks, or both
- 🖱️ **Custom cursor** — smooth lagging outline cursor built with the Web Animations API
- 📱 **Responsive** — single-column layout on mobile via CSS Grid
- ⚡ **Zero dependencies** — pure HTML, CSS, and vanilla JavaScript; no frameworks, no npm, no build tools

---

## 📁 File Structure

```
mt700-swift-reference/
│
├── index.html      # HTML structure — layout, search bar, legend, card container
├── styles.css      # All visual styles — cards, badges, cursor, typography, layout
├── main.js         # Data + logic — field data, render, filter, toggle, cursor
└── README.md       # This file
```

---

## 🏦 SWIFT Fields Covered

Fields are organized into 8 sections:

| Section | Fields |
|---|---|
| Credit identity | 20, 23, 27, 40A |
| Dates & deadlines | 31C, 31D, 44C, 44D, 48 |
| The 4 banks | 41A/D, 49, 51A/D, 57A/D |
| Parties | 50, 59 |
| Financial terms | 32B, 39A, 39B, 42C/42A, 42M |
| Shipment details | 43P, 43T, 44A, 44B, 44E |
| Documents & conditions | 45A, 46A, 47A, 47B |
| Charges & inter-bank instructions | 57D, 71B, 72, 76, 78 |

Each field card includes:
- **Field code** — the SWIFT MT700 field number
- **Name** — official field name
- **Who it's for** — exporter, bank-to-bank, all parties, dates, or documents
- **Description** — plain-English explanation of what the field does
- **SWIFT example** — a realistic example of how it appears in a real message
- **Practical tip** — what to watch out for in real LC operations

---

## 🧠 How It Works

### Data (`main.js`)
All field data lives in a single `fields` array of section objects. Each section has a `section` name and an `items` array. Each item has:

```js
{
  code:    '46A',                  // SWIFT field number
  name:    'Documents Required',   // Official name
  who:     'docs',                 // Badge type: bank | exporter | both | dates | docs
  sub:     'Exact documents...',   // Short subtitle shown on collapsed card
  desc:    'The complete list...', // Full description shown when expanded
  example: ':46A:\n+SIGNED...',    // Real SWIFT example (pre-formatted)
  tip:     'Most critical...',     // Practical warning or advice
}
```

### Adding a new field
Find the right section in `main.js` and push a new object into its `items` array:

```js
{
  code: '53A',
  name: 'Reimbursing Bank',
  who: 'bank',
  sub: 'Bank that reimburses the nominated bank',
  desc: 'Identifies the bank authorized to reimburse...',
  example: ':53A: CITIUS33XXX',
  tip: 'If present, the nominated bank claims reimbursement here, not from the issuing bank directly.',
}
```

### Render pipeline
```
renderAll(fields)
  └── filters empty sections
  └── maps each section → section HTML
        └── maps each item → buildCard(f) → card HTML
              └── injected into #sections div
```

### Search
`filterCards()` is called on every keystroke. It maps over `fields`, filtering each section's `items` by whether the field's combined search string (code + name + sub + desc) includes the query. Empty sections are hidden automatically.

---

## 🎨 Badge Color Reference

| Badge | Color | Meaning |
|---|---|---|
| `Bank-to-bank` | Blue | Field is an instruction between banks only |
| `Exporter` | Green | Exporter must read and act on this field |
| `All parties` | Purple | Relevant to everyone in the transaction |
| `Dates` | Orange | Contains a critical date or deadline |
| `Documents` | Red | Specifies required documents or conditions |

---

## 📚 Reference Standards

This tool is based on:

- **SWIFT MT700** — Issue of a Documentary Credit message standard
- **UCP 600** — Uniform Customs and Practice for Documentary Credits, ICC Publication No. 600 (2007 Revision)
- **ISBP 745** — International Standard Banking Practice for the Examination of Documents

> This tool is for **educational and reference purposes only**. Always consult your bank and the actual LC text for operational decisions.

---

## 📄 License

MIT License — free to use, modify, and distribute with attribution.
