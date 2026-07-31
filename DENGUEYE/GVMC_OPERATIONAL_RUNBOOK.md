# GVMC DENGUEYE Operational Runbook & System Handover Guide

## Executive Summary
DENGUEYE is an automated spatial-temporal disease surveillance and vector control dispatch system deployed for Greater Visakhapatnam Municipal Corporation (GVMC) Public Health Department. It replaces legacy 7–14 day hospital paper reporting with real-time ward-level digital reporting and **<48-hour automated GIS cluster detection**.

---

## 1. System Architecture & Components

```
 [Ward Health Workers (ASHA/ANM)] ──> [KoBoToolbox / DENGUEYE Form]
                                              │
                                              ▼
 [GVMC SMS Gateway Alerts] <─── [48H Spatial Cluster Engine (500m/48h)]
                                              │
                                              ▼
 [GVMC Vector Control Dispatch] <─── [Commissioner Command Center Map]
```

### Key Modules:
1. **Interactive GIS Map**: Powered by Leaflet.js with CartoDB Dark basemap tiles. Renders ward centroids, case markers (Dengue/Malaria), 48-hour spatial cluster glowing rings, and fogging radii.
2. **48-Hour Spatial Clustering Engine (`clusterEngine.ts`)**: Uses Haversine distance calculations to group cases reported within 48 hours in a 500-meter radius. Automatically classifies clusters into `CRITICAL`, `HIGH`, or `MODERATE` risk tiers.
3. **Ward Health Worker Digitised Entry (`FieldReportingForm.tsx`)**: KoBoToolbox/ODK styled mobile form for ASHA/ANM workers to capture patient info, disease diagnosis, auto-GPS location, and mosquito larva breeding site details.
4. **GVMC Vector Control Dispatcher (`VectorControlDispatch.tsx`)**: Mission control center for assigning thermal fogging units, Temephos larvicide sprayers, and source reduction squads with response SLA tracking (< 6 hours target).
5. **Automated SMS Gateway Broadcast (`SmsGatewaySimulator.tsx`)**: Sends automated SMS alerts to Ward Public Health Officers when a 48-hour cluster is identified.

---

## 2. 10 Pilot Wards Instrumented (Visakhapatnam)

| Ward # | Ward Name | Zone | Public Health Officer | Contact |
|---|---|---|---|---|
| Ward 15 | MVP Colony | Zone 3 | Dr. K. Srinivas Rao | +91 94401 88201 |
| Ward 06 | Madhurawada | Zone 2 | M. Lakshmi Narayana | +91 94401 88202 |
| Ward 65 | Gajuwaka | Zone 5 | P. Appala Naidu | +91 94401 88203 |
| Ward 22 | Maharani Peta | Zone 3 | Smt. V. Anuradha | +91 94401 88204 |
| Ward 18 | Siripuram | Zone 3 | B. Venkat Ramana | +91 94401 88205 |
| Ward 25 | Jagadamba Junction | Zone 3 | Ch. Satyanarayana | +91 94401 88206 |
| Ward 31 | Akkayyapalem | Zone 4 | G. Mohan Reddy | +91 94401 88207 |
| Ward 52 | Gopalapatnam | Zone 4 | K. Jagadeesh | +91 94401 88208 |
| Ward 70 | Pendurthi | Zone 4 | D. Rambabu | +91 94401 88209 |
| Ward 68 | Kurmannapalem | Zone 5 | R. Seshagiri Rao | +91 94401 88210 |

---

## 3. How to Operate

### Development & Demo Mode
```bash
# 1. Install dependencies
npm install

# 2. Start local dev server
npm run dev

# App runs at http://localhost:3000
```

### Production Build
```bash
npm run build
```

---

## 4. Operational Workflows

### Standard Operating Procedure (SOP) for Ward Health Officers
1. Open the **DENGUEYE Mobile Form** via the "+ Report Case (KoBo)" button.
2. Select Ward, enter Patient Demographics, Disease Diagnosis (NS1/IgM/Smear), Address, and tap **Detect Geolocation**.
3. Check for open mosquito breeding sites (standing water, open barrels).
4. Tap **Submit & Evaluate 48H GIS Cluster**.

### SOP for GVMC Public Health Supervisor
1. Monitor the **GIS Cluster Map** for glowing red radar rings indicating a **CRITICAL 48H CLUSTER**.
2. Click **Dispatch Vector Control Team** on the cluster popup card.
3. Track fogging vehicle deployment in the **Vector Control Dispatch** tab until marked `COMPLETED`.

---

## 5. Pilot Budget Breakdown (Indicative: Rs 8,000 to 15,000)
- **KoBoToolbox / ODK Mobile Forms**: Rs 0 (Open source / Free Tier)
- **Dashboard Hosting (Vite + Cloudflare/Vercel)**: Rs 0 (Free Tier)
- **SMS Gateway Integration (Twilio/Govt Gateway)**: Rs 1,200 - 2,500
- **Field Worker Data Pack Allowance (10 Wards)**: Rs 3,000 - 5,000
- **Total Operational Pilot Cost**: ~ Rs 4,200 - 7,500 (Well within Rs 8k-15k budget)
