<template>
  <div class="bg-white border border-[#E5E0D8] p-5 flex flex-col gap-6 min-h-[500px] animate-fade-in shadow-sm">
    
    <!-- Back header navigator button -->
    <div class="flex items-center justify-between border-b border-[#E5E0D8]/70 pb-3">
      <button
        @click="emitClose"
        class="py-1 px-3 border border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>{{ lang === 'en' ? 'BACK TO DIRECTORY' : 'နေရာအားလုံးသို့' }}</span>
      </button>
      <button
        @click="emitClose"
        class="py-1 px-3 bg-[#A23B24]/10 text-[#A23B24] hover:bg-[#A23B24] hover:text-white border border-[#A23B24]/30 text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer"
        title="Exit Details"
      >
        <X class="w-3.5 h-3.5" />
        <span>{{ lang === 'en' ? 'EXIT' : 'ထွက်ရန်' }}</span>
      </button>
    </div>

    <!-- Landmark Headline Attributes -->
    <div class="flex flex-col gap-2">
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <h2 class="text-xl md:text-2xl font-serif font-bold text-[#1C1C1C] leading-snug">
            {{ selectedPlace.name }}
          </h2>
          <h3 v-if="selectedPlace.name_my && selectedPlace.name_my !== selectedPlace.name" class="text-sm md:text-base font-sans font-semibold text-[#6C665D]">
            {{ selectedPlace.name_my }}
          </h3>
        </div>
        <div class="flex flex-col gap-1 items-end shrink-0">
          <span class="px-2 py-0.5 bg-[#A23B24]/5 border border-[#A23B24]/30 text-[#A23B24] text-[9px] uppercase tracking-wider font-bold whitespace-nowrap">
            {{ selectedPlace.category }}
          </span>
          <span v-if="selectedPlace.category_my && selectedPlace.category_my !== selectedPlace.category" class="px-2 py-0.5 bg-[#6C665D]/10 border border-[#6C665D]/30 text-[#6C665D] text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap">
            {{ selectedPlace.category_my }}
          </span>
        </div>
      </div>
      
      <!-- Star Rating Display -->
      <div class="flex items-center gap-2 mt-1">
        <div class="flex text-amber-500 gap-0.5">
          <Star 
            v-for="i in 5" 
            :key="i"
            :class="['w-4 h-4', i <= Math.floor(selectedPlace.rating) ? 'fill-amber-500 text-amber-500' : 'text-[#E5E0D8]']" 
          />
        </div>
        <span class="font-bold text-xs text-[#1C1C1C] font-mono">{{ selectedPlace.rating }}</span>
        <span class="text-[#E5E0D8] text-xs">•</span>
        <span class="text-xs text-[#6C665D] font-mono">
          {{ selectedPlace.review_count.toLocaleString() }} {{ t.reviewsLabel }}
        </span>
      </div>
    </div>

    <!-- Landmark detail coordinates parameter block -->
    <section class="bg-[#FAF8F5] p-5 border border-[#E5E0D8] text-xs flex flex-col gap-4">
      <h4 class="font-bold text-[#A23B24] uppercase tracking-wider text-[9px]">
        {{ t.detailsTitle }}
      </h4>
      
      <!-- Township Row -->
      <div class="flex items-start gap-3">
        <MapPin class="w-4 h-4 text-[#A23B24] shrink-0 mt-0.5" />
        <div class="flex-1">
          <span class="text-[#6C665D] block tracking-wide font-bold uppercase text-[9px]">{{ lang === 'en' ? 'Township' : 'မြို့နယ်' }}</span>
          <div class="flex flex-col gap-0.5 mt-0.5">
            <span class="text-[#1C1C1C] leading-relaxed font-sans font-bold block">{{ selectedPlace.township }} Township</span>
            <span v-if="selectedPlace.township_my" class="text-[#6C665D] leading-relaxed font-sans text-xs block">{{ selectedPlace.township_my }}မြို့နယ်</span>
          </div>
        </div>
      </div>

      <!-- Address Row -->
      <div class="flex items-start gap-3">
        <MapPin class="w-4 h-4 text-[#A23B24] shrink-0 mt-0.5" />
        <div class="flex-1">
          <span class="text-[#6C665D] block tracking-wide font-bold uppercase text-[9px]">{{ t.addressLabel }}</span>
          <div class="flex flex-col gap-0.5 mt-0.5">
            <span class="text-[#1C1C1C] leading-relaxed font-sans font-light block">{{ selectedPlace.full_address }}</span>
            <span v-if="selectedPlace.full_address_my" class="text-[#6C665D] leading-relaxed font-sans font-light text-xs block">{{ selectedPlace.full_address_my }}</span>
          </div>
        </div>
      </div>

      <!-- Phone Row -->
      <div class="flex items-start gap-3">
        <Phone class="w-4 h-4 text-[#A23B24] shrink-0 mt-0.5" />
        <div>
          <span class="text-[#6C665D] block tracking-wide font-bold uppercase text-[9px]">{{ t.phoneLabel }}</span>
          <a v-if="selectedPlace.phone" :href="'tel:' + selectedPlace.phone" class="text-[#1C1C1C] hover:text-[#A23B24] font-mono mt-0.5 block underline decoration-[#E5E0D8]">
            {{ selectedPlace.phone }}
          </a>
          <span v-else class="text-[#6C665D]/50 italic font-light mt-0.5 block">{{ t.phoneNotAvailable }}</span>
        </div>
      </div>

      <!-- Official Website Website Row -->
      <div class="flex items-start gap-3">
        <Globe class="w-4 h-4 text-[#A23B24] shrink-0 mt-0.5" />
        <div>
          <span class="text-[#6C665D] block tracking-wide font-bold uppercase text-[9px]">{{ t.websiteLabel }}</span>
          <a 
            v-if="selectedPlace.website"
            :href="selectedPlace.website" 
            target="_blank" 
            rel="noreferrer" 
            class="text-[#A23B24] hover:text-[#1C1C1C] flex items-center gap-1 font-mono break-all mt-0.5 underline decoration-[#A23B24]/40"
          >
            <span>{{ selectedPlace.website }}</span>
            <ExternalLink class="w-3 h-3 shrink-0" />
          </a>
          <span v-else class="text-[#6C665D]/50 italic font-light mt-0.5 block">{{ t.websiteNotAvailable }}</span>
        </div>
      </div>
    </section>

    <!-- DIRECT PATH PLOT & TRANSIT DIRECTIONS ENGINE -->
    <section class="border-t border-[#E5E0D8]/70 pt-5 flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <Navigation class="w-4.5 h-4.5 text-[#A23B24] animate-pulse" />
        <h4 class="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
          {{ t.routeTitle }}
        </h4>
      </div>

      <!-- Select starting nodes inputs form -->
      <div class="flex flex-col gap-3.5 bg-[#FAF8F5] p-4 border border-[#E5E0D8] rounded-none">
        <div class="flex flex-col gap-1.5">
          <label class="text-[9px] font-bold text-[#A23B24] uppercase tracking-widest">
            {{ t.startPointLabel }}
          </label>
          <select
            v-model="localRouteStartKey"
            class="w-full px-3 py-2.5 bg-white border border-[#E5E0D8] rounded-none text-xs text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#A23B24] cursor-pointer"
          >
            <option value="hub-station">
              🚉 {{ t.startingHubYangon }}
            </option>
            <option value="hub-pagoda">
              📍 Sule Square Crossings
            </option>
            <option value="hub-airport">
              ✈️ Yangon Airport (RGN)
            </option>
            <option value="gps">
              🌐 {{ t.currentLocation }}
            </option>
          </select>
        </div>

        <!-- Location lookup exceptions info -->
        <div v-if="gpsError" class="text-[10px] bg-amber-500/5 text-[#1C1C1C] px-3 py-2 border border-amber-500/30 font-light">
          ⚠️ {{ gpsError }}
        </div>

        <!-- Run path calculation action trigger -->
        <button
          id="btn-trigger-navigation-comp"
          @click="emitCalculateRoute"
          :disabled="isCalculatingRoute"
          class="w-full py-3 bg-[#1C1C1C] hover:bg-[#A23B24] text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <span v-if="isCalculatingRoute" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <Compass v-else class="w-4 h-4" />
          <span>{{ t.calcRouteBtn }}</span>
        </button>
      </div>

      <!-- Numerical results calculation box sheet -->
      <div v-if="route" id="route-specification-sheet" class="p-4 bg-white border border-[#E5E0D8] flex flex-col gap-4 animate-slide-down text-xs">
        <div class="grid grid-cols-2 gap-4 pb-3 border-b border-[#E5E0D8]/50">
          <div>
            <span class="text-[9px] font-bold text-[#A23B24] uppercase tracking-wider block">{{ t.distance }}</span>
            <span class="text-[#1C1C1C] text-lg font-serif font-semibold italic">{{ route.distanceKm }} km</span>
          </div>
          <div>
            <span class="text-[9px] font-bold text-[#A23B24] uppercase tracking-wider block">{{ t.duration }}</span>
            <span class="text-[#1C1C1C] text-lg font-serif font-semibold italic">~ {{ route.durationMin }} {{ lang === 'en' ? 'min' : 'မိနစ်' }}</span>
          </div>
        </div>


      </div>
    </section>

    <!-- Interactive Location Map (Positioned above related places) -->
    <div class="border-t border-[#E5E0D8]/70 pt-5 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <MapIcon class="w-4 h-4 text-[#A23B24]" />
          <h4 class="text-[10px] font-bold text-[#1C1C1C] uppercase tracking-widest">
            {{ lang === 'en' ? 'Interactive GPS Location Map' : 'မြေပုံကြည့်ရှုရန်' }}
          </h4>
        </div>
        <span class="text-[10px] tracking-widest font-bold uppercase px-2.5 py-0.5 bg-[#FAF8F5] border border-[#E5E0D8] text-[#1C1C1C]">
          {{ selectedPlace.city }}
        </span>
      </div>

      <div class="h-[380px] w-full">
        <MapComponent
          :places="[selectedPlace]"
          :selectedPlace="selectedPlace"
          :hoveredPlace="hoveredPlace"
          :route="route"
          :lang="lang"
          @selectPlace="emitSelectPlace"
        />
      </div>

      <!-- GIS Guide Tips labels -->
      <div class="flex items-start gap-2 text-[11px] text-[#6C665D] p-1.5 hover:text-[#1C1C1C] transition-colors leading-relaxed font-light">
        <Info class="w-4 h-4 text-[#A23B24] shrink-0 mt-0.5" />
        <span>{{ lang === 'en' ? 'Interactive plotting on OpenStreetMap. Hover cards to open tooltips instantly. Plan customized routes from key stations.' : 'မြေပုံတွင် နေရာများကို တိုက်ရိုက်ကြည့်ရှုပါ။ နေရာကတ်များပေါ်တွင် ကာဆာတင်၍ တည်နေရာကတ်များ ဖွင့်ကြည့်နိုင်ပြီး လမ်းကြောင်းတွက်ချက်ကိရိယာ အသုံးပြုနိုင်ပါမည်။' }}</span>
      </div>
    </div>

    <!-- Related spots inside matching category -->
    <section v-if="relatedPlaces.length > 0" class="border-t border-[#E5E0D8]/70 pt-5 flex flex-col gap-3">
      <div>
        <h4 class="text-[10px] font-bold text-[#1C1C1C] uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp class="w-4 h-4 text-[#A23B24] shrink-0" />
          <span>{{ t.relatedPlaces }}</span>
        </h4>
        <p class="text-[11px] text-[#6C665D] font-light mt-0.5">
          {{ t.relatedPlacesDesc }}
        </p>
      </div>

      <!-- 3 Related Horizontals list grid -->
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="relPlace in relatedPlaces"
          :key="relPlace.place_id"
          @click="emitSelectPlace(relPlace)"
          class="p-3 bg-[#FAF8F5] hover:bg-white border border-[#E5E0D8]/70 hover:border-[#A23B24] transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1 shadow-none text-xs group"
        >
          <div>
            <h5 class="font-serif font-semibold text-[#1C1C1C] group-hover:text-[#A23B24] line-clamp-1 leading-snug">
              {{ lang === 'en' ? relPlace.name : relPlace.name_my }}
            </h5>
            <span class="text-[9px] text-[#6C665D]/80 truncate block uppercase tracking-wider font-light">
              {{ lang === 'en' ? relPlace.category : (relPlace.category_my || relPlace.category) }}
            </span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-[#6C665D] mt-1.5 border-t border-[#E5E0D8]/40 pt-1">
            <span class="text-[#A23B24] font-medium font-mono">{{ relPlace.rating }} ★</span>
            <span class="font-mono text-[9px] text-[#6C665D] font-bold">{{ relPlace.distanceText }}</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Place } from '../types';
import MapComponent from './MapComponent.vue';
import { 
  ArrowLeft, X, Star, MapPin, Phone, Globe, ExternalLink, 
  Navigation, Compass, Map as MapIcon, Info, TrendingUp 
} from 'lucide-vue-next';

const props = defineProps<{
  selectedPlace: Place;
  lang: 'en' | 'my';
  t: any;
  route: any;
  routeInstructions: any[];
  routeStartKey: string;
  isCalculatingRoute: boolean;
  gpsError: string | null;
  relatedPlaces: Place[];
  hoveredPlace: Place | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'selectPlace', p: Place): void;
  (e: 'calculateRoute', startKey: string): void;
  (e: 'update:routeStartKey', val: string): void;
}>();

const localRouteStartKey = ref<string>(props.routeStartKey);

watch(() => props.routeStartKey, (val) => {
  localRouteStartKey.value = val;
});

watch(localRouteStartKey, (val) => {
  emit('update:routeStartKey', val);
});

function emitClose() {
  emit('close');
}

function emitSelectPlace(p: Place) {
  emit('selectPlace', p);
}

function emitCalculateRoute() {
  emit('calculateRoute', localRouteStartKey.value);
}
</script>
