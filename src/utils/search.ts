import { Place } from '../types';

export interface TownshipInfo {
  en: string;
  my: string;
  lat: number;
  lon: number;
}

export const TOWNSHIPS_MAP: TownshipInfo[] = [
  { en: 'Dagon', my: 'ဒဂုံ', lat: 16.7900, lon: 96.1500 },
  { en: 'Bahan', my: 'ဗဟန်း', lat: 16.8119, lon: 96.1554 },
  { en: 'Kamayut', my: 'ကမာရွတ်', lat: 16.8294, lon: 96.1264 },
  { en: 'Sanchaung', my: 'စမ်းချောင်း', lat: 16.8048, lon: 96.1325 },
  { en: 'Kyauktada', my: 'ကျောက်တံတား', lat: 16.7744, lon: 96.1595 },
  { en: 'Pabedan', my: 'ပန်းဘဲတန်း', lat: 16.7806, lon: 96.1558 },
  { en: 'Latha', my: 'လသာ', lat: 16.7761, lon: 96.1465 },
  { en: 'Lanmadaw', my: 'လမ်းမတော်', lat: 16.7792, lon: 96.1398 },
  { en: 'Mayangone', my: 'မရမ်းကုန်း', lat: 16.8680, lon: 96.1400 },
  { en: 'Hlaing', my: 'လှိုင်', lat: 16.8450, lon: 96.1250 },
  { en: 'Yankin', my: 'ရန်ကင်း', lat: 16.8322, lon: 96.1601 },
  { en: 'Tamwe', my: 'တာမွေ', lat: 16.8033, lon: 96.1764 },
  { en: 'Mingala Taungnyunt', my: 'မင်္ဂလာတောင်ညွန့်', lat: 16.7869, lon: 96.1685 },
  { en: 'Botataung', my: 'ဗိုလ်တထောင်', lat: 16.7681, lon: 96.1706 },
  { en: 'Pazundaung', my: 'ပုဇွန်တောင်', lat: 16.7874, lon: 96.1794 },
  { en: 'Seikkan', my: 'ဆိပ်ကမ်း', lat: 16.7680, lon: 96.1600 },
  { en: 'Insein', my: 'အင်းစိန်', lat: 16.8883, lon: 96.0967 },
  { en: 'North Okkalapa', my: 'မြောက်ဥက္ကလာပ', lat: 16.9100, lon: 96.1700 },
  { en: 'South Okkalapa', my: 'တောင်ဥက္ကလာပ', lat: 16.8600, lon: 96.1900 },
  { en: 'North Dagon', my: 'ဒဂုံမြို့သစ်မြောက်ပိုင်း', lat: 16.8900, lon: 96.2200 },
  { en: 'South Dagon', my: 'ဒဂုံမြို့သစ်တောင်ပိုင်း', lat: 16.8300, lon: 96.2200 },
  { en: 'East Dagon', my: 'ဒဂုံမြို့သစ်အရှေ့ပိုင်း', lat: 16.9200, lon: 96.2500 },
  { en: 'Dagon Seikkan', my: 'ဒဂုံမြို့သစ်ဆိပ်ကမ်း', lat: 16.8200, lon: 96.2600 },
  { en: 'Thaketa', my: 'သာကေတ', lat: 16.7951, lon: 96.2081 },
  { en: 'Dawbon', my: 'ဒေါပုံ', lat: 16.7831, lon: 96.1906 },
  { en: 'Thingangyun', my: 'သင်္ဃန်းကျွန်း', lat: 16.8183, lon: 96.1956 },
  { en: 'Ahlone', my: 'အလုံ', lat: 16.7905, lon: 96.1235 },
  { en: 'Kyimyindaing', my: 'ကြည့်မြင်တိုင်', lat: 16.8150, lon: 96.1158 }
];

// Pre-sorted by English-name length (longest first) so that compound township
// names like "North Dagon" / "Dagon Seikkan" are matched before the shorter
// "Dagon" substring/word match steals the hit. Built once at module load.
const TOWNSHIPS_MAP_BY_SPECIFICITY: TownshipInfo[] = [...TOWNSHIPS_MAP].sort(
  (a, b) => b.en.length - a.en.length
);

export const MYANGLISH_PAIRS: [string, string][] = [
  ['bayint', 'ဘုရင့်'],
  ['naung', 'နောင်'],
  ['kaba', 'ကမ္ဘာ'],
  ['parami', 'ပရမီ'],
  ['pyay', 'ပြည်'],
  ['dhamma', 'ဓမ္မ'],
  ['anawrahta', 'အနော်ရထာ'],
  ['mahabandula', 'မဟာဗန္ဓုလ'],
  ['waizayantar', 'ဝေဇယန္တာ'],
  ['waizayandar', 'ဝေဇယန္တာ'],
  ['gandamar', 'ဂန္ဓမာ'],
  ['aung', 'အောင်'],
  ['ko', 'ကို'],
  ['maung', 'မောင်'],
  ['kyaw', 'ကျော်'],
  ['lin', 'လင်း'],
  ['shwe', 'ရွှေ'],
  ['paya', 'ဘုရား'],
  ['phaya', 'ဘုရား'],
  ['pagoda', 'ဘုရား'],
  ['road', 'လမ်း'],
  ['street', 'လမ်း'],
  ['market', 'ဈေး']
];

export const MYANGLISH_ALIASES: { [key: string]: string } = {
  'hlaing': 'လှိုင်',
  'bahan': 'ဗဟန်း',
  'sanchaung': 'စမ်းချောင်း',
  'kamayut': 'ကမာရွတ်',
  'mayangone': 'မရမ်းကုန်း',
  'tamwe': 'တာမွေ',
  'yankin': 'ရန်ကင်း',
  'insein': 'အင်းစိန်',
  'kyauktada': 'ကျောက်တံတား',
  'dagon': 'ဒဂုံ',
  'shwedagon': 'ရွှေတိဂုံ',
  'paya': 'ဘုရား',
  'phaya': 'ဘုရား',
  'pagoda': 'ဘုရား',
  'pazundaung': 'ပုဇွန်တောင်',
  'botataung': 'ဗိုလ်တထောင်',
  'thingangyun': 'သင်္ဃန်းကျွန်း',
  'thaketa': 'သာကေတ',
  'kyimyindaing': 'ကြည့်မြင်တိုင်',
  'latha': 'လသာ',
  'lanmadaw': 'လမ်းမတော်',
  'pabedan': 'ပန်းဘဲတန်း',
  'dawbon': 'ဒေါပုံ',
  'ahlone': 'အလုံ',
  'mingalar': 'မင်္ဂလာ',
  'paramee': 'ပရမီ',
  'parami': 'ပရမီ',
  'pyay': 'ပြည်',
  'kaba': 'ကမ္ဘာ',
  'kabaye': 'ကမ္ဘာအေး',
  'aye': 'အေး',
  'gandamar': 'ဂန္ဓမာ',
  'shwe': 'ရွှေ',
  'aung': 'အောင်',
  'road': 'လမ်း',
  'street': 'လမ်း',
  'market': 'ဈေး',
  'mall': 'မောလ်',
  'hospital': 'ဆေးရုံ',
  'clinic': 'ဆေးခန်း',
  'restaurant': 'စားသောက်ဆိုင်',
  'cafe': 'ကဖေး',
  'coffee': 'ကော်ဖီ',
  'hotel': 'ဟိုတယ်',
  'school': 'ကျောင်း',
  'university': 'တက္ကသိုလ်',
  'bank': 'ဘဏ်',
  'atm': 'အေတီအမ်'
};

export function normalizeDigits(text: string): string {
  if (!text) return '';
  const myToEn: { [key: string]: string } = {
    '၀': '0', '၁': '1', '၂': '2', '၃': '3', '၄': '4',
    '၅': '5', '၆': '6', '၇': '7', '၈': '8', '၉': '9'
  };
  return text.split('').map(char => myToEn[char] || char).join('');
}

export function toBurmeseDigits(text: string): string {
  if (!text) return '';
  const enToMy: { [key: string]: string } = {
    '0': '၀', '1': '၁', '2': '၂', '3': '၃', '4': '၄',
    '5': '၅', '6': '၆', '7': '၇', '8': '၈', '9': '၉'
  };
  return text.split('').map(char => enToMy[char] || char).join('');
}

export function romanize(text: string): string {
  if (!text) return '';
  let result = text.toLowerCase();
  
  const wordsMap: { [key: string]: string } = {
    'ရွှေ': 'shwe', 'ဘုရား': 'paya', 'လမ်း': 'road', 'ဈေး': 'market',
    'အောင်': 'aung', 'မင်္ဂလာ': 'mingalar', 'ပြည်': 'pyay', 'ကမ္ဘာ': 'kaba',
    'အေး': 'aye', 'သာ': 'thar', 'လှိုင်': 'hlaing', 'ဗဟန်း': 'bahan',
    'စမ်းချောင်း': 'sanchaung', 'ကမာရွတ်': 'kamayut', 'မရမ်းကုန်း': 'mayangone',
    'ရန်ကင်း': 'yankin', 'တာမွေ': 'tamwe', 'အင်းစိန်': 'insein', 'ဒဂုံ': 'dagon',
    'ကျောက်တံတား': 'kyauktada', 'ပန်းဘဲတန်း': 'pabedan', 'လသာ': 'latha',
    'လမ်းမတော်': 'lanmadaw', 'ဗိုလ်တထောင်': 'botataung', 'ပုဇွန်တောင်': 'pazundaung',
    'သင်္ဃန်းကျွန်း': 'thingangyun', 'သာကေတ': 'thaketa', 'ဒေါပုံ': 'dawbon',
    'အလုံ': 'ahlone', 'ကြည့်မြင်တိုင်': 'kyimyindaing', 'မြို့နယ်': 'township',
    'တံတား': 'tada', 'မဟာ': 'maha', 'ဗန္ဓုလ': 'bandula', 'အနော်ရထာ': 'anawrahta',
    'မိုး': 'moe', 'စိန်': 'sein', 'ထွန်း': 'htun', 'ဦး': 'u', 'ဒေါ်': 'daw',
    'ကို': 'ko', 'မောင်': 'maung', 'ကျော်': 'kyaw', 'လင်း': 'lin'
  };

  const sortedWords = Object.entries(wordsMap).sort((a, b) => b[0].length - a[0].length);
  for (const [my, en] of sortedWords) {
    result = result.replace(new RegExp(my, 'g'), ' ' + en + ' ');
  }

  const clusterMap: [RegExp, string][] = [
    [/ကျ/g, 'kya'], [/ကြ/g, 'kya'], [/ချ/g, 'cha'], [/ခြ/g, 'cha'],
    [/ဂျ/g, 'gya'], [/ငြ/g, 'nyar'], [/ငျ/g, 'nya'], [/ညွ/g, 'nyun'],
    [/ပျ/g, 'pya'], [/ပြ/g, 'pya'], [/ဖျ/g, 'hpya'], [/ဖြ/g, 'hpya'],
    [/ဗျ/g, 'bya'], [/ဗြ/g, 'bya'], [/မျ/g, 'mya'], [/မြ/g, 'mya'],
    [/လွ/g, 'lwa'], [/ရွှ/g, 'shwe'], [/နွ/g, 'nwa'], [/ထွ/g, 'htun'],
    [/စွ/g, 'swa'], [/ဆွ/g, 'hswa'], [/ဇွ/g, 'zwa'], [/တွ/g, 'twa'],
    [/ထွ/g, 'htwa'], [/ဒွ/g, 'dwa'], [/နွ/g, 'nwa'], [/ပွ/g, 'pwa'],
    [/ဖွ/g, 'hpwa'], [/ဘွ/g, 'bwa'], [/မွ/g, 'mwa'], [/ယွ/g, 'ywa'],
    [/ရွ/g, 'rwa'], [/လွ/g, 'lwa'], [/သွ/g, 'thwa'], [/ဟွ/g, 'hwa'],
    [/သျှ/g, 'shwe'], [/လျှ/g, 'hlya']
  ];

  clusterMap.forEach(([regex, replacement]) => {
    result = result.replace(regex, replacement);
  });

  const syllableMap: [RegExp, string][] = [
    [/အောင်/g, 'aung'], [/အောငျ/g, 'aung'], [/ဉ္စ/g, 'nza'], [/ဥ္စ/g, 'nza'],
    [/င်/g, 'ing'], [/ဉ/g, 'ny'], [/ည်/g, 'yi'], [/ဏ/g, 'na'], [/တ/g, 'ta'],
    [/ထ/g, 'hta'], [/န/g, 'na'], [/ပ/g, 'pa'], [/ဖ/g, 'hpa'], [/ဗ/g, 'ba'],
    [/ဘ/g, 'ba'], [/မ/g, 'ma'], [/ယ/g, 'ya'], [/ရ/g, 'ya'], [/လ/g, 'la'],
    [/ဝ/g, 'wa'], [/သ/g, 'tha'], [/ဟ/g, 'ha'], [/ဠ/g, 'la'], [/အ/g, 'a'],
    [/က/g, 'ka'], [/ခ/g, 'kha'], [/ဂ/g, 'ga'], [/င/g, 'nga'], [/စ/g, 'sa'],
    [/ဆ/g, 'hsa'], [/ဇ/g, 'za'], [/ည/g, 'nya'], [/ဍ/g, 'da'], [/ဌ/g, 'hta'],
    [/ဒ/g, 'da'], [/ဓ/g, 'da'], [/န/g, 'na'], [/ပ/g, 'pa'], [/ဖ/g, 'hpa'],
    [/ဗ/g, 'ba'], [/ဘ/g, 'ba'], [/မ/g, 'ma'], [/ယ/g, 'ya'], [/ရ/g, 'ya'],
    [/လ/g, 'la'], [/ဝ/g, 'wa'], [/သ/g, 'tha'], [/ဟ/g, 'ha'], [/ဠ/g, 'la'],
    [/အ/g, 'a']
  ];

  syllableMap.forEach(([regex, replacement]) => {
    result = result.replace(regex, replacement);
  });

  const vowelMap: [RegExp, string][] = [
    [/ေ/g, 'e'], [/ဲ/g, 'ae'], [/ာ/g, 'a'], [/ါ/g, 'a'],
    [/ိ/g, 'i'], [/ီ/g, 'i'], [/ု/g, 'u'], [/ူ/g, 'u'],
    [/ံ/g, 'an'], [/့/g, ''], [/း/g, ''], [/်/g, '']
  ];

  vowelMap.forEach(([regex, replacement]) => {
    result = result.replace(regex, replacement);
  });

  return result
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseMyanglishNumber(tokens: string[]): number | null {
  if (tokens.length === 0) return null;
  const cleanTokens = tokens.map(t => t.toLowerCase().trim()).filter(Boolean);
  if (cleanTokens.length === 0) return null;

  const digits: { [key: string]: number } = {
    'tit': 1, 'it': 1, 'ta': 1, 'one': 1,
    'nhit': 2, 'hnit': 2, 'nit': 2, 'two': 2,
    'thone': 3, 'thoun': 3, 'three': 3,
    'lay': 4, 'layy': 4, 'four': 4,
    'ngar': 5, 'nga': 5, 'five': 5,
    'chauk': 6, 'six': 6,
    'khun': 7, 'khunit': 7, 'seven': 7,
    'shit': 8, 'eight': 8,
    'ko': 9, 'nine': 9
  };

  const multipliers: { [key: string]: number } = {
    'sae': 10, 'hse': 10,
    'ya': 100,
    'htaung': 1000, 'taung': 1000
  };

  if (cleanTokens.length === 1) {
    const first = cleanTokens[0];
    if (digits[first] !== undefined) return digits[first];
    if (multipliers[first] !== undefined) return multipliers[first];
    return null;
  }

  let total = 0;
  let currentVal = 0;
  let hasParsedWord = false;

  for (let i = 0; i < cleanTokens.length; i++) {
    const token = cleanTokens[i];
    if (digits[token] !== undefined) {
      if (currentVal !== 0) {
        total += currentVal;
      }
      currentVal = digits[token];
      hasParsedWord = true;
    } else if (multipliers[token] !== undefined) {
      const mult = multipliers[token];
      if (currentVal === 0) {
        currentVal = 1;
      }
      total += currentVal * mult;
      currentVal = 0;
      hasParsedWord = true;
    } else {
      return null;
    }
  }

  total += currentVal;
  return hasParsedWord ? total : null;
}

export function parseEnglishNumber(tokens: string[]): number | null {
  if (tokens.length === 0) return null;
  const cleanTokens = tokens.map(t => t.toLowerCase().trim()).filter(Boolean);
  if (cleanTokens.length === 0) return null;

  const ones: { [key: string]: number } = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
    'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18,
    'nineteen': 19
  };

  const tens: { [key: string]: number } = {
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
  };

  const multipliers: { [key: string]: number } = {
    'hundred': 100,
    'thousand': 1000
  };

  let total = 0;
  let currentVal = 0;
  let hasParsedWord = false;

  for (let i = 0; i < cleanTokens.length; i++) {
    const token = cleanTokens[i].replace('-', '');
    
    if (ones[token] !== undefined) {
      currentVal += ones[token];
      hasParsedWord = true;
    } else if (tens[token] !== undefined) {
      currentVal += tens[token];
      hasParsedWord = true;
    } else if (multipliers[token] !== undefined) {
      const mult = multipliers[token];
      if (currentVal === 0) {
        currentVal = 1;
      }
      total += currentVal * mult;
      currentVal = 0;
      hasParsedWord = true;
    } else {
      let matchedCompound = false;
      for (const [tenStr, tenVal] of Object.entries(tens)) {
        if (token.startsWith(tenStr)) {
          const remainder = token.substring(tenStr.length);
          if (ones[remainder] !== undefined) {
            currentVal += tenVal + ones[remainder];
            hasParsedWord = true;
            matchedCompound = true;
            break;
          }
        }
      }
      if (!matchedCompound) {
        return null;
      }
    }
  }

  total += currentVal;
  return hasParsedWord ? total : null;
}

export function getEnglishNumberVariants(num: number): string[] {
  if (num < 0 || num >= 10000) return [];
  if (num === 0) return ['zero'];

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 
                 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const results = new Set<string>();

  function getWords(n: number): string[] {
    let parts: string[] = [];
    let tempNum = n;
    if (tempNum >= 1000) {
      const thousands = Math.floor(tempNum / 1000);
      parts.push(ones[thousands] + ' thousand');
      tempNum %= 1000;
    }
    if (tempNum >= 100) {
      const hundreds = Math.floor(tempNum / 100);
      parts.push(ones[hundreds] + ' hundred');
      tempNum %= 100;
    }
    if (tempNum > 0) {
      if (tempNum < 20) {
        parts.push(ones[tempNum]);
      } else {
        const t = Math.floor(tempNum / 10);
        const o = tempNum % 10;
        if (o > 0) {
          parts.push(tens[t] + '-' + ones[o]);
          parts.push(tens[t] + ' ' + ones[o]);
          return [parts.join(' '), parts.slice(0, -1).join(' ') + ' ' + tens[t] + '-' + ones[o]];
        } else {
          parts.push(tens[t]);
        }
      }
    }
    return [parts.join(' ')];
  }

  const wordsList = getWords(num);
  wordsList.forEach(w => results.add(w.toLowerCase()));
  return Array.from(results);
}

export function getMyanglishNumberVariants(num: number): string[] {
  if (num <= 0 || num >= 10000) return [];
  
  const results = new Set<string>();

  const onesVariants: { [key: number]: string[] } = {
    1: ['tit', 'it', 'ta'],
    2: ['hnit', 'nhit', 'nit'],
    3: ['thone', 'thoun'],
    4: ['lay', 'layy'],
    5: ['ngar', 'nga'],
    6: ['chauk'],
    7: ['khun', 'khunit'],
    8: ['shit'],
    9: ['ko']
  };

  const tensPrefixes: { [key: number]: string[] } = {
    1: ['ta', ''],
    2: ['hnit', 'nhit', 'nit'],
    3: ['thone', 'thoun'],
    4: ['lay', 'layy'],
    5: ['ngar', 'nga'],
    6: ['chauk'],
    7: ['khun', 'khunit'],
    8: ['shit'],
    9: ['ko']
  };

  const tensWords = ['sae', 'hse'];
  const hundredsWords = ['ya'];
  const thousandsWords = ['htaung', 'taung'];

  function generate(n: number): string[][] {
    if (n === 0) return [[]];
    
    let options: string[][] = [];

    if (n >= 1000) {
      const thousands = Math.floor(n / 1000);
      const rem = n % 1000;
      const thPrefixes = onesVariants[thousands] || [];
      const thOptions: string[] = [];
      thPrefixes.forEach(pref => {
        thousandsWords.forEach(w => {
          thOptions.push(pref + ' ' + w);
          thOptions.push(pref + w);
        });
      });
      const remOptions = generate(rem);
      thOptions.forEach(tho => {
        remOptions.forEach(ro => {
          options.push([tho, ...ro]);
        });
      });
      return options;
    }

    if (n >= 100) {
      const hundreds = Math.floor(n / 100);
      const rem = n % 100;
      const hPrefixes = onesVariants[hundreds] || [];
      const hOptions: string[] = [];
      hPrefixes.forEach(pref => {
        hundredsWords.forEach(w => {
          hOptions.push(pref + ' ' + w);
          hOptions.push(pref + w);
        });
      });
      const remOptions = generate(rem);
      hOptions.forEach(ho => {
        remOptions.forEach(ro => {
          options.push([ho, ...ro]);
        });
      });
      return options;
    }

    if (n >= 10) {
      const t = Math.floor(n / 10);
      const o = n % 10;
      const tPrefixes = tensPrefixes[t] || [];
      const tOptions: string[] = [];
      tPrefixes.forEach(pref => {
        tensWords.forEach(w => {
          if (pref) {
            tOptions.push(pref + ' ' + w);
            tOptions.push(pref + w);
          } else {
            tOptions.push(w);
          }
        });
      });
      const oOptions = o > 0 ? (onesVariants[o] || []) : [''];
      tOptions.forEach(to => {
        oOptions.forEach(oo => {
          if (oo) {
            options.push([to, oo]);
          } else {
            options.push([to]);
          }
        });
      });
      return options;
    }

    // Single digit
    const oOptions = onesVariants[n] || [];
    oOptions.forEach(oo => {
      options.push([oo]);
    });
    return options;
  }

  const paths = generate(num);
  paths.forEach(p => {
    results.add(p.join(' '));
  });

  return Array.from(results);
}

export function expandNumberDigitsToWords(queryClean: string): string[] {
  const regex = /[0-9၀-၉]+/g;
  const matches: { text: string; index: number }[] = [];
  let m;
  while ((m = regex.exec(queryClean)) !== null) {
    matches.push({ text: m[0], index: m.index });
  }

  if (matches.length === 0) return [];

  const firstMatch = matches[0];
  const originalDigitsText = firstMatch.text;
  const numVal = parseInt(normalizeDigits(originalDigitsText), 10);

  if (isNaN(numVal) || numVal < 0 || numVal >= 10000) return [];

  const englishWords = getEnglishNumberVariants(numVal);
  const myanglishWords = getMyanglishNumberVariants(numVal);
  const burmeseDigits = toBurmeseDigits(numVal.toString());
  const arabicDigits = numVal.toString();

  const replacements = new Set<string>();
  englishWords.forEach(w => replacements.add(w));
  myanglishWords.forEach(w => replacements.add(w));
  replacements.add(burmeseDigits);
  replacements.add(arabicDigits);

  const prefix = queryClean.substring(0, firstMatch.index);
  const suffix = queryClean.substring(firstMatch.index + originalDigitsText.length);

  const results: string[] = [];
  replacements.forEach(rep => {
    if (rep !== originalDigitsText) {
      results.push(prefix + rep + suffix);
    }
  });

  return results;
}

export function expandWordToDigits(queryClean: string): string[] {
  const normalizedQuery = queryClean.replace(/-/g, ' ');
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const results: string[] = [];
  let i = 0;
  let modifiedAny = false;
  
  const arabTokens: string[] = [];
  const mmTokens: string[] = [];

  while (i < tokens.length) {
    let parsedNum: number | null = null;
    let matchedLen = 0;

    for (let len = Math.min(3, tokens.length - i); len >= 1; len--) {
      const segment = tokens.slice(i, i + len);
      
      let num = parseMyanglishNumber(segment);
      if (num === null) {
        num = parseEnglishNumber(segment);
      }

      if (num !== null) {
        parsedNum = num;
        matchedLen = len;
        break;
      }
    }

    if (parsedNum !== null && matchedLen > 0) {
      const arabStr = parsedNum.toString();
      const mmStr = toBurmeseDigits(arabStr);

      arabTokens.push(arabStr);
      mmTokens.push(mmStr);

      modifiedAny = true;
      i += matchedLen;
    } else {
      arabTokens.push(tokens[i]);
      mmTokens.push(tokens[i]);
      i++;
    }
  }

  if (modifiedAny) {
    results.push(arabTokens.join(' '));
    results.push(mmTokens.join(' '));
  }

  return results;
}

export function expandNumberQuery(queryText: string): string[] {
  const queryClean = queryText.toLowerCase().trim();
  if (!queryClean) return [];

  const results: string[] = [];

  const wordToDigits = expandWordToDigits(queryClean);
  wordToDigits.forEach(v => results.push(v));

  const digitToWords = expandNumberDigitsToWords(queryClean);
  digitToWords.forEach(v => results.push(v));

  return Array.from(new Set(results));
}

export function getAllQueryVariants(query: string): string[] {
  const queryClean = query.trim().toLowerCase();
  if (!queryClean) return [];

  const variants = new Set<string>();
  variants.add(queryClean);

  const numExpansions = expandNumberQuery(queryClean);
  numExpansions.forEach(v => variants.add(v));

  const currentVariants = Array.from(variants);
  currentVariants.forEach(v => {
    const norm = normalizeDigits(v);
    const mm = toBurmeseDigits(v);
    variants.add(norm);
    variants.add(mm);
  });

  const finalVariants = Array.from(variants);
  finalVariants.forEach(v => {
    let enriched = v;
    MYANGLISH_PAIRS.forEach(([en, my]) => {
      if (enriched.includes(en) && !enriched.includes(my)) {
        enriched += ' ' + my;
      } else if (enriched.includes(my) && !enriched.includes(en)) {
        enriched += ' ' + en;
      }
    });

    Object.entries(MYANGLISH_ALIASES).forEach(([en, my]) => {
      const enRegex = new RegExp(`\\b${en}\\b`, 'g');
      if (enRegex.test(v)) {
        enriched += ' ' + my;
      } else if (v.includes(my)) {
        enriched += ' ' + en;
      }
    });

    variants.add(enriched);
  });

  return Array.from(variants).filter(Boolean);
}

/**
 * Enriches query by translating standard Myanglish words to Burmese or vice versa
 */
export function enrichQueryWithTransliteration(q: string): string {
  const variants = getAllQueryVariants(q);
  return Array.from(new Set([q.toLowerCase(), ...variants])).join(' ');
}

/**
 * Checks whether a place name matches a given query string (normalized)
 */
export function isNameMatch(p: Place, query: string): boolean {
  if (!query) return false;
  const q = query.trim().toLowerCase().replace(/[^a-zA-Z0-9က-အ]/g, '');
  if (!q) return false;
  const nameEn = (p.name || '').toLowerCase().replace(/[^a-zA-Z0-9က-အ]/g, '');
  const nameMy = (p.name_my || '').toLowerCase().replace(/[^a-zA-Z0-9က-အ]/g, '');
  const nameRom = (p.name_romanized || '').toLowerCase().replace(/[^a-zA-Z0-9က-အ]/g, '');
  return nameEn.includes(q) || nameMy.includes(q) || nameRom.includes(q) || q.includes(nameEn) || q.includes(nameMy) || q.includes(nameRom);
}

export function placeMatchesKeywordSimple(p: Place, word: string): boolean {
  const q = word.trim().toLowerCase();
  if (!q) return true;

  const nameEn = p._lc_name || '';
  const nameMy = p._lc_name_my || '';
  const nameRom = p._lc_name_romanized || '';
  const addrEn = p._lc_full_address || '';
  const addrMy = p._lc_full_address_my || '';
  const catEn = p._lc_category || '';
  const catMy = p._lc_category_my || '';
  const tags = p._lc_tags || '';
  const tsEn = p._lc_township || '';
  const tsMy = p._lc_township_my || '';
  const phoneNom = p._lc_phone_normalized || '';
  const phoneRaw = p._lc_phone_raw || '';

  const jointNameEn = p._joint_name_en || '';
  const jointNameMy = p._joint_name_my || '';
  const jointNameRom = p._joint_name_rom || '';

  const qJoint = q.replace(/\s+/g, '');

  return (
    nameEn.includes(q) ||
    nameMy.includes(q) ||
    nameRom.includes(q) ||
    addrEn.includes(q) ||
    addrMy.includes(q) ||
    catEn.includes(q) ||
    catMy.includes(q) ||
    tags.includes(q) ||
    tsEn.includes(q) ||
    tsMy.includes(q) ||
    phoneNom.includes(q) ||
    phoneRaw.includes(q) ||
    jointNameEn.includes(qJoint) ||
    jointNameMy.includes(qJoint) ||
    jointNameRom.includes(qJoint)
  );
}

export interface PrecomputedQuery {
  queryClean: string;
  jointQuery: string;
  queryWords: string[];
  originalQueryWords: string[];
}

export function precomputeQuery(query: string): PrecomputedQuery {
  const queryClean = query.trim().toLowerCase();
  const variants = getAllQueryVariants(queryClean);
  const queryWords = Array.from(new Set(
    variants.flatMap(v => v.split(/\s+/))
  )).filter(w => w.length > 1 || /\d/.test(w));

  const originalQueryWords = queryClean.split(/\s+/).filter(w => w.length > 0);
  const jointQuery = queryClean.replace(/\s+/g, '');

  return {
    queryClean,
    jointQuery,
    queryWords,
    originalQueryWords
  };
}

export function calculateMatchScoreFast(p: Place, pq: PrecomputedQuery): number {
  const { queryClean, jointQuery, queryWords, originalQueryWords } = pq;
  if (!queryClean) return 1.0;
  if (queryWords.length === 0) return 0;

  const nameEn = p._lc_name || '';
  const nameMy = p._lc_name_my || '';
  const nameRom = p._lc_name_romanized || '';
  const addrEn = p._lc_full_address || '';
  const addrMy = p._lc_full_address_my || '';
  const catEn = p._lc_category || '';
  const catMy = p._lc_category_my || '';
  const tags = p._lc_tags || '';
  const tsEn = p._lc_township || '';
  const tsMy = p._lc_township_my || '';
  const phoneNom = p._lc_phone_normalized || '';

  const jointNameEn = p._joint_name_en || '';
  const jointNameMy = p._joint_name_my || '';
  const jointNameRom = p._joint_name_rom || '';
  const jointAddrEn = p._joint_addr_en || '';
  const jointAddrMy = p._joint_addr_my || '';
  const jointTags = p._joint_tags || '';

  let score = 0;
  let isMatched = false;

  if (nameEn.includes(queryClean) || nameMy.includes(queryClean) || nameRom.includes(queryClean) || 
      jointNameEn.includes(jointQuery) || jointNameMy.includes(jointQuery) || jointNameRom.includes(jointQuery)) {
    score += 200; 
    isMatched = true;
  }
  
  if (addrEn.includes(queryClean) || addrMy.includes(queryClean) || jointAddrEn.includes(jointQuery) || jointAddrMy.includes(jointQuery)) {
    score += 120; 
    isMatched = true;
  }
  
  if (tags.includes(queryClean) || jointTags.includes(jointQuery)) {
    score += 80;
    isMatched = true;
  }

  if (originalQueryWords.length > 1) {
    const allFieldsEnCombined = `${nameEn} ${nameRom} ${addrEn} ${catEn} ${tags} ${tsEn}`;
    const allFieldsMyCombined = `${nameMy} ${addrMy} ${catMy} ${tsMy}`;
    const jointAllFieldsEn = p._joint_all_fields_en || allFieldsEnCombined.replace(/\s+/g, '');
    const jointAllFieldsMy = p._joint_all_fields_my || allFieldsMyCombined.replace(/\s+/g, '');

    const allOriginalMatched = originalQueryWords.every(word => {
      return allFieldsEnCombined.includes(word) || 
             allFieldsMyCombined.includes(word) || 
             jointAllFieldsEn.includes(word) || 
             jointAllFieldsMy.includes(word);
    });

    if (allOriginalMatched) {
      score += 100;
      isMatched = true;
      
      originalQueryWords.forEach(word => {
        if (nameEn.includes(word) || nameMy.includes(word) || nameRom.includes(word)) score += 40;
        if (addrEn.includes(word) || addrMy.includes(word)) score += 20;
      });
    }
  }

  if (!isMatched) {
    const importantWords = queryWords.filter(w => w.length >= 2 || /\d/.test(w));
    const anyWordMatched = importantWords.some(word => {
      return nameEn.includes(word) || nameMy.includes(word) || nameRom.includes(word) ||
             addrEn.includes(word) || addrMy.includes(word) ||
             tags.includes(word) || tsEn.includes(word) || tsMy.includes(word) ||
             phoneNom.includes(word);
    });
    if (anyWordMatched) {
      score += 40;
      isMatched = true;
    }
  }

  return isMatched ? score : 0;
}

/**
 * Computes a weighted matching score for a place based on query term matches
 */
export function calculateMatchScore(p: Place, query: string): number {
  const queryClean = query.trim().toLowerCase();
  if (!queryClean) return 1.0;
  const pq = precomputeQuery(queryClean);
  return calculateMatchScoreFast(p, pq);
}

/**
 * Generate smart tag recommendations based on ratings and review counts
 */
export function generateSmartTags(p: Place): string {
  const t: string[] = [];
  if (p.rating >= 4.5) t.push('highly rated', 'popular');
  if (p.review_count > 100) t.push('trending', 'crowded');
  if (p.category) t.push(p.category.toLowerCase());
  return t.join(', ');
}

/**
 * Enriches the initial raw places dataset with dynamic townships, smart tags, and Myanglish/digit normalizations
 */
export function enrichPlacesWithTownship(rawList: Place[]): Place[] {
  return rawList.map((p) => {
    let township = p.township || 'Other';
    let township_my = p.township_my || 'အခြား';

    // Normalize initially provided English township name if any
    if (township && township !== 'Other') {
      const tClean = township.trim().toLowerCase().replace(/\s+township$/i, '');
      let resolvedTs = null;

      if (tClean === 'tarmwe' || tClean === 'tamwe') {
        resolvedTs = { en: 'Tamwe', my: 'တာမွေ' };
      } else if (tClean === 'south okkalapa' || tClean === 'south okkalappa' || tClean === 'south-okkalapa') {
        resolvedTs = { en: 'South Okkalapa', my: 'တောင်ဥက္ကလာပ' };
      } else if (tClean === 'north okkalapa' || tClean === 'north okkalappa' || tClean === 'north-okkalapa') {
        resolvedTs = { en: 'North Okkalapa', my: 'မြောက်ဥက္ကလာပ' };
      } else if (tClean === 'dawbon') {
        resolvedTs = { en: 'Dawbon', my: 'ဒေါပုံ' };
      } else {
        resolvedTs = TOWNSHIPS_MAP.find(t => {
          const tEnLower = t.en.toLowerCase();
          return tClean === tEnLower || 
                 tClean.includes(tEnLower) || 
                 tEnLower.includes(tClean);
        }) || null;
      }

      if (resolvedTs) {
        township = resolvedTs.en;
        township_my = resolvedTs.my;
      }
    }

    if (!township || township === 'Other') {
      const addrEn = (p.full_address || '').toLowerCase();
      const addrMy = p.full_address_my || '';

      // FIX: iterate longest-name-first so compound townships like
      // "North Dagon" / "South Dagon" / "Dagon Seikkan" are matched before
      // the plain "Dagon" \b...\b match incorrectly wins on a prefix hit.
      const matched = TOWNSHIPS_MAP_BY_SPECIFICITY.find((t) => {
        const tsEnLower = t.en.toLowerCase();
        const regexEn = new RegExp(`\\b${tsEnLower}\\b`, 'i');
        
        // Custom check for Tarmwe spelling variants in address
        if (tsEnLower === 'tamwe' && (addrEn.includes('tarmwe') || addrEn.includes('tamwe'))) return true;
        if (tsEnLower === 'south okkalapa' && (addrEn.includes('south okkalapa') || addrEn.includes('south okkalappa') || addrEn.includes('south-okkalapa'))) return true;
        if (tsEnLower === 'north okkalapa' && (addrEn.includes('north okkalapa') || addrEn.includes('north okkalappa') || addrEn.includes('north-okkalapa'))) return true;
        
        if (regexEn.test(addrEn) || addrMy.includes(t.my)) return true;
        return false;
      });

      if (matched) {
        township = matched.en;
        township_my = matched.my;
      } else {
        // FIX: anchor the fallback regex to the last 1-3 capitalized words
        // immediately before "Township" instead of a greedy prefix, so it
        // doesn't accidentally swallow preceding street-name words.
        const townshipMatch = (p.full_address || '').match(
          /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+Township/i
        );
        const myTownshipMatch = addrMy.match(/([က-အ]+)မြို့နယ်/);

        const extEn = townshipMatch ? townshipMatch[1].trim() : '';
        const extMy = myTownshipMatch ? myTownshipMatch[1].trim() : '';

        if (extEn) {
          const cleanExt = extEn.trim().toLowerCase().replace(/\s+township$/i, '');
          let matchedTs = null;
          if (cleanExt === 'tarmwe' || cleanExt === 'tamwe') {
            matchedTs = { en: 'Tamwe', my: 'တာမွေ' };
          } else if (cleanExt === 'south okkalapa' || cleanExt === 'south okkalappa' || cleanExt === 'south-okkalapa') {
            matchedTs = { en: 'South Okkalapa', my: 'တောင်ဥက္ကလာပ' };
          } else if (cleanExt === 'north okkalapa' || cleanExt === 'north okkalappa' || cleanExt === 'north-okkalapa') {
            matchedTs = { en: 'North Okkalapa', my: 'မြောက်ဥက္ကလာပ' };
          } else if (cleanExt === 'dawbon') {
            matchedTs = { en: 'Dawbon', my: 'ဒေါပုံ' };
          } else {
            matchedTs = TOWNSHIPS_MAP_BY_SPECIFICITY.find(t => 
              cleanExt.includes(t.en.toLowerCase()) || 
              t.en.toLowerCase().includes(cleanExt)
            ) || null;
          }

          if (matchedTs) {
            township = matchedTs.en;
            township_my = matchedTs.my;
          }
        }
        
        if (township === 'Other' && extMy) {
          const fuzzyMatched = TOWNSHIPS_MAP_BY_SPECIFICITY.find(t => extMy.includes(t.my) || t.my.includes(extMy));
          if (fuzzyMatched) {
            township = fuzzyMatched.en;
            township_my = fuzzyMatched.my;
          }
        }
      }
    }

    // Coordinate-based fallback check if still 'Other'
    if ((!township || township === 'Other') && p.lat && p.lon) {
      let minDistance = Infinity;
      let nearest = null;
      for (const t of TOWNSHIPS_MAP) {
        // Haversine distance formula
        const dLat = ((t.lat - p.lat) * Math.PI) / 180;
        const dLon = ((t.lon - p.lon) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((p.lat * Math.PI) / 180) *
            Math.cos((t.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = 6371 * c; // distance in km
        if (dist < minDistance) {
          minDistance = dist;
          nearest = t;
        }
      }
      if (nearest) {
        township = nearest.en;
        township_my = nearest.my;
      }
    }

    // ALWAYS ensure township_my is properly mapped from the clean TOWNSHIPS_MAP if English township matches!
    if (township && township !== 'Other') {
      const matchedTs = TOWNSHIPS_MAP.find(t => t.en.toLowerCase() === township.toLowerCase());
      if (matchedTs) {
        township_my = matchedTs.my;
      }
    }

    const tags = generateSmartTags(p);
    const name_romanized = p.name_my ? romanize(p.name_my) : '';
    const phone_normalized = p.phone ? normalizeDigits(p.phone) : '';

    const lc_name = (p.name || '').toLowerCase();
    const lc_name_my = (p.name_my || '').toLowerCase();
    const lc_name_romanized = name_romanized.toLowerCase();
    const lc_full_address = (p.full_address || '').toLowerCase();
    const lc_full_address_my = (p.full_address_my || '').toLowerCase();
    const lc_category = (p.category || '').toLowerCase();
    const lc_category_my = (p.category_my || '').toLowerCase();
    const lc_tags = tags.toLowerCase();
    const lc_township = township.toLowerCase();
    const lc_township_my = township_my.toLowerCase();
    const lc_phone_normalized = phone_normalized.toLowerCase();
    const lc_phone_raw = (p.phone || '').toLowerCase();

    const joint_name_en = lc_name.replace(/\s+/g, '');
    const joint_name_my = lc_name_my.replace(/\s+/g, '');
    const joint_name_rom = lc_name_romanized.replace(/\s+/g, '');
    const joint_addr_en = lc_full_address.replace(/\s+/g, '');
    const joint_addr_my = lc_full_address_my.replace(/\s+/g, '');
    const joint_tags = lc_tags.replace(/\s+/g, '');

    const joint_all_fields_en = `${lc_name} ${lc_name_romanized} ${lc_full_address} ${lc_category} ${lc_tags} ${lc_township}`.replace(/\s+/g, '');
    const joint_all_fields_my = `${lc_name_my} ${lc_full_address_my} ${lc_category_my} ${lc_township_my}`.replace(/\s+/g, '');

    return {
      ...p,
      township,
      township_my,
      tags,
      name_romanized,
      phone_normalized,
      _lc_name: lc_name,
      _lc_name_my: lc_name_my,
      _lc_name_romanized: lc_name_romanized,
      _lc_full_address: lc_full_address,
      _lc_full_address_my: lc_full_address_my,
      _lc_category: lc_category,
      _lc_category_my: lc_category_my,
      _lc_tags: lc_tags,
      _lc_township: lc_township,
      _lc_township_my: lc_township_my,
      _lc_phone_normalized: lc_phone_normalized,
      _lc_phone_raw: lc_phone_raw,
      _joint_name_en: joint_name_en,
      _joint_name_my: joint_name_my,
      _joint_name_rom: joint_name_rom,
      _joint_addr_en: joint_addr_en,
      _joint_addr_my: joint_addr_my,
      _joint_tags: joint_tags,
      _joint_all_fields_en: joint_all_fields_en,
      _joint_all_fields_my: joint_all_fields_my
    };
  });
}

/**
 * Breaks a string down into overlapping 3-character chunks (trigrams).
 * This works natively for Burmese without word segmentation tools.
 */
export function getTrigrams(text: string): string[] {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ');
  const trigrams: string[] = [];
  if (normalized.length < 3) {
    if (normalized.length > 0) {
      trigrams.push(normalized);
    }
    return trigrams;
  }
  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.push(normalized.substring(i, i + 3));
  }
  return trigrams;
}

export interface DocumentTermFreqs {
  [term: string]: number;
}

export interface IndexItem {
  placeId: string;
  docLen: number;
  termFreqs: DocumentTermFreqs;
}

/**
 * Client-side BM25 search index over the Places dataset.
 * Compiles a trigram index and scores relevance with TF-IDF / BM25.
 */
export class BM25SearchIndex {
  private items: Map<string, IndexItem> = new Map();
  private invertedIndex: Map<string, { placeId: string; freq: number }[]> = new Map();
  private docFreq: Map<string, number> = new Map();
  private avgDocLen = 0;
  private totalDocs = 0;
  private k1 = 1.2;
  private b = 0.75;

  constructor(places: Place[]) {
    this.buildIndex(places);
  }

  private buildIndex(places: Place[]) {
    this.items.clear();
    this.invertedIndex.clear();
    this.docFreq.clear();
    this.totalDocs = places.length;

    if (this.totalDocs === 0) return;

    let totalLen = 0;

    places.forEach((p) => {
      const name_normalized = p.name ? normalizeDigits(p.name) : '';
      const name_my_normalized = p.name_my ? normalizeDigits(p.name_my) : '';
      const full_address_normalized = p.full_address ? normalizeDigits(p.full_address) : '';
      const full_address_my_normalized = p.full_address_my ? normalizeDigits(p.full_address_my) : '';
      const phone_normalized = p.phone ? normalizeDigits(p.phone) : '';

      const fields = [
        p.name || '',
        name_normalized,
        p.name_my || '',
        name_my_normalized,
        p.name_romanized || '',
        p.full_address || '',
        full_address_normalized,
        p.full_address_my || '',
        full_address_my_normalized,
        p.category || '',
        p.category_my || '',
        p.tags || '',
        p.township || '',
        p.township_my || '',
        p.phone || '',
        phone_normalized
      ];
      
      const combinedText = fields.join(' ');
      const trigrams = getTrigrams(combinedText);

      // Also extract all individual digit sequences and word tokens, and index them.
      // This is crucial for matching digits/numbers (like '50', '၅၀') or short words (like 'ko').
      const tokens = combinedText.toLowerCase().split(/[\s,.\-\/()]+/g).filter(Boolean);
      tokens.forEach(tok => {
        if (tok.length < 3 || /[0-9၀-၉]/.test(tok)) {
          trigrams.push(tok);
        }
      });

      const docLen = trigrams.length;
      totalLen += docLen;

      const termFreqs: DocumentTermFreqs = {};
      trigrams.forEach((tg) => {
        termFreqs[tg] = (termFreqs[tg] || 0) + 1;
      });

      this.items.set(p.place_id, {
        placeId: p.place_id,
        docLen,
        termFreqs
      });

      Object.entries(termFreqs).forEach(([term, freq]) => {
        let list = this.invertedIndex.get(term);
        if (!list) {
          list = [];
          this.invertedIndex.set(term, list);
        }
        list.push({ placeId: p.place_id, freq });

        this.docFreq.set(term, (this.docFreq.get(term) || 0) + 1);
      });
    });

    this.avgDocLen = totalLen / this.totalDocs;
  }

  public search(query: string, placesMap: Map<string, Place>): { place: Place; score: number }[] {
    const queryClean = query.trim().toLowerCase();
    if (!queryClean) return [];

    const variants = getAllQueryVariants(queryClean);
    const queryTrigrams = Array.from(new Set(
      variants.flatMap(v => getTrigrams(v))
    ));

    if (queryTrigrams.length === 0) return [];

    const scores: Map<string, number> = new Map();

    queryTrigrams.forEach((term) => {
      const df = this.docFreq.get(term) || 0;
      if (df === 0) return;

      const idf = Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));

      const matches = this.invertedIndex.get(term) || [];
      matches.forEach(({ placeId, freq }) => {
        const docInfo = this.items.get(placeId);
        if (!docInfo) return;

        const tf = freq;
        const docLen = docInfo.docLen;

        const termScore = idf * (tf * (this.k1 + 1)) / (tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLen)));

        scores.set(placeId, (scores.get(placeId) || 0) + termScore);
      });
    });

    const results: { place: Place; score: number }[] = [];
    scores.forEach((score, placeId) => {
      const place = placesMap.get(placeId);
      if (place) {
        results.push({ place, score });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }
}

export function getLevenshteinDistance(a: string, b: string): number {
  const tmp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // deletion
        tmp[i][j - 1] + 1, // insertion
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
      );
    }
  }
  return tmp[a.length][b.length];
}

export interface DidYouMeanDictionary {
  wordsSet: Set<string>;
  wordsList: string[];
  byLength: Record<number, string[]>;
}

export function buildDidYouMeanDictionary(places: Place[]): DidYouMeanDictionary {
  const dictionary = new Set<string>();
  
  // 1. Add township names (En and My)
  TOWNSHIPS_MAP.forEach(ts => {
    dictionary.add(ts.en.toLowerCase());
    dictionary.add(ts.my.toLowerCase());
    ts.en.toLowerCase().split(/\s+/).forEach(w => {
      if (w.length >= 3) dictionary.add(w);
    });
  });

  // 2. Add category names (En and My) from places
  places.forEach(p => {
    if (p.category) {
      dictionary.add(p.category.toLowerCase());
      p.category.toLowerCase().split(/[\s&/]+/g).forEach(w => {
        if (w.length >= 3) dictionary.add(w);
      });
    }
    if (p.category_my) {
      dictionary.add(p.category_my.toLowerCase());
      p.category_my.toLowerCase().split(/[\s&/]+/g).forEach(w => {
        if (w.length >= 3) dictionary.add(w);
      });
    }

    // 3. Add place name words and full place names
    if (p.name) {
      const nameLower = p.name.toLowerCase();
      dictionary.add(nameLower);
      nameLower.split(/[\s,\-\/()]+/g).forEach(w => {
        const cleanW = w.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanW.length >= 3) {
          dictionary.add(cleanW);
        }
      });
    }
    if (p.name_my) {
      const nameMyLower = p.name_my.toLowerCase();
      dictionary.add(nameMyLower);
      nameMyLower.split(/[\s,\-\/()]+/g).forEach(w => {
        if (w.length >= 3) {
          dictionary.add(w);
        }
      });
    }

    // 4. Add tag words
    if (p.tags) {
      p.tags.toLowerCase().split(/[\s,\-\/()]+/g).forEach(w => {
        if (w.length >= 3) {
          dictionary.add(w);
        }
      });
    }
  });

  const stopWords = new Set(['and', 'the', 'for', 'with', 'near', 'near-me', 'nearby']);
  stopWords.forEach(w => dictionary.delete(w));

  const wordsList = Array.from(dictionary);
  const byLength: Record<number, string[]> = {};
  for (const word of wordsList) {
    const len = word.length;
    if (!byLength[len]) {
      byLength[len] = [];
    }
    byLength[len].push(word);
  }

  return {
    wordsSet: dictionary,
    wordsList,
    byLength
  };
}

export function getDidYouMeanSuggestion(queryText: string, dictObj: DidYouMeanDictionary): string | null {
  const queryClean = queryText.toLowerCase().trim();
  if (!queryClean || !dictObj || !dictObj.wordsSet || dictObj.wordsSet.size === 0) return null;

  const stopWords = new Set(['and', 'the', 'for', 'with', 'near', 'near-me', 'nearby']);

  if (dictObj.wordsSet.has(queryClean)) {
    return null;
  }

  // Check full phrase distance
  let bestPhraseMatch: string | null = null;
  let bestPhraseDist = Infinity;

  const qLen = queryClean.length;

  // Iterate candidate lengths from qLen - 3 to qLen + 3
  const minLen = Math.max(1, qLen - 3);
  const maxLen = qLen + 3;

  for (let len = minLen; len <= maxLen; len++) {
    const group = dictObj.byLength[len];
    if (!group) continue;

    // Check distance restrictions based on len
    if (len >= 4) {
      const maxAllowedDist = len <= 6 ? 1 : (len <= 10 ? 2 : 3);
      if (Math.abs(len - qLen) > maxAllowedDist) continue;

      for (const dictTerm of group) {
        const dist = getLevenshteinDistance(queryClean, dictTerm);
        if (dist <= maxAllowedDist && dist < bestPhraseDist) {
          bestPhraseDist = dist;
          bestPhraseMatch = dictTerm;
        }
      }
    }
  }

  if (bestPhraseMatch && bestPhraseMatch !== queryClean) {
    return bestPhraseMatch;
  }

  // Word-by-word
  const words = queryClean.split(/\s+/);
  let anyModified = false;
  const correctedWords = words.map(word => {
    if (word.length < 3 || stopWords.has(word) || /^[0-9၀-၉]+$/.test(word)) {
      return word;
    }

    if (dictObj.wordsSet.has(word)) {
      return word;
    }

    let closestWord = word;
    let minDistance = Infinity;

    const wLen = word.length;
    const wMinLen = Math.max(1, wLen - 2);
    const wMaxLen = wLen + 2;

    for (let len = wMinLen; len <= wMaxLen; len++) {
      const group = dictObj.byLength[len];
      if (!group) continue;

      const maxAllowed = wLen <= 4 ? 1 : 2;
      if (Math.abs(len - wLen) > maxAllowed) continue;

      for (const dictWord of group) {
        const dist = getLevenshteinDistance(word, dictWord);
        if (dist <= maxAllowed && dist < minDistance) {
          minDistance = dist;
          closestWord = dictWord;
        }
      }
    }

    if (closestWord !== word) {
      anyModified = true;
      return closestWord;
    }

    return word;
  });

  if (anyModified) {
    return correctedWords.join(' ');
  }

  return null;
}
