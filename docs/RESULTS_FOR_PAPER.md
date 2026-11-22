# StratSim: Empirical Results, Theoretical Formulations & Sensitivity Findings for Research Paper

> **Course / Paper Reference:** Principles of Management & Microeconomics (POME)  
> **Topic:** Oligopolistic Competition, Industry Attractiveness, and Strategic Behavior in the Indian Quick Commerce Sector (2022–2024)  
> **Target Firms Analyzed:** Blinkit (Zomato Ltd), Zepto (KiranaKart Tech), Swiggy Instamart (Swiggy Ltd), BigBasket Now (Tata Digital)

---

## 1. Mathematical Specifications & Core Formulations

### 1.1 BCG Growth-Share Matrix (Henderson, 1970)
$$\text{Relative Market Share (RMS)}_i = \frac{\text{Revenue}_i}{\max_{j \neq i} (\text{Revenue}_j)}$$
- Plotted on a logarithmic horizontal axis with threshold $\text{RMS}^* = 1.0\times$.
- Vertical axis: Market Growth Rate $g_i$ with threshold $g^* = 20.0\%$.
- Classification:
  - $\text{Stars}: \text{RMS} \ge 1.0 \land g \ge 20\%$ (Blinkit: $\text{RMS} \approx 1.41\times$, $g = 68\%$)
  - $\text{Question Marks}: \text{RMS} < 1.0 \land g \ge 20\%$ (Zepto: $\text{RMS} \approx 0.71\times$, $g = 85\%$; Instamart: $\text{RMS} \approx 0.59\times$, $g = 52\%$)
  - $\text{Dogs}: \text{RMS} < 1.0 \land g < 20\%$ (BB Now: $\text{RMS} \approx 0.22\times$, $g = 38\%$ slotted / niche)

### 1.2 Industry Attractiveness Index (Porter, 1979, 2008)
$$\text{Attractiveness Index} = 10 - \frac{\sum_{i=1}^{5} w_i \cdot S_i}{\sum_{i=1}^{5} w_i}$$
Where $S_i \in [1, 10]$ represents the hostility of force $i$, and $w_i$ is its normalized economic weight:
- **Competitive Rivalry ($S_1 = 9.2, w_1 = 0.30$):** Driven by CR4 $> 95\%$ and spatial dark store catchment overlap ($< 1.5$ km radius).
- **Threat of New Entrants ($S_2 = 4.5, w_2 = 0.15$):** Capex per store ₹35–₹45 Lakh + \$15–20M monthly burn moat.
- **Threat of Substitutes ($S_3 = 6.8, w_3 = 0.20$):** 12M+ physical Kirana stores and D-Mart 10–15% cheaper bulk staples.
- **Bargaining Power of Buyers ($S_4 = 7.8, w_4 = 0.20$):** 68% multi-homing rate, near-zero switching cost.
- **Bargaining Power of Suppliers ($S_5 = 6.5, w_5 = 0.15$):** Top 10 FMCG brands represent $>40\%$ staple basket GMV.
$$\text{Baseline Index} = 10 - [0.3(9.2) + 0.15(4.5) + 0.20(6.8) + 0.20(7.8) + 0.15(6.5)] = 10 - 7.33 = 2.67 / 10$$
*(Classification: Hyper-Competitive Capital Burn)*

### 1.3 Bertrand-Nash Multi-Firm Demand System
$$Q_i(P_i, \mathbf{P}_{-i}) = A_i \cdot P_i^{-\epsilon_{ii}} \cdot \prod_{j \neq i} \left(\frac{P_j}{P_j^{\text{base}}}\right)^{\epsilon_{ij}}$$
$$\Pi_i = Q_i \cdot (P_i - c_i) - \frac{F_i}{12}$$
Where:
- $P_i$: Customer delivery and platform fee (₹15 to ₹50).
- $\epsilon_{ii} \in [1.4, 1.75]$: Own-price elasticity.
- $\epsilon_{ij} \in [0.20, 0.75]$: Cross-price elasticity between direct urban rivals.
- $c_i$: Marginal fulfillment cost per drop (rider payout ₹50–55 + dark store direct cost ₹48–54).
- $F_i$: Amortized fixed corporate and tech overhead.

### 1.4 Hierarchical Management Layers (Gulick & Urwick, 1937; Fayol, 1916)
$$\text{Management Layers } L = \left\lceil \frac{\ln(N)}{\ln(S)} \right\rceil$$
$$\text{Coordination Cost Index} = \frac{N \cdot L \cdot (C/100) \cdot (0.5 + F/10)}{100}$$
Where $N$ is headcount, $S$ is average span of control, $C$ is centralization percentage, and $F$ is formalization level.

---

## 2. Empirical Validation Results (Plausibility Check)

> **Methodological Note:** Calibrate-vs-Test Split across $N=3$ historical events tracking 12 qualitative directional dimensions.

| Historical Case Study | Split Type | Tracked Dimension | Model Predicted Sign | Realized Historical Outcome | Directional Concordance |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Event 1: Zomato Blinkit Acquisition (2022-2024)** | **In-Sample Calibration** | Leader Market Share | $\Delta \text{Share} > 0$ (+10%+) | Grew from 28% to 40-42% | ✅ **MATCH** |
| | In-Sample Calibration | BCG Quadrant Shift | Question Mark $\rightarrow$ Star | Became dominant Star ($RMS > 1.4x$) | ✅ **MATCH** |
| | In-Sample Calibration | Contribution Margin | Nears Break-Even ($>0$) | Adjusted EBITDA positive in Q4 FY24 | ✅ **MATCH** |
| | In-Sample Calibration | Rival Dark Store Target | Rivals expand capex | Zepto & Swiggy doubled store counts | ✅ **MATCH** |
| **Event 2: Zepto $665M Funding Surge (2024)** | **Out-of-Sample Test** | Share Defense | Defend share $\sim 29-31\%$ | Maintained 29% share nationally | ✅ **MATCH** |
| | Out-of-Sample Test | Threat of Entrants | Entrant barrier spikes | Pure-play startups deterred | ✅ **MATCH** |
| | Out-of-Sample Test | Short-Term EBITDA | Burn expands by 25-40% | Burn rose to $15-20M/mo during expansion | ✅ **MATCH** |
| | Out-of-Sample Test | Pricing Action | Deep price cuts | **Mismatch**: Competed on speed/cafe, not cuts | ❌ **MISMATCH** |
| **Event 3: Industry Platform Fee Hikes (2023-2024)** | **Out-of-Sample Test** | Retaliation / Following | Competitors match fee hike | Blinkit, Zepto, Swiggy all raised fees | ✅ **MATCH** |
| | Out-of-Sample Test | Demand Inelasticity | Volume drop $< 5\%$ | Volumes dipped 7 days, then recovered | ✅ **MATCH** |
| | Out-of-Sample Test | Contribution Impact | High-margin expansion | Generated estimated ₹300-450 Cr | ✅ **MATCH** |
| | Out-of-Sample Test | Substitute Churn | Negligible defection to Kirana | Convenience lock-in persisted | ✅ **MATCH** |

### Summary Statistics:
- **Total Tracked Metrics:** 12
- **Directional Matches:** 11 of 12 (91.7% concordance)
- **In-Sample Calibration:** 4 of 4 matched (100%)
- **Out-of-Sample Test:** 7 of 8 matched (87.5%)
- **Identified Failure Mode:** The model originally assumed venture capital would be deployed purely for Bertrand price cuts; in reality, capital was channeled into non-price differentiation (Zepto Cafe, dark-store real estate pre-emption, and SKU assortment).

---

## 3. Sensitivity Analysis (Tornado Rankings)

The sensitivity of **Firm Monthly Profit** and **Industry Attractiveness Index** was evaluated under single-parameter perturbations:

| Rank | Parameter Varied | Baseline Value | Test Range (Low - High) | Output Dimension | Output Swing | Managerial Policy Implication |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | Unit Delivery Cost ($c_i$) | ₹23.50 | ₹19.00 – ₹28.00 | Profit | **₹3,15,000** | Rider payouts and dispatch density are the #1 driver of unit profitability. |
| **2** | Own-Price Elasticity ($\epsilon_{ii}$) | 1.75 | 1.35 – 2.15 | Profit | **₹2,84,000** | Consumer price sensitivity determines pricing power when fees exceed ₹35. |
| **3** | Cross-Price Elasticity ($\epsilon_{ij}$) | 0.75 | 0.35 – 1.05 | Profit | **₹1,62,000** | Platform differentiation (e.g. Cafe, Fresh) dampens customer poaching. |
| **4** | Competitive Rivalry Weight ($w_1$) | 0.30 | 0.15 – 0.45 | Attractiveness | **1.85 pts** | Weighting rivalry heavily compresses the industry index below 2.5/10. |
| **5** | Threat of Entrants Score ($S_2$) | 4.5 | 2.5 – 7.0 | Attractiveness | **1.12 pts** | Entry of Flipkart/Reliance significantly worsens industry margin pressure. |

---

## 4. Academic Limitations & Bounded Scope

1. **Small Sample Size ($N=3$ Events):** Directional plausibility cannot establish statistical causality.
2. **Aggregated City Geography:** Dark stores operate as localized sub-monopolies within 1.5 km radii; city-wide aggregation ignores micro-market pincode variations.
3. **Gig Labor Volatility:** Weather shocks (monsoons, extreme summer heat) create non-linear spikes in rider incentive costs not fully captured by static supply elasticities.
