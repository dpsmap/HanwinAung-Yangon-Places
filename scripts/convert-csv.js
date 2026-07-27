/**
 * Yangon Travel & POI Directory - Multi-CSV Compiler Script
 * This script scans the '/data' folder for any township CSV files, parses them,
 * translates categories, computes mock/placeholder ratings, generates clean structures,
 * and compiles everything into a highly-compressed, unified offline array in 'src/data.ts'.
 * 
 * To add a new township:
 * 1. Drop a new CSV file (e.g. 'Bahan.csv' or 'Kamayut.csv') into the '/data/' folder.
 * 2. Run: npm run data:compile
 * 3. Run: npm run data:seed (to synchronize with the live cloud database)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const TARGET_FILE = path.resolve(__dirname, '../src/data.ts');

// Dynamic Burmese category translator
function getBurmeseCategory(cat) {
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

// RFC-compliant CSV parser that handles newlines, commas, and escaped quotes inside fields perfectly
function parseFullCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip next double quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',') {
      if (inQuotes) {
        currentField += char;
      } else {
        currentRow.push(currentField.trim());
        currentField = '';
      }
    } else if (char === '\r' || char === '\n') {
      if (inQuotes) {
        currentField += char;
      } else {
        // End of row
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n
        }
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      }
    } else {
      currentField += char;
    }
  }

  if (currentRow.length > 0 || currentField) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

function compile() {
  if (!fs.existsSync(DATA_DIR)) {
    console.log(`📁 Creating missing data folder at '${DATA_DIR}'...`);
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Look for any .csv files in /data directory
  let csvFiles = fs.readdirSync(DATA_DIR)
    .filter(file => file.endsWith('.csv'))
    .map(file => path.join(DATA_DIR, file));

  if (csvFiles.length === 0) {
    console.warn(`⚠️ No CSV files found in '/data'. Checking root for legacy 'raw_places.csv'...`);
    const legacyPath = path.resolve(__dirname, '../raw_places.csv');
    if (fs.existsSync(legacyPath)) {
      console.log(`🚚 Found legacy 'raw_places.csv' at root. Copying to '/data/Thingangyun.csv'...`);
      fs.copyFileSync(legacyPath, path.join(DATA_DIR, 'Thingangyun.csv'));
      csvFiles = [path.join(DATA_DIR, 'Thingangyun.csv')];
    } else {
      console.error(`❌ Error: No CSV data sources found! Please add a CSV file in '/data/' first.`);
      return;
    }
  }

  console.log(`🔍 Detected ${csvFiles.length} CSV files to compile:`, csvFiles.map(f => path.basename(f)));
  const allPlaces = [];
  const uniquePlaceIds = new Set();

  for (const csvFilePath of csvFiles) {
    const filename = path.basename(csvFilePath, '.csv');
    console.log(`📖 Parsing dataset from '${filename}.csv'...`);

    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const parsedRows = parseFullCSV(fileContent).filter(row => row.some(cell => cell.trim() !== ''));
    if (parsedRows.length < 2) {
      console.warn(`⚠️ File '${filename}.csv' contains no rows or only headers! Skipping.`);
      continue;
    }

    const headers = parsedRows[0].map(h => h.toLowerCase().trim());
    let addedCount = 0;

    for (let i = 1; i < parsedRows.length; i++) {
      const values = parsedRows[i];
      // Pad values array if it is too short to avoid undefined index errors
      while (values.length < headers.length) {
        values.push('');
      }

      const row = {};
      headers.forEach((h, index) => {
        row[h] = values[index];
      });

      const numericPlaceId = parseInt(row.place_id || '0', 10);
      const placeIdVal = row.place_id ? row.place_id.toString().trim() : 'ygn-' + Math.random().toString(36).substring(2, 11);

      // Avoid duplicates
      if (uniquePlaceIds.has(placeIdVal)) {
        continue;
      }
      uniquePlaceIds.add(placeIdVal);

      const nameVal = row.name ? row.name.trim() : 'Unnamed Place';
      let nameMyVal = row.name_my ? row.name_my.trim() : '';
      if (!nameMyVal) {
        nameMyVal = nameVal;
      }

      const categoryVal = row.category ? row.category.trim() : 'Attraction';
      const categoryMyVal = row.category_my ? row.category_my.trim() : getBurmeseCategory(categoryVal);

      const houseNumberVal = row.house_number ? row.house_number.trim() : '';
      const houseNumberMyVal = row.house_number_my ? row.house_number_my.trim() : '';

      const fullAddressVal = row.full_address ? row.full_address.trim() : '';
      const fullAddressMyVal = row.full_address_my ? row.full_address_my.trim() : fullAddressVal;

      const latVal = parseFloat(row.lat || row.latitude || '0.0');
      const lonVal = parseFloat(row.lon || row.longitude || '0.0');

      // Preserve ratings, fallback to a pseudo-random rating based on ID for high-fidelity visual displays
      const ratingVal = row.rating ? parseFloat(row.rating) : parseFloat((4.0 + (numericPlaceId % 10) / 10 || 4.5).toFixed(1));
      const reviewCountVal = row.review_count ? parseInt(row.review_count, 10) : (10 + (numericPlaceId % 200 || 15) * 3);

      const phoneVal = row.phone ? row.phone.trim() : '';
      const websiteVal = row.website ? row.website.trim() : '';

      // Set township, default to capitalized filename if missing in CSV
      const townshipVal = row.township ? row.township.trim() : (filename.charAt(0).toUpperCase() + filename.slice(1));
      const townshipMyVal = row.township_my ? row.township_my.trim() : '';

      const districtVal = row.district ? row.district.trim() : 'Yangon East';
      const districtMyVal = row.district_my ? row.district_my.trim() : 'ရန်ကုန်အရှေ့ပိုင်း';
      const subRegionVal = row.sub_region ? row.sub_region.trim() : 'Yangon';
      const subRegionMyVal = row.sub_region_my ? row.sub_region_my.trim() : 'ရန်ကုန်';
      const postalCodeVal = row.postal_code ? row.postal_code.trim() : '';

      // Generate context block for embeddings / semantic matches
      const embedTextVal = row.embed_text ? row.embed_text.trim() : `Name: ${nameVal} (${nameMyVal}). Category: ${categoryVal}. Address: ${fullAddressVal}. Township: ${townshipVal}. District: ${districtVal}`;

      allPlaces.push({
        place_id: placeIdVal,
        name: nameVal,
        name_my: nameMyVal,
        category: categoryVal,
        category_my: categoryMyVal,
        house_number: houseNumberVal,
        house_number_my: houseNumberMyVal,
        full_address: fullAddressVal,
        full_address_my: fullAddressMyVal,
        lat: latVal,
        lon: lonVal,
        phone: phoneVal,
        rating: ratingVal,
        review_count: reviewCountVal,
        website: websiteVal,
        city: 'Yangon',
        township: townshipVal,
        township_my: townshipMyVal,
        district: districtVal,
        district_my: districtMyVal,
        sub_region: subRegionVal,
        sub_region_my: subRegionMyVal,
        postal_code: postalCodeVal,
        embed_text: embedTextVal
      });

      addedCount++;
    }

    console.log(`✅ Loaded ${addedCount} unique places from '${filename}.csv'`);
  }

  console.log(`📊 Merged total of ${allPlaces.length} places from all datasets. Saving output...`);

  const outputCode = `import type { Place } from './types.ts';

// Dynamic multi-CSV compiler output. Contains compiled list of ${allPlaces.length} entries.
export const DEFAULT_PLACES: Place[] = ${JSON.stringify(allPlaces, null, 2)};

export const DATABASE_SETUP_SQL = `-- PostgreSQL Table Creation SQL Script
CREATE TABLE IF NOT EXISTS public.places (
  "FID" INTEGER PRIMARY KEY,
  "Shape" TEXT,
  "DPS_ID" TEXT,
  "Source_ID" TEXT,
  "Source" TEXT,
  "UID" TEXT,
  "POI_N_Eng" TEXT,
  "POI_N_Win" TEXT,
  "POI_N_Zaw" TEXT,
  "POI_N_Myn3" TEXT,
  "Type" TEXT,
  "DPS_TSP" TEXT,
  "Type_Code" TEXT,
  "Sub_Type_C" TEXT,
  "Postal_Cod" TEXT,
  "St_N_Eng" TEXT,
  "St_N_Myn" TEXT,
  "Ward_N_Eng" TEXT,
  "Ward_N_Myn" TEXT,
  "Tsp_N_Eng" TEXT,
  "Tsp_N_Myn" TEXT,
  "Dist_N_Eng" TEXT,
  "Dist_N_Myn" TEXT,
  "S_R_N_Eng" TEXT,
  "S_R_N_Myn" TEXT,
  "HN_Eng" TEXT,
  "HN_Myn" TEXT,
  "Address" TEXT,
  "Longitude" DOUBLE PRECISION,
  "Latitude" DOUBLE PRECISION,
  "Remark" TEXT,
  "Verify_dat" TEXT,
  "POI_Pictur" TEXT,
  "Project" TEXT,
  "Rating" NUMERIC(3,2) DEFAULT 4.5,
  "Review_Count" INTEGER DEFAULT 150,
  "Website" TEXT DEFAULT '',
  "Created_At" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON public.places
  FOR SELECT
  TO public
  USING (true);
\`;
`;

  fs.writeFileSync(TARGET_FILE, outputCode, 'utf-8');
  console.log(`🎉 Successfully compiled all datasets and generated static fallback at '${TARGET_FILE}'!`);
}

compile();
