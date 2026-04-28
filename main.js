/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursorDot = document.querySelector('.cursor-dot')
const cursorOutline = document.querySelector('.cursor-dot-outline')

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX
  const posY = e.clientY

  /* Dot follows instantly */
  cursorDot.style.transform = `translate(${posX}px, ${posY}px)`
  cursorDot.style.opacity = '1'

  /* Outline follows with a lag via the Web Animations API.
     Keyframe array is the correct spec-compliant syntax. */
  cursorOutline.animate([{ transform: `translate(${posX}px, ${posY}px)` }], {
    duration: 500,
    fill: 'forwards',
  })
  cursorOutline.style.opacity = '1'
})

/* ============================================================
   DATA — all MT700 SWIFT fields
   Each section has: section (string) and items (array).
   Each item has: code, name, who, sub, desc, example, tip.
   "who" drives the badge color:
     'bank'     → blue  (bank-to-bank only)
     'exporter' → green (exporter must act)
     'both'     → purple (all parties)
     'dates'    → orange (date/deadline fields)
     'docs'     → red   (document fields)
   ============================================================ */
const fields = [
  {
    section: 'Credit identity',
    items: [
      {
        code: '27',
        name: 'Sequence of Total',
        who: 'both',
        sub: 'Message numbering',
        desc: 'Indicates the sequence number of this message and the total number of messages used to transmit the documentary credit (e.g. 1/1 means this is message 1 of 1 total).',
        example: ':27: 1/1',
        tip: 'Usually 1/1. If split across multiple messages, indicates continuation.',
      },
      {
        code: '40A',
        name: 'Form of Documentary Credit',
        who: 'both',
        sub: 'Credit type',
        desc: 'Defines the legal form of the credit. This is the most fundamental field — it determines the obligations of all parties.',
        example:
          ':40A: IRREVOCABLE\nor\n:40A: IRREVOCABLE TRANSFERABLE\nor\n:40A: IRREVOCABLE STANDBY',
        tip: 'Under UCP 600, all credits are irrevocable by default. REVOCABLE is practically obsolete.',
      },
      {
        code: '20',
        name: 'Documentary Credit Number',
        who: 'both',
        sub: 'Reference number',
        desc: 'The unique reference number assigned by the issuing bank to identify this documentary credit. All subsequent communications must quote this number.',
        example: ':20: LC2024-00847',
        tip: 'Always quote this number in all correspondence and document presentations.',
      },
      {
        code: '23',
        name: 'Reference to Pre-Advice',
        who: 'both',
        sub: 'Pre-advice reference',
        desc: 'If a pre-advice was sent before the full credit, this field references that pre-advice number.',
        example: ':23: PREADV-2024-091',
        tip: 'Not always present. Ignore if no pre-advice was issued.',
      },
    ],
  },

  {
    section: 'Dates & deadlines',
    items: [
      {
        code: '31C',
        name: 'Date of Issue',
        who: 'dates',
        sub: 'When the credit was opened',
        desc: 'The date the issuing bank officially opened the documentary credit. This is the starting point from which other dates are measured.',
        example: ':31C: 241015\n(= 15 October 2024)',
        tip: 'Format is YYMMDD. This date starts the lifecycle of the credit.',
      },
      {
        code: '31D',
        name: 'Date and Place of Expiry',
        who: 'dates',
        sub: 'Hard deadline for document presentation',
        desc: 'The absolute final date (and location) by which documents must be presented to the nominated bank. After this date, the credit is invalid regardless of circumstances.',
        example: ':31D: 250115 LONDON\n(= 15 January 2025, in London)',
        tip: 'This is the most critical date. Missing it means losing the credit — no exceptions.',
      },
      {
        code: '44C',
        name: 'Latest Date of Shipment',
        who: 'dates',
        sub: 'Last day to load goods',
        desc: 'The final date by which the goods must be shipped (i.e., the date on the Bill of Lading or equivalent transport document cannot be later than this date).',
        example: ':44C: 241231\n(= 31 December 2024)',
        tip: 'Must be before the expiry date (31D). Shipment date = B/L on-board date, not departure from factory.',
      },
      {
        code: '48',
        name: 'Period for Presentation',
        who: 'dates',
        sub: 'Days after shipment to present docs',
        desc: 'The number of calendar days after the date of shipment within which documents must be presented. If not stated, UCP 600 Article 14(c) applies a default of 21 days.',
        example: ':48: 21 DAYS AFTER DATE OF SHIPMENT\nor\n:48: 15',
        tip: 'Watch this carefully: you can ship on time but still miss this window if document preparation takes too long.',
      },
      {
        code: '44D',
        name: 'Shipment Period',
        who: 'dates',
        sub: 'Range of allowed shipment dates',
        desc: 'Specifies a date range within which shipment must occur — an alternative to 44C when a window (not just a latest date) is required.',
        example: ':44D: FROM 01/11/2024 TO 15/12/2024',
        tip: 'Used when the buyer wants goods shipped within a specific window, not just before a deadline.',
      },
    ],
  },

  {
    section: 'The 4 banks',
    items: [
      {
        code: '51A/D',
        name: 'Applicant Bank / Issuing Bank',
        who: 'bank',
        sub: 'Bank that opens the credit',
        desc: 'The bank that issues the documentary credit on behalf of the buyer (applicant). This bank carries the primary payment obligation and is the one that examines documents at the end of the chain.',
        example: ':51A: BARCGB22XXX\n(SWIFT BIC of Barclays Bank, London)',
        tip: "The issuing bank's country and standing directly affect the security of the credit for the exporter.",
      },
      {
        code: '57A/D',
        name: 'Advising Bank',
        who: 'exporter',
        sub: 'Bank that notifies the exporter',
        desc: "The bank in the exporter's country that receives the credit from the issuing bank and notifies (advises) the exporter of its existence. It authenticates the credit but does not necessarily guarantee payment.",
        example: ':57A: DEUTDEDBFRA\n(Deutsche Bank, Frankfurt)',
        tip: 'The advising bank verifies authenticity but unless it confirms the credit, it has no payment obligation.',
      },
      {
        code: '41A/D',
        name: 'Available With & By',
        who: 'exporter',
        sub: 'Nominated bank & payment method',
        desc: 'Specifies which bank is authorized to pay/negotiate (the nominated bank) and by what method the credit is available. This is effectively where and how the exporter gets paid.',
        example:
          ':41A: BNPAFRPPXXX BY NEGOTIATION\n:41A: ANY BANK BY PAYMENT\n:41A: ISSUING BANK BY DEF PAYMENT',
        tip: "'By payment' = sight. 'By acceptance' = draft. 'By def payment' = future date. 'By negotiation' = exporter's bank can purchase docs.",
      },
      {
        code: '49',
        name: 'Confirmation Instructions',
        who: 'bank',
        sub: 'Whether credit is confirmed',
        desc: 'Instructs the advising bank whether to add its own confirmation to the credit. CONFIRM means the advising bank adds a separate, independent payment guarantee. WITHOUT means advise only, no confirmation.',
        example: ':49: CONFIRM\n:49: WITHOUT\n:49: MAY ADD',
        tip: 'CONFIRM = highest security for exporter. WITHOUT = only issuing bank guarantees payment. MAY ADD = exporter can request confirmation for a fee.',
      },
    ],
  },

  {
    section: 'Parties',
    items: [
      {
        code: '50',
        name: 'Applicant',
        who: 'both',
        sub: 'The buyer',
        desc: 'Full name and address of the buyer (importer) who applied to their bank to open the documentary credit in favor of the exporter.',
        example: ':50: ACME TRADING CO. LTD\n15 HARBOUR ROAD\nHONG KONG',
        tip: "The applicant's name must match exactly on commercial invoices and other documents where required.",
      },
      {
        code: '59',
        name: 'Beneficiary',
        who: 'exporter',
        sub: 'The exporter/seller',
        desc: 'Full name, address, and sometimes bank details of the beneficiary — the party in whose favor the credit is opened. The exporter presents documents to receive payment.',
        example: ':59: GLOBAL EXPORTS S.A.\nAV. LIBERTADOR 1500\nBUENOS AIRES, ARGENTINA',
        tip: "Make sure your company name and address here exactly match what you'll print on your commercial invoice.",
      },
    ],
  },

  {
    section: 'Financial terms',
    items: [
      {
        code: '32B',
        name: 'Currency Code & Amount',
        who: 'both',
        sub: 'Value of the credit',
        desc: 'The currency and maximum amount of the documentary credit. Documents presented must not exceed this value unless tolerance is stated in field 39A.',
        example: ':32B: USD 250000,00\n(= USD 250,000.00)',
        tip: 'Commas vs dots vary by country convention in SWIFT. USD 250000,00 = $250,000.00.',
      },
      {
        code: '39A',
        name: 'Percentage Credit Amount Tolerance',
        who: 'exporter',
        sub: 'Allowed variance on amount',
        desc: 'Specifies a plus/minus percentage tolerance on the credit amount. The exporter may draw within this range without the credit being considered non-compliant.',
        example: ':39A: 5/5\n(= credit amount +5% / -5%)',
        tip: 'Common for bulk commodities. 5/5 means you can invoice between 95% and 105% of the face value.',
      },
      {
        code: '39B',
        name: 'Maximum Credit Amount',
        who: 'both',
        sub: "'Not Exceeding' instruction",
        desc: 'When this field says NOT EXCEEDING, no tolerance above the stated credit amount is permitted. Often used alongside 32B.',
        example: ':39B: NOT EXCEEDING',
        tip: 'If 39B says NOT EXCEEDING and 39A is blank, you cannot invoice even one cent over the credit amount.',
      },
      {
        code: '42C/42A',
        name: 'Drafts At / Drawee',
        who: 'exporter',
        sub: 'Bill of exchange terms',
        desc: '42C defines the tenor (maturity) of the bill of exchange (draft) the exporter must draw. 42A identifies the bank on which the draft is drawn (the drawee).',
        example: ':42C: 90 DAYS AFTER DATE OF B/L\n:42A: ISSUING BANK',
        tip: 'Only relevant when the credit is available by acceptance or deferred payment. The draft tenor determines when the exporter actually gets paid.',
      },
      {
        code: '42M',
        name: 'Mixed Payment Details',
        who: 'exporter',
        sub: 'Part sight, part deferred',
        desc: 'Used when payment is made partly at sight and partly at a future date. Contains the breakdown of how the total amount is split.',
        example: ':42M: 30 PCT AT SIGHT\n70 PCT 90 DAYS FROM B/L DATE',
        tip: 'Less common but used in structured trade finance deals.',
      },
    ],
  },

  {
    section: 'Shipment details',
    items: [
      {
        code: '43P',
        name: 'Partial Shipments',
        who: 'exporter',
        sub: 'Can goods be sent in parts?',
        desc: 'States whether the exporter is allowed to ship the goods in multiple separate consignments under the same credit.',
        example: ':43P: ALLOWED\n:43P: NOT ALLOWED\n:43P: PROHIBITED',
        tip: 'If NOT ALLOWED and you ship in parts, the credit becomes non-compliant. Verify before planning logistics.',
      },
      {
        code: '43T',
        name: 'Transhipment',
        who: 'exporter',
        sub: 'Can goods change vessels mid-route?',
        desc: 'Indicates whether transhipment (unloading and reloading onto another vessel at an intermediate port) is permitted during transport.',
        example: ':43T: ALLOWED\n:43T: NOT ALLOWED',
        tip: 'Many shipping routes require transhipment. Verify route before accepting a credit that prohibits it.',
      },
      {
        code: '44A',
        name: 'Port of Loading / Place of Taking in Charge',
        who: 'exporter',
        sub: 'Where the journey begins',
        desc: 'The place where the goods are received by the carrier for transport — this can be a port, airport, or inland location depending on the transport mode.',
        example: ':44A: SHANGHAI, CHINA\n:44A: HAMBURG, GERMANY',
        tip: 'Must match exactly what the transport document (B/L, AWB, etc.) shows as port/place of loading.',
      },
      {
        code: '44B',
        name: 'Port of Discharge / Place of Delivery',
        who: 'exporter',
        sub: 'Where goods arrive',
        desc: 'The final destination port or place where the goods are to be delivered to the buyer.',
        example: ':44B: ROTTERDAM, NETHERLANDS\n:44B: NEW YORK, USA',
        tip: "Must match your transport document exactly. Even small discrepancies (e.g. 'NY' vs 'New York') can cause rejection.",
      },
      {
        code: '44E',
        name: 'Port of Loading / Airport of Departure',
        who: 'exporter',
        sub: 'Specific departure port',
        desc: 'When a more specific loading port is required beyond field 44A, this field identifies the exact port of loading or airport of departure.',
        example: ':44E: PORT OF FELIXSTOWE, UK',
        tip: 'If both 44A and 44E are present, 44E takes priority for the departure location.',
      },
    ],
  },

  {
    section: 'Documents & conditions',
    items: [
      {
        code: '45A',
        name: 'Description of Goods and/or Services',
        who: 'both',
        sub: 'What is being traded',
        desc: 'A precise description of the goods, services, or performance covered by the credit. The commercial invoice description must correspond to this field.',
        example:
          ':45A: 500 METRIC TONS ARABICA COFFEE BEANS\nGRADE A, ORIGIN COLOMBIA\nINCOTERMS CIF HAMBURG 2020',
        tip: 'UCP 600 Art. 18(c): the invoice description must correspond to the goods description here. Other documents can use a general description.',
      },
      {
        code: '46A',
        name: 'Documents Required',
        who: 'docs',
        sub: 'Exact documents the exporter must present',
        desc: 'The complete list of documents the beneficiary (exporter) must present to the nominated bank for the credit to be honored. Each document must comply strictly with the stated specifications.',
        example:
          ':46A:\n+SIGNED COMMERCIAL INVOICE IN 3 ORIGINALS\n+FULL SET (3/3) CLEAN ON BOARD OCEAN BILLS OF LADING\n MADE OUT TO ORDER OF ISSUING BANK\n NOTIFY APPLICANT\n FREIGHT PREPAID\n+PACKING LIST IN 2 ORIGINALS\n+CERTIFICATE OF ORIGIN ISSUED BY CHAMBER\n+INSURANCE CERTIFICATE FOR 110% CIF VALUE\n+SGS INSPECTION CERTIFICATE',
        tip: 'Most critical field for the exporter. Read every line carefully. Even minor deviations create discrepancies.',
      },
      {
        code: '47A',
        name: 'Additional Conditions (Exporter)',
        who: 'exporter',
        sub: 'Extra requirements for the exporter',
        desc: 'Special clauses, additional document requirements, and conditions that apply specifically to the beneficiary (exporter) that do not fit elsewhere in the credit.',
        example:
          ':47A:\n+ALL DOCUMENTS MUST BE IN ENGLISH\n+SHORT FORM B/L NOT ACCEPTABLE\n+CHARTER PARTY B/L NOT ACCEPTABLE\n+STALE DOCUMENTS NOT ACCEPTABLE\n+THIRD PARTY INVOICES ACCEPTABLE\n+PACKING LIST MUST SHOW NET/GROSS WEIGHT PER CARTON',
        tip: 'Exporters often overlook this field and face discrepancies. Read 47A as carefully as 46A.',
      },
      {
        code: '47B',
        name: 'Additional Conditions (Banks)',
        who: 'bank',
        sub: 'Extra instructions for banks',
        desc: 'Additional conditions or instructions directed specifically at the banks involved in the transaction, not at the exporter.',
        example:
          ':47B:\nREIMBURSEMENT TO BE CLAIMED FROM\nCITIBANK NEW YORK UPON RECEIPT OF\nCOMPLYING PRESENTATION',
        tip: "As an exporter you typically don't need to act on 47B, but it can confirm how and when reimbursement flows.",
      },
    ],
  },

  {
    section: 'Charges & inter-bank instructions',
    items: [
      {
        code: '71B',
        name: 'Charges',
        who: 'both',
        sub: 'Who pays bank fees',
        desc: "Specifies which party is responsible for paying the bank charges and commissions associated with the documentary credit outside the issuing bank's country.",
        example:
          ':71B: ALL BANKING CHARGES\nOUTSIDE ISSUING COUNTRY\nARE FOR ACCOUNT OF BENEFICIARY\n\nor\n\n:71B: ALL CHARGES FOR ACCOUNT\nOF APPLICANT',
        tip: "If charges are for the beneficiary's account, bank fees will be deducted from your payment proceeds. Factor this into your pricing.",
      },
      {
        code: '72',
        name: 'Sender to Receiver Information',
        who: 'bank',
        sub: 'Inter-bank messages & confirmation status',
        desc: 'Bank-to-bank communication field. Contains instructions from the issuing bank to the advising/confirming bank — including whether to confirm the credit, reimbursement routing, and other operational instructions.',
        example:
          ':72: PLEASE CONFIRM THIS CREDIT\nAND DEDUCT YOUR CHARGES FROM PROCEEDS\n\nor\n\n:72: ADVISE WITHOUT ADDING\nYOUR CONFIRMATION\n\nor\n\n:72: PLEASE SEND DOCUMENTS DIRECT TO\n[BANK NAME, LETTER OF CREDIT DEPT]',
        tip: 'Check this field to know if the credit is confirmed. Also tells you where documents must be physically sent.',
      },
      {
        code: '76',
        name: 'Restrictions',
        who: 'both',
        sub: 'Where documents must be presented',
        desc: 'Specifies any restrictions on where documents may be presented or negotiated. If present, documents can only be presented to the named bank — not to any bank.',
        example: ':76: NEGOTIATION RESTRICTED TO\nABC BANK PLC, LONDON BRANCH',
        tip: "Restrictions to a bank in the buyer's country reduce the exporter's security. Try to negotiate presentation in your own country.",
      },
      {
        code: '78',
        name: 'Instructions to Paying / Accepting / Negotiating Bank',
        who: 'bank',
        sub: 'How to forward docs & claim reimbursement',
        desc: 'Operational instructions to the nominated bank explaining exactly how to forward documents to the issuing bank and how to claim reimbursement after paying the exporter.',
        example:
          ':78:\nUPON RECEIPT OF DOCUMENTS IN STRICT\nCOMPLIANCE, FORWARD ALL ORIGINALS\nTO ISSUING BANK IN ONE LOT BY DHL\nCOURIER AND CLAIM REIMBURSEMENT\nFROM CITIBANK NY BY MT742',
        tip: 'Your bank will follow these instructions. Delays in courier or reimbursement claims can delay your payment.',
      },
      {
        code: '57D',
        name: 'Advice Through Bank',
        who: 'exporter',
        sub: 'Routing bank details',
        desc: 'If different from the advising bank, this field specifies an intermediate bank through which the credit advice is routed to reach the beneficiary.',
        example: ':57D: SANTANDER BRASIL SA\nSAO PAULO, BRAZIL',
        tip: 'Relevant in markets where the advising bank does not have a direct correspondent relationship with the issuing bank.',
      },
    ],
  },
]

/* ============================================================
   LOOKUP MAPS — badge CSS class and display label by "who" key
   ============================================================ */
const badgeClass = {
  bank: 'badge-bank',
  exporter: 'badge-exporter',
  both: 'badge-both',
  dates: 'badge-dates',
  docs: 'badge-docs',
}

const badgeLabel = {
  bank: 'Bank-to-bank',
  exporter: 'Exporter',
  both: 'All parties',
  dates: 'Dates',
  docs: 'Documents',
}

/* ============================================================
   buildCard(f)
   Returns the HTML string for a single field card.
   The data-search attribute is used by filterCards() to match
   against the user's query without re-querying the DOM.
   ============================================================ */
function buildCard(f) {
  return `
    <div
      class="card"
      onclick="toggle(this)"
      data-search="${(f.code + ' ' + f.name + ' ' + f.sub + ' ' + f.desc).toLowerCase()}"
    >
      <div class="card-header">
        <span class="field-code">${f.code}</span>
        <div class="field-info">
          <div class="field-name">${f.name}</div>
          <div class="field-sub">${f.sub}</div>
        </div>
        <span class="badge ${badgeClass[f.who]}">${badgeLabel[f.who]}</span>
      </div>
      <div class="card-body">
        <p class="desc">${f.desc}</p>
        <div class="example">${f.example}</div>
        <div class="tip"><strong>Tip:</strong> ${f.tip}</div>
      </div>
    </div>`
}

/* ============================================================
   renderAll(data)
   Accepts a (possibly filtered) copy of the fields array and
   rebuilds the entire #sections container from scratch.
   ============================================================ */
function renderAll(data) {
  const container = document.getElementById('sections')
  const visible = data.filter((s) => s.items.length > 0)

  if (!visible.length) {
    container.innerHTML = '<div class="no-results">No fields match your search.</div>'
    return
  }

  container.innerHTML = visible
    .map(
      (s) => `
        <div class="section">
          <div class="section-title">
            ${s.section}
            <span class="section-count">
              ${s.items.length} field${s.items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div class="grid">
            ${s.items.map(buildCard).join('')}
          </div>
        </div>`
    )
    .join('')
}

/* ============================================================
   filterCards()
   Called by the search bar's oninput event.
   Filters sections and items whose combined search string
   includes the query, then re-renders.
   ============================================================ */
function filterCards() {
  const q = document.getElementById('search').value.toLowerCase().trim()

  if (!q) {
    renderAll(fields)
    return
  }

  const filtered = fields.map((s) => ({
    ...s,
    items: s.items.filter((f) =>
      (f.code + ' ' + f.name + ' ' + f.sub + ' ' + f.desc).toLowerCase().includes(q)
    ),
  }))

  renderAll(filtered)
}

/* ============================================================
   toggle(el)
   Adds or removes the .expanded class on a card element,
   which CSS uses to show/hide .card-body.
   ============================================================ */
function toggle(el) {
  el.classList.toggle('expanded')
}

/* ============================================================
   INIT — render all cards on page load
   ============================================================ */
renderAll(fields)
