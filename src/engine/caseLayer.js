/**
 * Case Layer Engine (Principles of Management - Unit I)
 * Connects operational events, pricing actions, and industry shocks
 * to Luther Gulick's POSDCORB framework and the four classic management schools:
 * Classical, Behavioral, Systems, and Contingency.
 */

export const MANAGEMENT_SCHOOLS = {
  classical: {
    id: "classical",
    name: "Classical Management",
    thinkers: "Frederick Winslow Taylor, Henri Fayol, Max Weber",
    focus: "Time-and-motion efficiency, standard operating procedures (SOPs), hierarchical authority, and scalar chains.",
    quickCommerceExample: "Algorithmic rider dispatch, 3-minute picking target per dark store worker, standardized shelf barcode racks.",
    color: "cyan",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
  },
  behavioral: {
    id: "behavioral",
    name: "Behavioral Approach",
    thinkers: "Elton Mayo (Hawthorne Studies), Mary Parker Follett, Herbert Simon",
    focus: "Worker motivation, human relations, informal groups, cognitive bounded rationality, and consumer emotions.",
    quickCommerceExample: "Rider burnout incentives, rest hubs in extreme heat waves, gamified tipping UI, emotional brand campaigns.",
    color: "pink",
    badgeClass: "bg-pink-500/20 text-pink-300 border-pink-500/40"
  },
  systems: {
    id: "systems",
    name: "Systems Theory",
    thinkers: "Ludwig von Bertalanffy, Daniel Katz, Robert Kahn",
    focus: "Open systems, input-throughput-output feedback loops, interdependency with macroeconomic and regulatory environments.",
    quickCommerceExample: "Integrating real-time FMCG manufacturer inventory feeds with dark-store replenishments and city traffic APIs.",
    color: "violet",
    badgeClass: "bg-violet-500/20 text-violet-300 border-violet-500/40"
  },
  contingency: {
    id: "contingency",
    name: "Contingency Theory",
    thinkers: "Fred Fiedler, Paul Lawrence, Jay Lorsch, Burns & Stalker",
    focus: "No single best way to organize (it depends). Fit between environmental uncertainty, organic structure, and strategy.",
    quickCommerceExample: "Switching from decentralized fast-expansion mode during bull markets to centralized cost-control during funding winters.",
    color: "amber",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  }
};

export const POSDCORB_FUNCTIONS = {
  P: {
    code: "P",
    name: "Planning",
    definition: "Working out in broad outline the things that need to be done and methods for doing them.",
    qcApplication: "Dark store location mapping, AI demand forecasting, festive surge stocking.",
    color: "#8b5cf6"
  },
  O: {
    code: "O",
    name: "Organizing",
    definition: "Establishing the formal structure of authority through which work subdivisions are arranged.",
    qcApplication: "Dividing corporate HQ, city operational clusters, and local dark store picker teams.",
    color: "#06b6d4"
  },
  S: {
    code: "S",
    name: "Staffing",
    definition: "The whole personnel function of bringing in and training the staff.",
    qcApplication: "Onboarding 50k+ gig riders, hiring warehouse pickers, automated Aadhaar KYC verification.",
    color: "#10b981"
  },
  D: {
    code: "D",
    name: "Directing",
    definition: "Continuous task of making decisions and embodying them in specific and general orders.",
    qcApplication: "Algorithmically issuing real-time batch orders, dynamic ETAs, and rider routing.",
    color: "#f59e0b"
  },
  CO: {
    code: "CO",
    name: "Coordinating",
    definition: "All important duty of interrelating the various parts of the work.",
    qcApplication: "Synchronizing dark store inwarding with FMCG supplier delivery trucks and rider pickup arrival.",
    color: "#ec4899"
  },
  R: {
    code: "R",
    name: "Reporting",
    definition: "Keeping those to whom the executive is responsible informed as to what is going on.",
    qcApplication: "Real-time dashboards for Dark Store P&L, stockout percentage, order defect rate, delivery SLA.",
    color: "#6366f1"
  },
  B: {
    code: "B",
    name: "Budgeting",
    definition: "All that goes with budgeting in the form of fiscal planning, accounting and control.",
    qcApplication: "Managing dark store capex (₹35L per store), rider surge payouts, customer discount burn.",
    color: "#ef4444"
  }
};

/**
 * Returns analytical synthesis connecting a shock or price decision to management theory
 * @param {string} eventType 
 * @param {Object} details 
 * @returns {Object} Tagged POSDCORB and management approach
 */
export function analyzeCaseTags(eventType, details = {}) {
  let primaryPosdcorb = ["P", "B"];
  let school = MANAGEMENT_SCHOOLS.contingency;

  if (eventType === 'PRICE_CUT') {
    primaryPosdcorb = ["D", "B"];
    school = MANAGEMENT_SCHOOLS.behavioral;
  } else if (eventType === 'DARK_STORE_EXPANSION') {
    primaryPosdcorb = ["P", "O", "B"];
    school = MANAGEMENT_SCHOOLS.classical;
  } else if (eventType === 'REGULATORY_SHOCK') {
    primaryPosdcorb = ["R", "B", "O"];
    school = MANAGEMENT_SCHOOLS.systems;
  }

  return {
    primaryPosdcorb: primaryPosdcorb.map(code => POSDCORB_FUNCTIONS[code]),
    managementSchool: school
  };
}

