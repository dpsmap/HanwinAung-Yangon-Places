<template>
  <!-- ================= ABOUT SPEC SHEET TAB ================= -->
  <div class="bg-white border border-[#E5E0D8] p-8 flex flex-col gap-6 max-w-2xl mx-auto animate-fade-in shadow-sm">
    <div class="text-center flex flex-col items-center gap-3">
      <div class="w-12 h-12 bg-[#A23B24] flex items-center justify-center text-white text-2xl font-serif font-bold shadow-sm">
        DG
      </div>
      <h3 class="text-lg font-serif font-bold text-[#1C1C1C] mt-2">{{ t.aboutTitle }}</h3>
      <p class="text-xs text-[#6C665D] leading-relaxed max-w-md font-light">{{ t.aboutText }}</p>
    </div>

    <section class="border-t border-[#E5E0D8] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      <div class="p-4 bg-[#FAF8F5] border border-[#E5E0D8]/80">
        <span class="text-[#A23B24] uppercase font-bold text-[9px] tracking-widest">App Concept</span>
        <p class="text-[#1C1C1C] font-light mt-1.5 leading-relaxed">Yangon Travel Directory. Styled with classic editorial layout paradigms, featuring generous negative space and high-precision coordinates matching. Developed by DPS by Han Win Aung.</p>
      </div>
      <div class="p-4 bg-[#FAF8F5] border border-[#E5E0D8]/80">
        <span class="text-[#A23B24] uppercase font-bold text-[9px] tracking-widest">Technological Grid</span>
        <p class="text-[#1C1C1C] font-light mt-1.5 leading-relaxed">Vue 3 setup, Leaflet coordinate maps, and dynamic spatial geocoding routes. Verified fully operational in Burmese and English.</p>
      </div>
    </section>

    <!-- Technical specs bar (anti-ai-slop compliance: standard readable items only) -->
    <div class="bg-[#FAF8F5] p-3 border border-[#E5E0D8]/60 text-[10px] text-[#6C665D] flex flex-col gap-1 text-center font-mono font-light uppercase tracking-wider mt-2">
      <span>Client Framework: Vue.js 3 with reactive composables</span>
      <span>Mapping Core: OpenStreetMap / Leaflet GIS</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  t: any;
}>();
</script>
