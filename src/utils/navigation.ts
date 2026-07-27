import { RouteInfo } from '../types';
import { TOWNSHIPS_MAP } from './search';

/**
 * Calculates the Haversine distance between two points on the map.
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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
 * Finds the nearest township in TOWNSHIPS_MAP for a given coordinate.
 */
export function findNearestTownship(lat: number, lon: number) {
  let minDistance = Infinity;
  let nearest = TOWNSHIPS_MAP[0];
  for (const t of TOWNSHIPS_MAP) {
    const dist = calculateHaversineDistance(lat, lon, t.lat, t.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = t;
    }
  }
  return nearest;
}

/**
 * Returns a major street for a township.
 */
export function getMajorStreetForTownship(townshipName: string): { en: string; my: string } {
  const name = townshipName.toLowerCase();
  if (name.includes('bahan')) {
    return { en: 'Kaba Aye Pagoda Road', my: 'ကမ္ဘာအေးဘုရားလမ်း' };
  }
  if (name.includes('dagon') && !name.includes('dagon new') && !name.includes('dagon s') && !name.includes('east dagon') && !name.includes('north dagon') && !name.includes('south dagon')) {
    return { en: 'U Wisara Road', my: 'ဦးဝိစာရလမ်း' };
  }
  if (name.includes('kamayut') || name.includes('hlaing')) {
    return { en: 'Pyay Road', my: 'ပြည်လမ်း' };
  }
  if (name.includes('sanchaung')) {
    return { en: 'Pyay Road', my: 'ပြည်လမ်း' };
  }
  if (name.includes('kyauktada') || name.includes('pabedan') || name.includes('latha') || name.includes('lanmadaw')) {
    return { en: 'Maha Bandula Road', my: 'မဟာဗန္ဓုလလမ်း' };
  }
  if (name.includes('botataung') || name.includes('pazundaung')) {
    return { en: 'Anawrahta Road', my: 'အနော်ရထာလမ်း' };
  }
  if (name.includes('yankin') || name.includes('tamwe')) {
    return { en: 'Kaba Aye Pagoda Road', my: 'ကမ္ဘာအေးဘုရားလမ်း' };
  }
  if (name.includes('thingangyun')) {
    return { en: 'Lay Daung Kan Road', my: 'လေးထောင့်ကန်လမ်း' };
  }
  if (name.includes('dagon') || name.includes('seikkan')) {
    return { en: 'Pyidaungsu Road', my: 'ပြည်ထောင်စုလမ်းမကြီး' };
  }
  if (name.includes('mayangone')) {
    return { en: 'Pyay Road', my: 'ပြည်လမ်း' };
  }
  if (name.includes('insein')) {
    return { en: 'Insein Road', my: 'အင်းစိန်လမ်း' };
  }
  return { en: 'Maha Bandula Road', my: 'မဟာဗန္ဓုလလမ်း' };
}

/**
 * Computes the bearing/direction between two coordinate points.
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): { en: string; my: string } {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  const normalizedBrng = (brng + 360) % 360;
  
  if (normalizedBrng >= 337.5 || normalizedBrng < 22.5) {
    return { en: 'North', my: 'မြောက်ဘက်' };
  }
  if (normalizedBrng >= 22.5 && normalizedBrng < 67.5) {
    return { en: 'Northeast', my: 'အရှေ့မြောက်ဘက်' };
  }
  if (normalizedBrng >= 67.5 && normalizedBrng < 112.5) {
    return { en: 'East', my: 'အရှေ့ဘက်' };
  }
  if (normalizedBrng >= 112.5 && normalizedBrng < 157.5) {
    return { en: 'Southeast', my: 'အရှေ့တောင်ဘက်' };
  }
  if (normalizedBrng >= 157.5 && normalizedBrng < 202.5) {
    return { en: 'South', my: 'တောင်ဘက်' };
  }
  if (normalizedBrng >= 202.5 && normalizedBrng < 247.5) {
    return { en: 'Southwest', my: 'အနောက်တောင်ဘက်' };
  }
  if (normalizedBrng >= 247.5 && normalizedBrng < 292.5) {
    return { en: 'West', my: 'အနောက်ဘက်' };
  }
  return { en: 'Northwest', my: 'အနောက်မြောက်ဘက်' };
}

/**
 * Generates an interesting, realistic street-grid path for navigation.
 * Uses real-world road network via Open Source Routing Machine (OSRM),
 * and falls back gracefully to a clean mathematical street-grid estimation on failure.
 */
export async function generateRouteInfo(
  startName: string,
  start: [number, number],
  endName: string,
  end: [number, number]
): Promise<RouteInfo> {
  const [lat1, lon1] = start;
  const [lat2, lon2] = end;

  // Haversine distance
  const straightDistance = calculateHaversineDistance(lat1, lon1, lat2, lon2);

  try {
    // Attempt to query public Open Source Routing Machine (OSRM) driving API
    // We add a 3-second timeout to make sure the app remains responsive even under poor connection conditions
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const routeData = data.routes[0];
        const distanceKm = Number((routeData.distance / 1000).toFixed(2));
        const durationMin = Math.max(1, Math.round(routeData.duration / 60));
        
        // Convert [lon, lat] from GeoJSON coordinates back to [lat, lon] for Leaflet compatibility
        const path = routeData.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);

        return {
          startName,
          startCoords: start,
          endName,
          endCoords: end,
          distanceKm,
          durationMin,
          path
        };
      }
    }
  } catch (error) {
    console.warn('OSRM routing query failed or timed out. Falling back to street-grid approximation.', error);
  }
  
  // Real street distance is typical 1.3 - 1.4 times straight-line distance due to grid layouts
  const distanceKm = Number((straightDistance * 1.34).toFixed(2));
  
  // Standard transit speeds: 35 km/h driving, 5 km/h walking
  // Let's assume average city driving speed is 22 km/h (including traffic lights)
  const durationMin = Math.max(1, Math.round((distanceKm / 22) * 60));

  // Generate a multi-point street grid route path (5 points)
  const path: [number, number][] = [
    [lat1, lon1] // Point 1: Start
  ];

  // Intermediary street junctions (staircase grid points)
  const midLat1 = lat1 + (lat2 - lat1) * 0.35;
  const midLon1 = lon1; // Turn point 1

  const midLat2 = lat1 + (lat2 - lat1) * 0.35;
  const midLon2 = lon1 + (lon2 - lon1) * 0.7; // Turn point 2

  const midLat3 = lat2;
  const midLon3 = lon1 + (lon2 - lon1) * 0.7; // Turn point 3

  path.push([midLat1, midLon1]);
  path.push([midLat2, midLon2]);
  path.push([midLat3, midLon3]);
  path.push([lat2, lon2]); // Point 5: Destination

  return {
    startName,
    startCoords: start,
    endName,
    endCoords: end,
    distanceKm,
    durationMin,
    path
  };
}

/**
 * Returns detailed, localized navigation directions based on a start & end point.
 */
export interface DirectionStep {
  textEn: string;
  textMy: string;
}

export function generateNavigationSteps(
  startName: string,
  endName: string,
  distanceKm: number,
  startCoords?: [number, number],
  endCoords?: [number, number]
): DirectionStep[] {
  const steps: DirectionStep[] = [];

  // Default coordinate fallbacks if not provided (approx center)
  const sLat = startCoords ? startCoords[0] : 16.7828;
  const sLon = startCoords ? startCoords[1] : 96.1614;
  const eLat = endCoords ? endCoords[0] : 16.7983;
  const eLon = endCoords ? endCoords[1] : 96.1492;

  const startTownship = findNearestTownship(sLat, sLon);
  const endTownship = findNearestTownship(eLat, eLon);

  const startStreet = getMajorStreetForTownship(startTownship.en);
  const endStreet = getMajorStreetForTownship(endTownship.en);

  const bearing = calculateBearing(sLat, sLon, eLat, eLon);

  // Step 1: Departure
  steps.push({
    textEn: `Depart from ${startName} in the ${startTownship.en} area. Head ${bearing.en} onto ${startStreet.en}.`,
    textMy: `${startTownship.my}နယ်မြေအတွင်းရှိ ${startName} မှ စတင်ထွက်ခွာပါ။ ${startStreet.my}အတိုင်း ${bearing.my}သို့ ဦးတည်မောင်းနှင်ပါ။`
  });

  // Step 2: Main straight
  const mainDist = Math.max(0.4, Number((distanceKm * 0.35).toFixed(1)));
  steps.push({
    textEn: `Continue straight along ${startStreet.en} for ${mainDist} km. Keep inside lane.`,
    textMy: `${startStreet.my}တစ်လျှောက် ${mainDist} ကီလိုမီတာ တည့်တည့်မောင်းနှင်ပါ။ ဝဲဘက်ယာဉ်ကြောကို ထိန်းမောင်းပါ။`
  });

  // Step 3: Turn transition
  const turnRight = (sLon < eLon); // simple dynamic heuristic
  const turnDirEn = turnRight ? 'right' : 'left';
  const turnDirMy = turnRight ? 'ညာဘက်' : 'ဘယ်ဘက်';

  if (startTownship.en !== endTownship.en) {
    steps.push({
      textEn: `Turn ${turnDirEn} at the junction to transition from ${startTownship.en} toward ${endTownship.en} Township boundary.`,
      textMy: `လမ်းဆုံတွင် ${turnDirMy}သို့ကွေ့ပြီး ${startTownship.my}မြို့နယ်မှ ${endTownship.my}မြို့နယ်နယ်နိမိတ်သို့ ကူးပြောင်းမောင်းနှင်ပါ။`
    });
  } else {
    steps.push({
      textEn: `Turn ${turnDirEn} to stay on route within ${startTownship.en} neighborhood lanes.`,
      textMy: `လမ်းညွှန်အတိုင်း ${turnDirMy}သို့ကွေ့ပြီး ${startTownship.my}မြို့နယ်အတွင်းရှိ ရပ်ကွက်ချင်းဆက်လမ်းများသို့ ဝင်ပါ။`
    });
  }

  // Step 4: Final stretch approach
  const finalDist = Math.max(0.2, Number((distanceKm * 0.25).toFixed(1)));
  steps.push({
    textEn: `Merge onto ${endStreet.en} and continue for ${finalDist} km. Look out for destination signs.`,
    textMy: `${endStreet.my}သို့ ပေါင်းစည်းပြီး ${finalDist} ကီလိုမီတာ ဆက်လက်မောင်းနှင်ပါ။ လမ်းညွှန် ဆိုင်းဘုတ်များကို သတိပြုပါ။`
  });

  // Step 5: Arrival
  const sideRight = (sLat < eLat); // simple dynamic heuristic
  const sideEn = sideRight ? 'right' : 'left';
  const sideMy = sideRight ? 'ညာဘက်' : 'ဘယ်ဘက်';

  steps.push({
    textEn: `Arrive at ${endName} in ${endTownship.en} Township. The destination is on your ${sideEn} hand side.`,
    textMy: `${endTownship.my}မြို့နယ်ရှိ ${endName} သို့ ဆိုက်ရောက်ပါပြီ။ သင်သွားလိုသောပန်းတိုင်ကို သင့်${sideMy}ခြမ်းတွင် တွေ့ရပါမည်။`
  });

  return steps;
}
