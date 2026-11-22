/**
 * Organizational Design & Structure Engine
 * Computes management layers, coordination cost, mechanistic vs organic continuum,
 * and generates hierarchical tree nodes for visualization.
 */

/**
 * Calculates organizational hierarchy metrics
 * @param {number} headcount - Total organizational headcount (e.g. 1000 - 10000)
 * @param {number} spanOfControl - Average number of direct reports per manager (e.g. 3 - 12)
 * @param {number} centralizationPercent - 0 (fully decentralized) to 100 (fully centralized)
 * @param {number} formalizationLevel - 1 (informal/ad-hoc) to 10 (strict standard operating procedures)
 * @returns {Object} Hierarchy metrics
 */
export function calculateOrgMetrics(headcount, spanOfControl, centralizationPercent, formalizationLevel) {
  const safeHeadcount = Math.max(10, headcount);
  const safeSpan = Math.max(2, spanOfControl);

  // Management layers = ceil( log_span(headcount) )
  const continuousLayers = Math.log(safeHeadcount) / Math.log(safeSpan);
  const managementLayers = Math.max(1, Math.ceil(continuousLayers));

  // Coordination Cost Index:
  // Increases with headcount, management layers, centralization, and formalization overhead
  const centralizationFactor = centralizationPercent / 100;
  const formalizationFactor = 0.5 + (formalizationLevel / 10);
  const rawCoordCost = (safeHeadcount * managementLayers * centralizationFactor * formalizationFactor) / 100;
  const coordinationCostIndex = Number(rawCoordCost.toFixed(1));

  // Mechanistic vs Organic Score: [0, 100]
  // 100 = Pure Mechanistic Bureaucracy (Weber/Taylor)
  // 0 = Pure Organic Agile Network (Burns & Stalker)
  const mechanisticScore = Math.min(100, Math.max(0, 
    Math.round((centralizationPercent * 0.55) + (formalizationLevel * 4.5))
  ));

  let orgType = 'Hybrid Matrix';
  let badgeColor = 'cyan';
  let managementSchool = 'Contingency Theory';

  if (mechanisticScore >= 65) {
    orgType = 'Mechanistic Bureaucracy';
    badgeColor = 'rose';
    managementSchool = 'Classical Management (Weber & Fayol)';
  } else if (mechanisticScore <= 45) {
    orgType = 'Organic Agile Network';
    badgeColor = 'lime';
    managementSchool = 'Behavioral & Systems Approach (Burns & Stalker)';
  }

  // Communication velocity index (1 to 10, drops with tall hierarchies and centralization)
  const communicationVelocity = Number(
    Math.max(1.5, Math.min(9.8, 11 - (managementLayers * 1.1) - (centralizationPercent * 0.04))).toFixed(1)
  );

  return {
    managementLayers,
    continuousLayers: Number(continuousLayers.toFixed(2)),
    coordinationCostIndex,
    mechanisticScore,
    orgType,
    badgeColor,
    managementSchool,
    communicationVelocity
  };
}

/**
 * Generates an interactive visual tree hierarchy based on calculated layers & span
 * @param {number} layers 
 * @param {number} span 
 * @param {string} companyName 
 * @returns {Object} Tree node hierarchy
 */
export function generateOrgTree(layers, span, companyName = "Quick Commerce Corp") {
  const layerTitles = [
    { title: "Executive Committee (C-Suite)", role: "Strategic Vision & Capital Allocation", icon: "Crown" },
    { title: "VP / Functional Leadership", role: "Supply Chain, Technology, Dark Store Ops", icon: "Shield" },
    { title: "Regional & City Directors", role: "City P&L, Real Estate Catchments, Expansion", icon: "Building" },
    { title: "Cluster Hub Managers", role: "Dark Store Network Health, SLA Adherence", icon: "MapPin" },
    { title: "Store Leads & Dispatch Supervisors", role: "Picking Speed, Inventory Inwarding", icon: "Boxes" },
    { title: "Field Operations & Gig Fleet Fleet", role: "10-Min Delivery Execution", icon: "Bike" }
  ];

  function buildNode(currentLevel, indexInLevel) {
    const meta = layerTitles[Math.min(currentLevel - 1, layerTitles.length - 1)];
    const node = {
      id: `L${currentLevel}_N${indexInLevel}`,
      name: currentLevel === 1 ? `${companyName} HQ` : `${meta.title.split(' ')[0]} #${indexInLevel + 1}`,
      title: meta.title,
      role: meta.role,
      level: currentLevel,
      children: []
    };

    if (currentLevel < layers) {
      // Display up to 3 child nodes visually to keep the UI clean, with indicator of full span
      const visibleChildren = Math.min(3, span);
      for (let i = 0; i < visibleChildren; i++) {
        node.children.push(buildNode(currentLevel + 1, i));
      }
      if (span > visibleChildren) {
        node.extraHiddenChildren = span - visibleChildren;
      }
    }

    return node;
  }

  return buildNode(1, 0);
}

