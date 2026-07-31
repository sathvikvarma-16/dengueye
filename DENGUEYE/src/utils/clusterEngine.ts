import { DiseaseCase, GISCluster, SMSAlertLog, WardInfo } from '../types';

/**
 * Calculates Haversine distance between two geographic coordinates in meters.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Evaluates disease cases to detect spatial-temporal GIS clusters within a given time window (e.g., 48 hours)
 * and radius threshold (e.g., 500 meters).
 */
export function detect48HourClusters(
  cases: DiseaseCase[],
  wards: WardInfo[],
  timeWindowHours = 48,
  radiusThresholdMeters = 500
): { clusters: GISCluster[]; newAlerts: SMSAlertLog[] } {
  const now = new Date();
  const timeLimit = new Date(now.getTime() - timeWindowHours * 60 * 60 * 1000);

  // 1. Filter active cases within the time window
  const recentCases = cases.filter(
    (c) => new Date(c.reportedAt) >= timeLimit && c.status !== 'Resolved'
  );

  const clusters: GISCluster[] = [];
  const newAlerts: SMSAlertLog[] = [];
  const processedCaseIds = new Set<string>();

  // 2. Spatial grouping algorithm
  for (let i = 0; i < recentCases.length; i++) {
    const primaryCase = recentCases[i];
    if (processedCaseIds.has(primaryCase.id)) continue;

    const currentGroup: DiseaseCase[] = [primaryCase];
    processedCaseIds.add(primaryCase.id);

    for (let j = 0; j < recentCases.length; j++) {
      if (i === j) continue;
      const secondaryCase = recentCases[j];
      if (processedCaseIds.has(secondaryCase.id)) continue;

      const dist = calculateHaversineDistance(
        primaryCase.lat,
        primaryCase.lng,
        secondaryCase.lat,
        secondaryCase.lng
      );

      if (dist <= radiusThresholdMeters) {
        currentGroup.push(secondaryCase);
        processedCaseIds.add(secondaryCase.id);
      }
    }

    // 3. Cluster classification
    const caseCount = currentGroup.length;
    // Calculate centroid
    const avgLat =
      currentGroup.reduce((acc, c) => acc + c.lat, 0) / caseCount;
    const avgLng =
      currentGroup.reduce((acc, c) => acc + c.lng, 0) / caseCount;

    // Determine primary disease in group
    const dengueCount = currentGroup.filter(c => c.disease === 'Dengue').length;
    const malariaCount = currentGroup.filter(c => c.disease === 'Malaria').length;
    const primaryDisease = dengueCount >= malariaCount ? 'Dengue' : 'Malaria';

    const ward = wards.find(w => w.id === primaryCase.wardId);
    const wardName = ward ? ward.name : primaryCase.wardName;

    // Determine cluster risk level based on 48h spatial rules
    let riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
    if (caseCount >= 3) {
      riskLevel = 'CRITICAL';
    } else if (caseCount === 2) {
      riskLevel = 'HIGH';
    } else {
      riskLevel = 'MODERATE';
    }

    const clusterCode = `CLUS-${wardName.substring(0, 3).toUpperCase()}-${Math.floor(
      10 + Math.random() * 90
    )}`;

    const cluster: GISCluster = {
      id: `cluster-${primaryCase.id}`,
      clusterCode: clusterCode,
      wardId: primaryCase.wardId,
      wardName: wardName,
      centerLat: avgLat,
      centerLng: avgLng,
      caseIds: currentGroup.map((c) => c.id),
      caseCount: caseCount,
      diseaseType: primaryDisease,
      radiusMeters: radiusThresholdMeters,
      detectedAt: new Date().toISOString(),
      firstReportAt: currentGroup[currentGroup.length - 1].reportedAt,
      latestReportAt: currentGroup[0].reportedAt,
      timeWindowHours: timeWindowHours,
      riskLevel: riskLevel,
      dispatchStatus: riskLevel === 'CRITICAL' ? 'Team Dispatched' : 'Pending Dispatch',
      assignedTeam: riskLevel === 'CRITICAL' ? `GVMC Fogging Team #${ward?.number || 1}` : undefined
    };

    clusters.push(cluster);

    // 4. Trigger automated 48H SMS notification for CRITICAL & HIGH clusters
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      const recipientName = ward ? ward.officerName : 'Public Health Supervisor';
      const recipientContact = ward ? ward.officerContact : '+91 94401 88200';

      const alertLog: SMSAlertLog = {
        id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        recipientRole: 'GVMC Public Health Officer',
        recipientName: recipientName,
        phoneNumber: recipientContact,
        messageText: `[48H DENGUEYE GIS ALERT] ${clusterCode}: ${riskLevel} ${primaryDisease} Cluster detected in ${wardName}. ${caseCount} cases within 500m in <48h window. Immediate thermal fogging & larval treatment required at Lat: ${avgLat.toFixed(4)}, Lng: ${avgLng.toFixed(4)}.`,
        status: 'DELIVERED',
        clusterCode: clusterCode
      };

      newAlerts.push(alertLog);
    }
  }

  return { clusters, newAlerts };
}
