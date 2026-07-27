<template>
  <div class="relative w-full h-full rounded-none overflow-hidden shadow-sm border border-[#E5E0D8] flex-1 min-h-[350px]">
    <div ref="containerRef" class="w-full h-full bg-[#FAF8F5] relative z-10" />
    
    <!-- Absolute Overlays -->
    <div class="absolute top-4 left-4 z-[1001] bg-[#FAF8F5]/90 backdrop-blur-md py-1 px-3 border border-[#E5E0D8] flex items-center gap-1.5 pointer-events-none shadow-sm">
      <span class="w-2 h-2 rounded-full bg-[#A23B24] animate-pulse"></span>
      <span class="text-[10px] font-mono text-[#1C1C1C] tracking-wide font-medium">GIS ENGINE • ACTIVE MAP</span>
    </div>

    <!-- Floating Category Selector Overlay (Shows when no individual place is selected) -->
    <div v-if="!selectedPlace" class="absolute top-4 right-4 z-[1001] flex items-center gap-1.5 bg-[#FAF8F5]/95 backdrop-blur-md p-1 border border-[#E5E0D8] shadow-md max-w-[calc(100%-140px)] overflow-x-auto scrollbar-none rounded-none">
      <button 
        v-for="catBtn in dynamicMapCategories" 
        :key="catBtn.id"
        @click="selectMapCategory(catBtn.id)"
        :title="lang === 'en' ? catBtn.labelEn : catBtn.labelMy"
        :class="[
          'w-8 h-8 flex items-center justify-center rounded-none text-base transition-all duration-200 cursor-pointer shrink-0',
          (activeCategory || 'all') === catBtn.id 
            ? 'bg-[#A23B24] text-white font-bold scale-105 shadow-sm' 
            : 'bg-white text-[#6C665D] hover:text-[#1C1C1C] hover:bg-[#FAF8F5] border border-[#E5E0D8]/50'
        ]"
      >
        <span>{{ catBtn.icon }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import L from 'leaflet';
import { Place, RouteInfo } from '../types';

const props = withDefaults(
  defineProps<{
    places: Place[];
    selectedPlace: Place | null;
    hoveredPlace: Place | null;
    route: RouteInfo | null;
    lang: 'en' | 'my';
    activeCategory?: string;
  }>(),
  {
    activeCategory: 'all'
  }
);

const emit = defineEmits<{
  (e: 'selectPlace', place: Place): void;
  (e: 'categorySelect', category: string): void;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
let layersGroup: L.LayerGroup | null = null;

// Map categories to specific emojis for marker presentation
function getCategoryIcon(category: string | undefined | null): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('pagoda') || cat.includes('temple') || cat.includes('buddha') || cat.includes('paya') || cat.includes('zedi') || cat.includes('shrine')) return '🛕';
  if (cat.includes('shop') || cat.includes('market') || cat.includes('mall') || cat.includes('bogyoke') || cat.includes('store') || cat.includes('plaza') || cat.includes('junction')) return '🛍️';
  if (cat.includes('park') || cat.includes('nature') || cat.includes('lake') || cat.includes('garden') || cat.includes('forest')) return '🌳';
  if (cat.includes('cultural') || cat.includes('museum') || cat.includes('station') || cat.includes('art') || cat.includes('monument') || cat.includes('gallery') || cat.includes('history') || cat.includes('heritage') || cat.includes('secretariat') || cat.includes('palace')) return '🏛️';
  if (cat.includes('hotel') || cat.includes('hostel') || cat.includes('inn') || cat.includes('stay') || cat.includes('resort')) return '🏨';
  if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('tea') || cat.includes('beverage') || cat.includes('boba')) return '☕';
  if (cat.includes('bakery') || cat.includes('bread') || cat.includes('cake') || cat.includes('donut') || cat.includes('sweet') || cat.includes('pastry')) return '🍰';
  if (cat.includes('pizza') || cat.includes('italian') || cat.includes('pasta')) return '🍕';
  if (cat.includes('burger') || cat.includes('fast food') || cat.includes('fried chicken') || cat.includes('kfc')) return '🍔';
  if (cat.includes('restaurant') || cat.includes('food') || cat.includes('dining') || cat.includes('eat') || cat.includes('bistro') || cat.includes('kitchen')) return '🍴';
  if (cat.includes('bar') || cat.includes('pub') || cat.includes('club') || cat.includes('lounge') || cat.includes('beer') || cat.includes('wine')) return '🍺';
  return '📍';
}

const dynamicMapCategories = computed(() => {
  const cats = new Set<string>();
  props.places.forEach((p) => {
    if (p.category) {
      cats.add(p.category);
    }
  });

  const list = [
    { id: 'all', icon: '🗺️', labelEn: 'All Places', labelMy: 'အားလုံး' }
  ];

  const sortedCats = Array.from(cats).sort();
  sortedCats.forEach((cat) => {
    const match = props.places.find((p) => p.category === cat);
    const labelMy = match?.category_my || cat;
    list.push({
      id: cat,
      icon: getCategoryIcon(cat),
      labelEn: cat,
      labelMy: labelMy
    });
  });

  return list;
});

function selectMapCategory(catId: string) {
  emit('categorySelect', catId);
}

function getShortCategoryLabel(place: Place, lang: 'en' | 'my'): string {
  const cat = (lang === 'en' ? place.category : place.category_my) || '';
  if (lang === 'en') {
    if (cat.includes('Pagoda') || cat.includes('Temple')) return 'Temple';
    if (cat.includes('Shopping') || cat.includes('Market')) return 'Shop';
    if (cat.includes('Park') || cat.includes('Nature')) return 'Park';
    if (cat.includes('Cultural') || cat.includes('Museum')) return 'Culture';
    if (cat.includes('Restaurant')) return 'Food';
    if (cat.includes('Cafe')) return 'Cafe';
    if (cat.includes('Hotel')) return 'Hotel';
    if (cat.includes('Bakery')) return 'Bakery';
    if (cat.includes('Bar') || cat.includes('Pub')) return 'Bar';
    return cat;
  } else {
    if (cat.includes('ဘုရား') || cat.includes('ကျောင်းတော်')) return 'ဘုရား';
    if (cat.includes('ဈေး') || cat.includes('ဝယ်ခြင်း')) return 'ဈေး';
    if (cat.includes('ပန်းခြံ') || cat.includes('သဘာဝ')) return 'ပန်းခြံ';
    if (cat.includes('ယဉ်ကျေးမှု') || cat.includes('ပြတိုက်')) return 'ယဉ်ကျေးမှု';
    if (cat.includes('စားသောက်ဆိုင်') || cat.includes('အစားအစာ')) return 'ဆိုင်';
    if (cat.includes('ကဖေး')) return 'ကဖေး';
    if (cat.includes('ဟိုတယ်')) return 'ဟိုတယ်';
    if (cat.includes('မုန့်')) return 'မုန့်ဆိုင်';
    if (cat.includes('ဘား')) return 'ဘား';
    return cat;
  }
}

onMounted(() => {
  if (!containerRef.value) return;

  const initialLat = props.selectedPlace ? props.selectedPlace.lat : 16.7984;
  const initialLon = props.selectedPlace ? props.selectedPlace.lon : 96.1497;
  const initialZoom = props.selectedPlace ? 15 : 12;

  map = L.map(containerRef.value, {
    center: [initialLat, initialLon],
    zoom: initialZoom,
    zoomControl: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  layersGroup = L.layerGroup().addTo(map);

  map.on('zoomend', redrawLayers);

  // Initial render
  redrawLayers();
  updateMapView();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
    layersGroup = null;
  }
});

function updateMapView() {
  if (!map) return;

  if (props.route) {
    const routeBounds = L.latLngBounds([props.route.startCoords, props.route.endCoords]);
    map.fitBounds(routeBounds, { padding: [50, 50], animate: true, duration: 1.2 });
  } else if (props.selectedPlace) {
    map.setView([props.selectedPlace.lat, props.selectedPlace.lon], 15, { animate: true, duration: 1.0 });
  } else if (props.places.length > 0) {
    const bounds = props.places.map((place) => [place.lat, place.lon] as L.LatLngExpression);
    const groupBounds = L.latLngBounds(bounds);
    map.fitBounds(groupBounds, { padding: [40, 40], animate: true, duration: 1.0 });
  } else {
    map.setView([16.7984, 96.1497], 12, { animate: true, duration: 1.0 });
  }
}

function redrawLayers() {
  if (!map || !layersGroup) return;

  const currentZoom = map.getZoom();
  const showAllLabels = currentZoom >= 13;

  layersGroup.clearLayers();

  props.places.forEach((place) => {
    const isSelected = props.selectedPlace?.place_id === place.place_id;
    const isHovered = props.hoveredPlace?.place_id === place.place_id;

    const markerColor = isSelected ? '#A23B24' : isHovered ? '#1C1C1C' : '#8A8276';
    const markerSize = isSelected ? 34 : isHovered ? 28 : 24;
    const bgOpacity = isSelected ? '0.3' : isHovered ? '0.2' : '0.12';
    const animationHtml = isSelected ? 'animation: ping 1.8s infinite;' : '';
    const categoryEmoji = getCategoryIcon(place.category);
    const shortCategory = getShortCategoryLabel(place, props.lang);

    const showLabel = isSelected || isHovered || showAllLabels;
    const labelHtml = showLabel ? `
        <!-- Label beneath marker -->
        <div class="map-label" style="
          position: absolute;
          bottom: -15px;
          background-color: ${isSelected ? '#1C1C1C' : '#FAF8F5'};
          color: ${isSelected ? '#ffffff' : '#1C1C1C'};
          padding: 1px 5px;
          font-size: 8px;
          font-family: sans-serif;
          font-weight: 700;
          letter-spacing: 0.03em;
          border-radius: 2px;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          pointer-events: none;
          z-index: 5;
          opacity: ${isSelected || isHovered ? '1' : '0.85'};
          transform: scale(${isSelected || isHovered ? '1.05' : '0.95'});
          transition: all 0.15s ease-in-out;
          border: 1px solid ${isSelected ? '#A23B24' : '#E5E0D8'};
        ">
          ${shortCategory}
        </div>
    ` : '';

    const iconHtml = `
      <div style="position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; justify-content: center; width: ${markerSize + 12}px; height: ${markerSize + 12}px; overflow: visible !important;">
        <!-- Pulsing background ring -->
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${markerColor}; opacity: ${bgOpacity}; ${animationHtml}"></div>
        <!-- Inner round content button -->
        <div style="
          width: ${markerSize}px; 
          height: ${markerSize}px; 
          border-radius: 50%; 
          background-color: ${isSelected ? '#A23B24' : '#ffffff'}; 
          border: 2px solid ${isSelected ? '#ffffff' : markerColor}; 
          box-shadow: 0 3px 6px rgba(0,0,0,0.16); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: ${markerSize * 0.55}px; 
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        ">
          ${categoryEmoji}
        </div>
        ${labelHtml}
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-place-marker',
      iconSize: [markerSize + 12, markerSize + 12],
      iconAnchor: [(markerSize + 12) / 2, (markerSize + 12) / 2],
    });

    const tooltipText = props.lang === 'en' ? place.name : place.name_my;
    const categoryText = props.lang === 'en' ? place.category : place.category_my;
    const addressText = props.lang === 'en' ? place.full_address : place.full_address_my;
    const townshipText = props.lang === 'en' ? (place.township ? place.township + ' Township' : '') : (place.township_my ? place.township_my + 'မြို့နယ်' : '');

    const popupHtml = `
      <div class="p-2 font-sans text-xs flex flex-col gap-2">
        <div>
          <h4 class="font-serif font-bold text-[#1C1C1C] leading-snug text-sm">${tooltipText}</h4>
          <p class="text-[10px] text-[#A23B24] font-bold uppercase tracking-wider my-0.5">${categoryText}</p>
          ${townshipText ? `<p class="text-[10px] text-[#A23B24] font-bold mb-1">📍 ${townshipText}</p>` : ''}
          <p class="text-[11px] text-[#6C665D] mt-1 line-clamp-2 leading-relaxed font-light">${addressText}</p>
        </div>
        <div class="flex items-center justify-between border-t border-[#E5E0D8]/50 pt-1.5 mt-1">
          <div class="flex items-center gap-1 text-amber-500 text-xs">
            <span>★</span> <span class="text-[#1C1C1C] font-semibold">${place.rating}</span>
            <span class="text-[#6C665D] text-[10px]">(${place.review_count})</span>
          </div>
          <button class="see-details-btn bg-[#A23B24] text-white hover:bg-[#1C1C1C] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm cursor-pointer transition-all duration-200">
            ${props.lang === 'en' ? 'See Details →' : 'အသေးစိတ်ကြည့်ရန် →'}
          </button>
        </div>
      </div>
    `;

    const marker = L.marker([place.lat, place.lon], { icon: customIcon })
      .bindPopup(popupHtml, { closeButton: false, minWidth: 200 })
      .addTo(layersGroup);

    marker.on('popupopen', () => {
      const popup = marker.getPopup();
      if (popup) {
        const container = popup.getElement();
        if (container) {
          const btn = container.querySelector('.see-details-btn');
          if (btn) {
            L.DomEvent.on(btn, 'click', (e) => {
              L.DomEvent.stopPropagation(e);
              L.DomEvent.preventDefault(e);
              emit('selectPlace', place);
            });
          }
        }
      }
    });

    if (isHovered && !isSelected) {
      marker.openPopup();
    }
  });

  // Handle routing path plotting
  if (props.route) {
    L.polyline(props.route.path, {
      color: '#A23B24', // terracotta focus route path
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(layersGroup);

    const startIconHtml = `
      <div style="position: absolute; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; width: 22px; height: 22px;">
        <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #1C1C1C; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25);"></div>
      </div>
    `;
    const startIcon = L.divIcon({
      html: startIconHtml,
      className: 'custom-start-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker(props.route.startCoords, { icon: startIcon })
      .bindPopup(`
        <div class="p-1 font-sans text-xs">
          <span class="font-bold text-[#A23B24] uppercase tracking-wider block text-[10px]">${props.lang === 'en' ? 'Start Hub:' : 'လမ်းကြောင်းအစ:'}</span>
          <span class="text-[#1C1C1C] font-semibold">${props.route.startName}</span>
        </div>
      `)
      .addTo(layersGroup);
  }
}

watch(
  () => [props.places, props.selectedPlace, props.hoveredPlace, props.route, props.lang, props.activeCategory],
  () => {
    redrawLayers();
  },
  { deep: true }
);

watch(
  () => [props.selectedPlace, props.route],
  () => {
    updateMapView();
  }
);

watch(
  () => props.places.map((p) => p.place_id).join(','),
  () => {
    updateMapView();
  }
);
</script>
