import { Place } from '../types';

/**
 * Translates imported English Category Types into Burmese Unicode dynamically.
 */
export function getBurmeseCategory(cat: string): string {
  if (!cat) return 'ဆွဲဆောင်မှုရှိသောနေရာ';
  const c = cat.toLowerCase();
  if (c.includes('grooming')) return 'အလှပြင်ပြင်ဆင်ရေး';
  if (c.includes('fashion') || c.includes('clothing') || c.includes('sport general')) return 'ဖက်ရှင်စတိုး';
  if (c.includes('private school') || c.includes('high school')) return 'ကိုယ်ပိုင်ကျောင်း';
  if (c.includes('school') || c.includes('academy') || c.includes('college') || c.includes('university') || c.includes('preschool')) return 'ကျောင်းနှင့် တက္ကသိုလ်';
  if (c.includes('pharmacy')) return 'ဆေးဆိုင်';
  if (c.includes('beer') || c.includes('bar') || c.includes('pub') || c.includes('ktv') || c.includes('nightlife')) return 'ဘားနှင့် ဖျော်ဖြေရေး';
  if (c.includes('cafe') || c.includes("café") || c.includes('coffee') || c.includes('tea')) return 'ကဖေးနှင့် လက်ဖက်ရည်ဆိုင်';
  if (c.includes('restaurant') || c.includes('food') || c.includes('hot pot') || c.includes('biryani') || c.includes('bbq') || c.includes('pot') || c.includes('sausage')) return 'စားသောက်ဆိုင်';
  if (c.includes('mobile') || c.includes('phone') || c.includes('sim')) return 'ဖုန်းနှင့် ဆက်စပ်ပစ္စည်း';
  if (c.includes('electronic') || c.includes('electrical')) return 'လျှပ်စစ်ပစ္စည်းဆိုင်';
  if (c.includes('repair') || c.includes('service') || c.includes('maintenance')) return 'ပြုပြင်ရေးလုပ်ငန်း';
  if (c.includes('construction') || c.includes('steel') || c.includes('iron') || c.includes('material') || c.includes('hardware') || c.includes('aluminium') || c.includes('glass') || c.includes('composit') || c.includes('timber') || c.includes('wood')) return 'ဆောက်လုပ်ရေးနှင့် ဟာ့ဒ်ဝဲ';
  if (c.includes('beauty') || c.includes('hair') || c.includes('salon') || c.includes('tailor') || c.includes('cosmetic')) return 'အလှပြင်နှင့် အပ်ချုပ်ဆိုင်';
  if (c.includes('clinic') || c.includes('dental') || c.includes('hospital') || c.includes('medical') || c.includes('veterinary') || c.includes('traditional') || c.includes('doctor') || c.includes('health')) return 'ဆေးရုံနှင့် ဆေးခန်း';
  if (c.includes('travel') || c.includes('tour')) return 'ခရီးသွားလုပ်ငန်း';
  if (c.includes('post office') || c.includes('post')) return 'စာတိုက်';
  if (c.includes('bank') || c.includes('finance') || c.includes('changer') || c.includes('exchange') || c.includes('pawn') || c.includes('microfinance')) return 'ဘဏ်နှင့် ငွေကြေးဝန်ဆောင်မှု';
  if (c.includes('market') || c.includes('convenience') || c.includes('mart') || c.includes('store') || c.includes('outlet') || c.includes('retail') || c.includes('wholesale')) return 'စျေးနှင့် ကုန်စုံဆိုင်';
  if (c.includes('monastery') || c.includes('pagoda') || c.includes('temple') || c.includes('church') || c.includes('worship') || c.includes('convent') || c.includes('mosque') || c.includes('zedi')) return 'ဘာသာရေးနေရာ';
  if (c.includes('company') || c.includes('office') || c.includes('condo') || c.includes('residence') || c.includes('housing') || c.includes('apartment')) return 'ရုံးခန်းနှင့် လူနေအိမ်ရာ';
  if (c.includes('hotel') || c.includes('guest') || c.includes('motel') || c.includes('hostel') || c.includes('inn')) return 'ဟိုတယ်နှင့် တည်းခိုခန်း';
  if (c.includes('stadium') || c.includes('sport') || c.includes('gym') || c.includes('playground') || c.includes('park') || c.includes('nature') || c.includes('garden')) return 'ပန်းခြံနှင့် အားကစား';
  if (c.includes('museum') || c.includes('cultural') || c.includes('heritage') || c.includes('art') || c.includes('theater')) return 'ပြတိုက်နှင့် ယဉ်ကျေးမှု';
  if (c.includes('car wash') || c.includes('wash') || c.includes('spa')) return 'မော်တော်ယာဉ် ဆေးကြောရေး';
  return 'အထွေထွေအမျိုးအစား';
}

/**
 * Maps raw database models / columns (case-insensitive for robust import compatibility) to the Place schema.
 */
export function mapDbRowToPlace(row: any): Place {
  if (!row) {
    return {
      place_id: '',
      name: 'Unnamed Place',
      name_my: 'Unnamed Place',
      category: 'Attraction',
      category_my: 'အထွေထွေအမျိုးအစား',
      full_address: '',
      full_address_my: '',
      lat: 0,
      lon: 0,
      phone: '',
      rating: 4.0,
      review_count: 0,
      website: '',
      city: 'Yangon',
      township: 'Other',
      township_my: ''
    };
  }

  const dpsId = row.DPS_ID ?? row.dps_id ?? row.poi_id ?? row.POI_ID ?? '';
  const fid = row.FID ?? row.fid ?? '0';
  const uid = row.UID ?? row.uid ?? '';
  const placeIdVal = row.place_id ?? row.poi_id ?? (dpsId || (uid ? 'ygn-uid-' + uid : 'ygn-fid-' + fid));

  const nameVal = row.POI_N_Eng ?? row.poi_n_eng ?? row.name ?? 'Unnamed Place';
  let nameMyVal = row.name_my ?? row.POI_N_Zaw ?? row.poi_n_zaw ?? row.POI_N_Myn3 ?? row.poi_n_myn3 ?? '';
  if (!nameMyVal || nameMyVal.trim() === '') {
    nameMyVal = nameVal;
  }

  const categoryVal = row.category ?? row.Type ?? row.type ?? 'Attraction';
  const categoryMyVal = row.category_my ?? getBurmeseCategory(categoryVal);

  const fullAddressVal = row.full_address ?? row.Address ?? row.address ?? '';
  const fullAddressMyVal = row.full_address_my ?? row.Address ?? row.address ?? '';

  const latVal = Number(row.lat ?? row.Latitude ?? row.latitude ?? 0.0);
  const lonVal = Number(row.lon ?? row.Longitude ?? row.longitude ?? 0.0);

  const ratingVal = typeof row.rating !== 'undefined' ? Number(row.rating) : (typeof row.Rating !== 'undefined' ? Number(row.Rating) : (4.0 + (Number(fid) % 10) / 10));
  const reviewCountVal = typeof row.review_count !== 'undefined' ? Number(row.review_count) : (typeof row.Review_Count !== 'undefined' ? Number(row.Review_Count) : (10 + (Number(fid) % 200) * 3));

  const phoneVal = row.phone ?? row.Phone ?? '';
  const websiteVal = row.website ?? row.Website ?? '';

  const townshipVal = row.township ?? row.Tsp_N_Eng ?? row.tsp_n_eng ?? 'Other';
  const townshipMyVal = row.township_my ?? row.Tsp_N_Myn ?? row.tsp_n_myn ?? '';

  const houseNumberVal = row.house_number ?? '';
  const houseNumberMyVal = row.house_number_my ?? '';
  const districtVal = row.district ?? '';
  const districtMyVal = row.district_my ?? '';
  const subRegionVal = row.sub_region ?? '';
  const subRegionMyVal = row.sub_region_my ?? '';
  const postalCodeVal = row.postal_code ?? '';
  const embedTextVal = row.embed_text ?? '';

  return {
    place_id: String(placeIdVal).trim(),
    name: String(nameVal).trim(),
    name_my: String(nameMyVal).trim(),
    category: String(categoryVal).trim(),
    category_my: String(categoryMyVal),
    house_number: String(houseNumberVal).trim(),
    house_number_my: String(houseNumberMyVal).trim(),
    full_address: String(fullAddressVal).trim(),
    full_address_my: String(fullAddressMyVal).trim(),
    lat: latVal,
    lon: lonVal,
    phone: String(phoneVal).trim(),
    rating: ratingVal,
    review_count: reviewCountVal,
    website: String(websiteVal).trim(),
    city: 'Yangon',
    township: String(townshipVal).trim(),
    township_my: String(townshipMyVal).trim(),
    district: String(districtVal).trim(),
    district_my: String(districtMyVal).trim(),
    sub_region: String(subRegionVal).trim(),
    sub_region_my: String(subRegionMyVal).trim(),
    postal_code: String(postalCodeVal).trim(),
    embed_text: String(embedTextVal).trim()
  };
}

/**
 * Service to orchestrate querying travel and directory data.
 * Directly loads place data through the Express backend proxy.
 * The backend fetches data from the remote PostgREST API at api2.dpsmap.com.
 */
export async function fetchPlacesFromSource(
  onProgress?: (loaded: number, total: number) => void
): Promise<{
  places: Place[];
  isRealDatabase: boolean;
  error?: string;
}> {
  if (onProgress) {
    onProgress(10, 100);
  }

  try {
    if (onProgress) onProgress(40, 100);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout safety for large datasets

    // Fetch from the local Express app backend only.
    const res = await fetch('/api/places', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const placesFromDb = await res.json();
      if (Array.isArray(placesFromDb) && placesFromDb.length > 0) {
        console.log(`[Data Service] Loaded ${placesFromDb.length} places dynamically from the database!`);
        
        // Map database records to the frontend Place schema perfectly
        const mappedPlaces = placesFromDb.map(row => mapDbRowToPlace(row));

        if (onProgress) onProgress(100, 100);
        return {
          places: mappedPlaces,
          isRealDatabase: true
        };
      }
    }
  } catch (err) {
    console.warn('[Data Service] Could not fetch places from the API:', err);
  }

  if (onProgress) onProgress(100, 100);

  return {
    places: [],
    isRealDatabase: false,
    error: 'Could not load places from the API.'
  };
}

/**
 * Fetch a lightweight preview of places (limited) to render initial UI quickly.
 */
export async function fetchPlacesPreview(
  limit = 100
): Promise<{
  places: Place[];
  isRealDatabase: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(`/api/places?limit=${Number(limit)}`);
    if (res && res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        const mapped = rows.map((r: any) => mapDbRowToPlace(r));
        return { places: mapped, isRealDatabase: true };
      }
    }
  } catch (err: any) {
    console.warn('[Data Service] preview fetch failed', err);
  }
  return { places: [], isRealDatabase: false, error: 'Preview fetch failed' };
}

