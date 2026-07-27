<template>
  <div
    :id="'place-card-' + place.place_id"
    @mouseenter="emitHover(true)"
    @mouseleave="emitHover(false)"
    @click="emitSelect"
    :class="[
      'group p-5 bg-[#FAF8F5]/30 hover:bg-white border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 animate-fade-in',
      hovered
        ? 'border-[#A23B24] shadow-md translate-x-0.5' 
        : 'border-[#E5E0D8] hover:border-[#E5E0D8] shadow-none'
    ]"
  >
    <div class="flex flex-col gap-1.5">
      <div class="flex justify-between items-start gap-3">
        <div class="flex flex-col gap-0.5">
          <h4 class="font-serif font-bold text-[#1C1C1C] group-hover:text-[#A23B24] text-base leading-tight transition-colors">
            {{ place.name }}
          </h4>
          <h5 v-if="place.name_my && place.name_my !== place.name" class="font-sans font-semibold text-xs text-[#6C665D]">
            {{ place.name_my }}
          </h5>
        </div>
        <div class="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
          <template v-if="searchQueryActive">
            <span v-if="isVectorMatch" class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border bg-violet-50 text-violet-700 border-violet-200/60 shadow-sm flex items-center gap-1">
              <span>🤖</span> <span>{{ lang === 'en' ? 'Vector' : 'ဗက်တာ' }}</span>
            </span>
            <span v-else class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border bg-slate-50 text-slate-700 border-slate-200/60 shadow-sm flex items-center gap-1">
              <span>⚡</span> <span>{{ lang === 'en' ? 'Normal' : 'ပုံမှန်' }}</span>
            </span>
          </template>
          <span v-if="place.distanceText" class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border bg-emerald-500/5 text-emerald-700 border-emerald-500/35">
            {{ place.distanceText }}
          </span>
          <span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border bg-[#A23B24]/5 text-[#A23B24] border-[#A23B24]/30">
            {{ t.cityYangon }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-1 text-[11px] text-[#6C665D]">
        <!-- Category and Township row -->
        <div class="flex flex-wrap items-center gap-1.5 tracking-wide">
          <span class="font-bold text-[#A23B24] uppercase text-[10px]">
            {{ place.category }}
            <span v-if="place.category_my && place.category_my !== place.category" class="font-semibold text-[#6C665D]/80 normal-case"> / {{ place.category_my }}</span>
          </span>
          <span class="text-[#E5E0D8]">•</span>
          <span class="font-semibold text-[#1C1C1C]">
            {{ place.township }} Township
            <span v-if="place.township_my" class="font-medium text-[#6C665D] text-[10px]"> ({{ place.township_my }}မြို့နယ်)</span>
          </span>
        </div>
        
        <!-- Address row -->
        <div class="font-light text-[10px] leading-normal" :title="place.full_address + (place.full_address_my ? ' | ' + place.full_address_my : '')">
          <span class="block truncate max-w-full text-[#1C1C1C]/80">{{ place.full_address }}</span>
          <span v-if="place.full_address_my && place.full_address_my !== place.full_address" class="block text-[#6C665D]/80 truncate max-w-full mt-0.5">{{ place.full_address_my }}</span>
        </div>
      </div>
    </div>

    <!-- Mini Stats Box -->
    <div class="flex items-center justify-between border-t border-[#E5E0D8]/60 pt-3 mt-1.5 text-xs text-[#6C665D]">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1 bg-amber-500/5 text-[#1C1C1C] border border-amber-500/35 px-2 py-0.5 font-bold font-mono text-[10px]">
          <span class="text-amber-500">★</span>
          <span>{{ place.rating.toFixed(1) }}</span>
        </div>
        <span class="font-mono text-[10px] font-light">
          ({{ place.review_count.toLocaleString() }} {{ lang === 'en' ? 'reviews' : 'သုံးသပ်ချက်' }})
        </span>
      </div>
      <span class="text-[#1C1C1C] font-bold text-[10px] tracking-widest uppercase group-hover:text-[#A23B24] transition-colors">
        {{ lang === 'en' ? 'SELECT' : 'မြေပုံကြည့်မည်' }} →
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Place } from '../types';

const props = defineProps<{
  place: Place;
  lang: 'en' | 'my';
  hovered: boolean;
  t: any;
  isVectorMatch?: boolean;
  searchQueryActive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'hover', state: boolean): void;
  (e: 'select'): void;
}>();

function emitHover(state: boolean) {
  emit('hover', state);
}

function emitSelect() {
  emit('select');
}
</script>
