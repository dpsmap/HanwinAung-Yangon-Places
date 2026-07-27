<template>
  <!-- INTUITIVE ADVANCED FILTERS MODULE -->
  <section id="search-explorer" class="bg-white border border-[#E5E0D8] p-5 flex flex-col gap-4 shadow-sm w-full relative z-30">
    <div class="flex flex-col lg:flex-row gap-3 items-stretch w-full">
      
      <!-- Real Query Keyword Input with dedicated Search Button -->
      <div class="relative flex-1 flex flex-col sm:flex-row gap-2 items-stretch">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C665D] w-4 h-4" />
          <input
            id="search-input"
            type="text"
            v-model="localQuery"
            @focus="emitFocus(true)"
            @blur="emitBlur"
            @keydown.enter="emitExecuteSearch"
            :placeholder="currentPlaceholder"
            class="w-full pl-10 pr-16 py-3 bg-[#FAF8F5] border border-[#E5E0D8] rounded-none text-[#1C1C1C] placeholder-[#6C665D]/60 focus:outline-none focus:ring-1 focus:ring-[#A23B24] text-xs transition-all font-sans"
          />
          <button 
            v-if="localQuery"
            @click="emitClearSearch"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-[#A23B24] hover:text-[#1C1C1C] text-[10px] font-mono font-bold cursor-pointer uppercase"
          >
            CLEAR
          </button>

          <!-- Search suggestions dropdown -->
          <div 
            v-if="isSearchFocused && localQuery.trim() !== '' && suggestions.length > 0"
            class="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E5E0D8] shadow-lg z-50 divide-y divide-[#E5E0D8]/40 max-h-60 overflow-y-auto"
          >
            <div
              v-for="place in suggestions"
              :key="'suggest-' + place.place_id"
              @mousedown="emitSelectSuggestion(place)"
              class="p-3 hover:bg-[#FAF8F5] cursor-pointer flex flex-col gap-0.5 transition-colors text-left"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-serif font-semibold text-[#1C1C1C] text-xs">
                  {{ lang === 'en' ? place.name : place.name_my }}
                </span>
                <span class="text-[9px] font-bold uppercase text-[#A23B24] tracking-wider px-1.5 py-0.5 bg-[#A23B24]/5 border border-[#A23B24]/20">
                  {{ lang === 'en' ? place.category : (place.category_my || place.category) }}
                </span>
              </div>
              <span class="text-[10px] text-[#6C665D] truncate font-light">
                <span class="font-bold text-[#A23B24] mr-1">[{{ lang === 'en' ? (place.township + ' Township') : (place.township_my + 'မြို့နယ်') }}]</span>{{ lang === 'en' ? place.full_address : place.full_address_my }}
              </span>
            </div>
          </div>
        </div>

        <!-- Dedicated Search Button next to browse search bar to prevent real-time search lag -->
        <button
          @click="emitExecuteSearch"
          class="px-5 py-3 bg-[#1C1C1C] hover:bg-[#A23B24] text-white font-mono font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap border border-[#1C1C1C] hover:border-[#A23B24]"
        >
          <Search class="w-3.5 h-3.5" />
          <span>{{ lang === 'en' ? 'SEARCH' : 'ရှာဖွေရန်' }}</span>
        </button>
      </div>

      <!-- Slide accordian toggler -->
      <button
        id="advanced-filters-btn"
        @click="localShowAdvancedFilters = !localShowAdvancedFilters"
        :class="[
          'px-4 py-3 border text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer',
          localShowAdvancedFilters 
            ? 'bg-[#A23B24]/5 border-[#A23B24] text-[#A23B24]' 
            : 'border-[#1C1C1C] hover:bg-[#E5E0D8]/20 text-[#1C1C1C]'
        ]"
      >
        <SlidersHorizontal class="w-4 h-4" />
        <span>{{ t.advancedFilters }}</span>
      </button>
    </div>

    <!-- GPS Location Assistant bar -->
    <div class="flex flex-wrap items-center gap-3 border-t border-[#E5E0D8]/40 pt-3 -mt-2">
      <button
        @click="$emit('triggerGps')"
        class="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#E5E0D8] hover:border-[#A23B24] hover:bg-[#A23B24]/5 text-[#1C1C1C] hover:text-[#A23B24] font-mono text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
      >
        <span class="text-xs">📍</span>
        <span>{{ lang === 'en' ? 'Find Places Near Me (Use GPS)' : 'အနီးနားရှိနေရာများရှာရန် (GPS သုံးရန်)' }}</span>
      </button>
      
      <span v-if="gpsStatusMessage" class="text-[9px] font-medium text-[#6C665D] bg-[#FAF8F5] px-2 py-1 border border-[#E5E0D8] flex items-center gap-1.5">
        <span class="inline-block w-1.5 h-1.5 rounded-full" :class="isAcquiringGps ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'"></span>
        {{ gpsStatusMessage }}
      </span>
      <span v-else class="text-[9px] font-medium text-[#6C665D]/60 italic font-sans">
        {{ lang === 'en' ? 'Type "near me" or click to filter closest landmarks by your live location.' : 'သင့်အနီးနားရှိ နေရာများကိုရှာရန် "near me" ဟုရိုက်ပါ သို့မဟုတ် ဤနေရာတွင်ကလစ်နှိပ်ပါ။' }}
      </span>
    </div>

    <!-- Extended Filter Options Tray -->
    <div v-if="localShowAdvancedFilters" id="filters-accordion" class="pt-4 border-t border-[#E5E0D8]/70 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 animate-slide-down overflow-visible">
      
      <!-- Category options dropdown -->
      <div id="filter-category-container" class="flex flex-col gap-2 relative">
        <label class="text-[10px] font-bold text-[#A23B24] uppercase tracking-wider">
          {{ t.categoryLabel }}
        </label>
        <div class="relative w-full">
          <input
            id="filter-category-input"
            type="text"
            v-model="localCategorySearchInputText"
            @focus="emitCategoryFocus"
            @blur="emitCategoryBlur"
            :placeholder="t.allCategories"
            class="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-none text-xs text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#A23B24] cursor-text"
          />
          <!-- Arrow / dropdown indicator -->
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            <span class="text-[10px] text-gray-400">▾</span>
          </div>
          <!-- Dropdown list -->
          <div 
            v-if="showCategoryDropdown" 
            class="absolute left-0 right-0 mt-1 bg-[#FAF8F5] border border-[#E5E0D8] max-h-64 overflow-y-auto z-50 shadow-md divide-y divide-[#E5E0D8]/40 font-sans"
          >
            <div 
              @mousedown="emitSelectCategoryOption('all')"
              class="px-3 py-2.5 text-xs hover:bg-[#A23B24] hover:text-white cursor-pointer transition-colors"
              :class="{ 'bg-[#E5E0D8]/30 font-medium text-[#A23B24]': selectedCategory === 'all' }"
            >
              {{ t.allCategories }}
            </div>
            <div 
              v-for="cat in filteredSearchCategories" 
              :key="cat"
              @mousedown="emitSelectCategoryOption(cat)"
              class="px-3 py-2.5 text-xs hover:bg-[#A23B24] hover:text-white cursor-pointer transition-colors"
              :class="{ 'bg-[#E5E0D8]/30 font-medium text-[#A23B24]': selectedCategory === cat }"
            >
              {{ getCatLabelText(cat) }}
            </div>
            <div 
              v-if="filteredSearchCategories.length === 0" 
              class="px-3 py-2.5 text-xs text-gray-500 italic"
            >
              {{ lang === 'en' ? 'No categories found' : 'အမျိုးအစား ရှာမတွေ့ပါ' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Township options dropdown -->
      <div id="filter-township-container" class="flex flex-col gap-2">
        <label class="text-[10px] font-bold text-[#A23B24] uppercase tracking-wider">
          {{ lang === 'en' ? 'Township' : 'မြို့နယ်' }}
        </label>
        <select
          id="filter-township-select"
          v-model="localTownship"
          class="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-none text-xs text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#A23B24] cursor-pointer font-sans font-bold"
        >
          <option value="all">
            {{ lang === 'en' ? 'All Townships' : 'မြို့နယ်အားလုံး' }}
          </option>
          <option v-for="ts in availableTownships" :key="ts.en" :value="ts.en">
            <template v-if="ts.en === 'Other'">
              {{ lang === 'en' ? 'Other' : 'အခြား' }}
            </template>
            <template v-else>
              {{ lang === 'en' ? `${ts.en} Township` : `${ts.my} မြို့နယ်` }}
            </template>
          </option>
        </select>
      </div>

      <!-- Star Ratings range slider -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between text-[10px] font-bold text-[#A23B24] uppercase tracking-wider">
          <span>{{ t.minRatingLabel }}</span>
          <span class="text-[#A23B24] font-mono">
            {{ minRating === 0 ? 'Any' : `★ ${minRating.toFixed(1)}+` }}
          </span>
        </div>
        <div class="flex items-center gap-3 py-1.5">
          <input
            type="range"
            min="0"
            max="4.8"
            step="0.1"
            v-model.number="localMinRating"
            class="w-full h-1 bg-[#E5E0D8] rounded-lg appearance-none cursor-pointer accent-[#A23B24]"
          />
          <button
            v-if="minRating > 0"
            @click="localMinRating = 0"
            class="text-[10px] text-[#A23B24] hover:text-[#1C1C1C] font-bold cursor-pointer"
          >
            RESET
          </button>
        </div>
      </div>

      <!-- Sorter priorities selection dropdown -->
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-bold text-[#A23B24] uppercase tracking-wider">
          {{ t.sortByLabel }}
        </label>
        <div 
          class="grid gap-1 transition-all duration-300"
          :class="searchQueryActive ? 'grid-cols-4' : 'grid-cols-3'"
        >
          <!-- Relevance option only active during search -->
          <button
            v-if="searchQueryActive"
            @click="localSortBy = 'relevance'"
            :class="[
              'py-2 text-[10px] font-bold uppercase border tracking-wider transition-all cursor-pointer',
              sortBy === 'relevance' 
                ? 'bg-[#A23B24] border-[#A23B24] text-white shadow-sm' 
                : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
            ]"
          >
            {{ lang === 'en' ? 'Best Match' : 'ကိုက်ညီမှု' }}
          </button>
          
          <button
            @click="localSortBy = 'rating'"
            :class="[
              'py-2 text-[10px] font-bold uppercase border tracking-wider transition-all cursor-pointer',
              sortBy === 'rating' 
                ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white shadow-sm' 
                : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
            ]"
          >
            {{ lang === 'en' ? 'Rating' : 'အဆင့်စု' }}
          </button>
          <button
            @click="localSortBy = 'reviews'"
            :class="[
              'py-2 text-[10px] font-bold uppercase border tracking-wider transition-all cursor-pointer',
              sortBy === 'reviews' 
                ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white shadow-sm' 
                : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
            ]"
          >
            {{ lang === 'en' ? 'Reviews' : 'သုံးသပ်' }}
          </button>
          <button
            @click="localSortBy = 'name'"
            :class="[
              'py-2 text-[10px] font-bold uppercase border tracking-wider transition-all cursor-pointer',
              sortBy === 'name' 
                ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white shadow-sm' 
                : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
            ]"
          >
            {{ lang === 'en' ? 'Name' : 'အက္ခရာစဉ်' }}
          </button>
        </div>
      </div>

      <!-- Smart Search Engine Toggle column -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="text-[10px] font-bold text-[#A23B24] uppercase tracking-wider flex items-center gap-1.5">
            {{ lang === 'en' ? 'Semantic Engine' : 'စမတ်ရှာဖွေမှု' }}
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#A23B24] animate-pulse" v-if="smartSearchEnabled"></span>
          </label>
          <button 
            v-if="smartSearchEnabled"
            type="button"
            @click="showApiConfig = !showApiConfig"
            class="text-[9px] font-mono font-bold text-[#6C665D] hover:text-[#A23B24] transition-colors uppercase tracking-wider cursor-pointer"
          >
            {{ showApiConfig ? (lang === 'en' ? '[ HIDE ]' : '[ ဝှက်ရန် ]') : (lang === 'en' ? '[ CONFIG ]' : '[ ချိတ်ဆက်ရန် ]') }}
          </button>
        </div>
        <button
          @click="localSmartSearchEnabled = !localSmartSearchEnabled"
          :class="[
            'w-full py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all border cursor-pointer flex items-center justify-center gap-2',
            smartSearchEnabled 
              ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white hover:bg-[#A23B24] hover:border-[#A23B24]' 
              : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#6C665D] hover:bg-white'
          ]"
        >
          <span>{{ smartSearchEnabled ? 'Smart: ON' : 'Smart: OFF' }}</span>
        </button>

        <!-- Dynamic Vector API Config Field -->
        <div v-if="smartSearchEnabled && showApiConfig" class="border border-[#E5E0D8] bg-[#FAF8F5] p-3 flex flex-col gap-2 mt-1 animate-fade-in">
          <div class="flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-wider">
            <span class="text-[#6C665D]">{{ lang === 'en' ? 'API Endpoint' : 'ယူအာအယ်လ် လိပ်စာ' }}</span>
            <span v-if="vectorApiAvailable === true" class="text-emerald-700">● {{ lang === 'en' ? 'ONLINE' : 'ချိတ်ဆက်ပြီး' }}</span>
            <span v-else-if="vectorApiAvailable === false" class="text-red-700">● {{ lang === 'en' ? 'OFFLINE' : 'မချိတ်ဆက်မိပါ' }}</span>
            <span v-else class="text-[#A23B24] animate-pulse">● {{ lang === 'en' ? 'CHECKING...' : 'စစ်ဆေးနေသည်...' }}</span>
          </div>
          <input
            type="text"
            v-model="localCustomVectorApiUrl"
            @input="emit('update:customVectorApiUrl', localCustomVectorApiUrl)"
            placeholder="e.g. https://api.dpsmap.com"
            class="w-full bg-white border border-[#E5E0D8] px-2 py-1.5 text-[11px] font-mono focus:outline-none focus:border-[#A23B24] text-[#1C1C1C]"
          />
          <p class="text-[8.5px] text-[#6C665D] leading-normal font-light">
            {{ lang === 'en' ? 'Enter your vector search API endpoint, for example https://api.dpsmap.com.' : 'ယခု ဗက်က်တာ ရှာဖွေရေး API လိပ်စာကို ထည့်သွင်းပါ၊ ဥပမာ https://api.dpsmap.com။' }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted, onUnmounted } from 'vue';
import { Search, SlidersHorizontal } from 'lucide-vue-next';
import { Place } from '../types';

const props = defineProps<{
  lang: 'en' | 'my';
  t: any;
  localSearchQuery: string;
  isSearchFocused: boolean;
  suggestions: Place[];
  showAdvancedFilters: boolean;
  categorySearchInputText: string;
  showCategoryDropdown: boolean;
  filteredSearchCategories: string[];
  selectedCategory: string;
  selectedTownship: string;
  availableTownships: any[];
  minRating: number;
  sortBy: 'relevance' | 'rating' | 'reviews' | 'name';
  smartSearchEnabled: boolean;
  searchQueryActive: boolean;
  getCatLabelText: (cat: string) => string;
  isAcquiringGps?: boolean;
  gpsStatusMessage?: string | null;
  customVectorApiUrl: string;
  vectorApiAvailable: boolean | null;
}>();

// Dynamic API config toggling
const showApiConfig = ref(false);
const localCustomVectorApiUrl = ref(props.customVectorApiUrl);
watch(() => props.customVectorApiUrl, (val) => {
  localCustomVectorApiUrl.value = val;
});

// Rotating dynamic search placeholder typing machine logic
const currentPlaceholder = ref('');
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingTimer: any = null;

const getPlaceholders = () => props.lang === 'en' ? [
  "Search 'cafe near me' to find coffee spots...",
  "Search 'atm in hlaing' to locate cash machines...",
  "Search 'shwedagon pagoda' for sacred places...",
  "Search 'restaurants with 4 stars' for premium dining...",
  "Search 'hospitals in bahan' to locate medical centers...",
  "Search 'bus stop' or 'shoppings' for local transit and retail..."
] : [
  "ရှာဖွေရန်: 'အနီးနားရှိ ကဖေး' ဟု ရိုက်ရှာပါ...",
  "ရှာဖွေရန်: 'လှိုင်မြို့နယ်ရှိ ATM' ဟု ရိုက်ရှာပါ...",
  "ရှာဖွေရန်: 'ရွှေတိဂုံဘုရား' ဟု ရိုက်ရှာပါ...",
  "ရှာဖွေရန်: 'အဆင့်သတ်မှတ်ချက် ၄ ကျော်ရှိသော စားသောက်ဆိုင်'...",
  "ရှာဖွေရန်: 'ဗဟန်းမြို့နယ်ရှိ ဆေးရုံများ' ဟု ရိုက်ရှာပါ...",
  "ရှာဖွေရန်: 'ဘတ်စ်ကားမှတ်တိုင်' သို့မဟုတ် 'စျေးဝယ်စင်တာ'..."
];

function tick() {
  const phrases = getPlaceholders();
  if (phrases.length === 0) return;
  const fullTxt = phrases[currentPhraseIndex % phrases.length];

  if (isDeleting) {
    currentPlaceholder.value = fullTxt.substring(0, currentCharIndex - 1);
    currentCharIndex--;
  } else {
    currentPlaceholder.value = fullTxt.substring(0, currentCharIndex + 1);
    currentCharIndex++;
  }

  let delta = 85 - Math.random() * 35; // natural-feeling typing speeds
  if (isDeleting) {
    delta /= 2.2; // delete faster
  }

  if (!isDeleting && currentCharIndex === fullTxt.length) {
    delta = 2800; // hold finished string for readability
    isDeleting = true;
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentPhraseIndex++;
    delta = 600; // elegant pause before next phrase
  }

  typingTimer = setTimeout(tick, delta);
}

onMounted(() => {
  tick();
});

onUnmounted(() => {
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
});

watch(() => props.lang, () => {
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
  currentCharIndex = 0;
  isDeleting = false;
  tick();
});

const emit = defineEmits<{
  (e: 'update:localSearchQuery', val: string): void;
  (e: 'update:isSearchFocused', val: boolean): void;
  (e: 'update:showAdvancedFilters', val: boolean): void;
  (e: 'update:categorySearchInputText', val: string): void;
  (e: 'update:showCategoryDropdown', val: boolean): void;
  (e: 'update:selectedCategory', val: string): void;
  (e: 'update:selectedTownship', val: string): void;
  (e: 'update:minRating', val: number): void;
  (e: 'update:sortBy', val: 'relevance' | 'rating' | 'reviews' | 'name'): void;
  (e: 'update:smartSearchEnabled', val: boolean): void;
  (e: 'update:customVectorApiUrl', val: string): void;
  (e: 'executeSearch'): void;
  (e: 'clearSearch'): void;
  (e: 'selectSuggestion', p: Place): void;
  (e: 'selectCategoryOption', cat: string): void;
  (e: 'categoryFocus'): void;
  (e: 'categoryBlur'): void;
  (e: 'searchBlur'): void;
  (e: 'triggerGps'): void;
}>();

const localQuery = ref(props.localSearchQuery);
watch(() => props.localSearchQuery, (val) => { localQuery.value = val; });
watch(localQuery, (val) => { emit('update:localSearchQuery', val); });

const localShowAdvancedFilters = ref(props.showAdvancedFilters);
watch(() => props.showAdvancedFilters, (val) => { localShowAdvancedFilters.value = val; });
watch(localShowAdvancedFilters, (val) => { emit('update:showAdvancedFilters', val); });

const localCategorySearchInputText = ref(props.categorySearchInputText);
watch(() => props.categorySearchInputText, (val) => { localCategorySearchInputText.value = val; });
watch(localCategorySearchInputText, (val) => { emit('update:categorySearchInputText', val); });

const localTownship = ref(props.selectedTownship);
watch(() => props.selectedTownship, (val) => { localTownship.value = val; });
watch(localTownship, (val) => { emit('update:selectedTownship', val); });

const localMinRating = ref(props.minRating);
watch(() => props.minRating, (val) => { localMinRating.value = val; });
watch(localMinRating, (val) => { emit('update:minRating', val); });

const localSortBy = ref(props.sortBy);
watch(() => props.sortBy, (val) => { localSortBy.value = val; });
watch(localSortBy, (val) => { emit('update:sortBy', val); });

const localSmartSearchEnabled = ref(props.smartSearchEnabled);
watch(() => props.smartSearchEnabled, (val) => { localSmartSearchEnabled.value = val; });
watch(localSmartSearchEnabled, (val) => { emit('update:smartSearchEnabled', val); });

function emitFocus(val: boolean) {
  emit('update:isSearchFocused', val);
}

function emitBlur() {
  emit('searchBlur');
}

function emitExecuteSearch() {
  emit('executeSearch');
}

function emitClearSearch() {
  emit('clearSearch');
}

function emitSelectSuggestion(p: Place) {
  emit('selectSuggestion', p);
}

function emitSelectCategoryOption(cat: string) {
  emit('selectCategoryOption', cat);
}

function emitCategoryFocus() {
  emit('categoryFocus');
}

function emitCategoryBlur() {
  emit('categoryBlur');
}
</script>
