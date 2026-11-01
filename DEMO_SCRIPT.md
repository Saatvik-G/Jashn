# EventSense (Jashn) — 3-Minute Live Product Demonstration Script

This walkthrough demonstrates the end-to-end user journey: unstructured plain-language intake, contradiction handling, deterministic plan generation, dynamic replanning with a side-by-side diff confirmation, and multi-format exports.

---

## Act 1: The Messy Input & Contradiction Detection (0:00 – 0:45)

**Presenter**:
> *"Planning celebrations in India is vibrant, chaotic, and emotionally charged. Families rarely start with neat spreadsheets—they start with a messy text message. Watch what happens when I give EventSense a realistic but mathematically impossible request."*

1. **Action**: Click **"Start New Celebration Intake"** on the home screen.
2. **Action**: In the prompt box, paste:
   ```text
   big wedding in Nov, around 2 lakh, lots of guests maybe 500 people in Jaipur
   ```
3. **Action**: Click **"Analyze & Plan"**.
4. **Result on Screen**:
   - The AI extracts the intent, but the **Contradiction Guard** triggers immediately.
   - An amber warning appears:
     > *"Feasibility Warning: At ₹2,00,000 for 500 guests, your per-head allocation is only ₹400. Standard Indian wedding feasts and basic banquet venues require a minimum of ~₹1,200–₹2,500 per guest."*
   - EventSense presents 3 clarifying options:
     - Adjust guest count to ~120 guests.
     - Revise total budget to ~₹9 Lakh.
     - Switch to an intimate community hall/home format.
5. **Presenter**:
   > *"EventSense doesn't hallucinate a fake budget. Our deterministic engine catches the ₹400 per-head contradiction before you spend a single rupee."*

---

## Act 2: Generating a Cohesive Celebration Plan (0:45 – 1:30)

1. **Action**: Click the quick prompt for **"Grand heritage wedding in Jaipur in Nov 2027, around 12 lakh budget, 150 guests"** and click **"Generate Editable Celebration Plan"**.
2. **Action**: The user is brought into the Royal Jaipur Wedding Workspace.
3. **Walkthrough of Workspace**:
   - **Dashboard**: Shows 150 Days Countdown, Days Left, ₹12,00,000 Total Budget, and **₹8,000 Cost per Head**.
   - **Donut Chart**: Recharts breakdown showing 35% Catering, 25% Venue, 13% Decor, 12% Photo.
   - **Where Can I Save?**: 3 interactive trade-offs. Click **"Streamline Buffet & Counters"**—watch the remaining buffer increase by ₹37,500 in real time. All rupee impacts are computed by TypeScript, never by the LLM.

---

## Act 3: The Mid-Planning Curveball — Live Replanning (1:30 – 2:15)

**Presenter**:
> *"Three months in, the maternal side of the family confirms they are attending. Headcount jumps from 150 to 220. In traditional spreadsheets, formulas break and tasks get missed."*

1. **Action**: Click **"Replan Plan"**.
2. **Action**: In the replanning prompt, type:
   ```text
   Guests increased from 150 to 220
   ```
3. **Action**: Click **"Calculate Diff"**.
4. **Result on Screen (AI Rule 4 in action)**:
   - A side-by-side **Visual Before/After Diff Dialog** appears.
   - **Guest Count**: `150 -> 220 (+70 Guests)`
   - **Cost Per Head**: `₹8,000 -> ₹5,455 (-₹2,545 / guest)`
   - **Injected Task**: `Update Catering Contract: +70 Guests (Due T-14d)`
   - **Warning**: `Guest count increased significantly (+70). Verify venue seating and fire capacity.`
5. **Presenter**:
   > *"Notice that nothing in our database changed yet. EventSense follows Rule 4: No plan change is applied without user confirmation and a visible diff."*
6. **Action**: Click **"Confirm & Apply Changes to Plan"**.
7. **Result**: The dashboard updates instantly with the new plate count, revised per-head budget, and new catering milestone task.

---

## Act 4: Vendor Quotes & AI Outreach (2:15 – 2:45)

1. **Action**: Switch to the **"Vendors & Quotes"** tab.
2. **Walkthrough**:
   - Show the **Quote Comparison Table**: Maharaja Royal Banquets vs Heritage Spice.
   - Adjust the **Quality Slider** from 40% to 60%—watch the weighted score recalculate dynamically.
   - Click **"Draft Outreach (WhatsApp/Email)"** on Caterers.
   - An inquiry modal opens with privacy placeholders (`{{YourName}}`, `{{EventDate}}`, `{{GuestCount}}`) and actionable negotiation tips. Click **"Copy WhatsApp"**.

---

## Act 5: Zero-Paid Exports & 128-Bit Read-Only Share (2:45 – 3:00)

1. **Action**: Click **"Export .ics"** in the header.
   - Downloads a valid `.ics` calendar file containing all backward-projected milestone due dates.
2. **Action**: Click **"Share Link"**.
   - Generates an unguessable 128-bit hex token link (e.g. `/share/jaipur-wedding-demo-token-128a`).
   - Open in an incognito window: family members see a clean, read-only celebration summary with zero edit controls and zero PII.
3. **Conclusion**:
   > *"EventSense combines the creative magic of GenAI with the mathematical precision of deterministic code—100% free, private, and celebratory."*
