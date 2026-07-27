<template>
  <div id="app-viewport" class="min-h-screen bg-[#FAF8F5] text-[#1C1C1C] flex flex-col font-sans antialiased selection:bg-[#A23B24]/10 selection:text-[#A23B24]">
    
    <!-- FULL-SCREEN LOADING SCREEN -->
    <transition name="fade">
      <div 
        v-if="isLoading" 
        class="fixed inset-0 bg-[#FAF8F5] z-[100] flex flex-col items-center justify-center p-6 text-center"
      >
        <div class="max-w-md w-full flex flex-col items-center gap-8">
          <div class="relative flex items-center justify-center">
            <div class="w-16 h-16 bg-[#A23B24] flex items-center justify-center text-white text-3xl font-serif font-bold tracking-tighter shadow-md animate-pulse">
              Y
            </div>
            <div class="absolute -inset-4 border border-[#A23B24]/20 rounded-full animate-[spin_8s_linear_infinite]" />
            <div class="absolute -inset-8 border border-[#A23B24]/10 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
          </div>

          <div>
            <h1 class="text-2xl md:text-3xl font-serif font-semibold text-[#1C1C1C] leading-none tracking-tight">
              Yangon Places
            </h1>
            <p class="text-[11px] text-[#A23B24] font-medium tracking-widest mt-2.5 uppercase">
              {{ lang === 'en' ? 'A Living Directory of Yangon' : 'ရန်ကုန်မြို့၏ သမိုင်းဝင်နှင့် ထင်ရှားသောနေရာများ' }}
            </p>
          </div>

          <div class="w-full bg-[#E5E0D8] h-2.5 rounded-full overflow-hidden border border-[#E5E0D8]/40 relative">
            <div 
              class="bg-[#A23B24] h-full transition-all duration-300 ease-out rounded-full"
              :style="{ width: (totalCount > 0 ? loadingProgressPercentage : 5) + '%' }"
            />
          </div>

          <div class="flex flex-col gap-1 w-full">
            <p class="text-sm font-serif font-semibold text-[#1C1C1C]">
              {{ lang === 'en' ? 'Loading Directory Indices' : 'အချက်အလက်များ ယူဆောင်နေပါသည်' }}...
            </p>
            <p class="text-xs text-[#6C665D] font-light font-mono mt-1.5 bg-[#FAF8F5] border border-[#E5E0D8] px-3 py-1.5 rounded shadow-sm inline-block mx-auto">
              <span v-if="totalCount > 0">
                {{ lang === 'en' ? 'Retrieved' : 'ရယူပြီး' }} 
                <span class="font-bold text-[#A23B24]">{{ loadedCount.toLocaleString() }}</span> 
                {{ lang === 'en' ? 'of' : 'စုစုပေါင်း' }} 
                <span class="font-bold">{{ totalCount.toLocaleString() }}</span> 
                {{ lang === 'en' ? 'places' : 'ခု' }} 
                <span class="text-[#A23B24] ml-1 font-bold">({{ loadingProgressPercentage }}%)</span>
              </span>
              <span v-else class="animate-pulse">
                {{ lang === 'en' ? 'Initializing index stream protocols...' : 'အချက်အလက်များ စတင်ပြင်ဆင်နေပါသည်...' }}
              </span>
            </p>
          </div>

          <div class="pt-4 border-t border-[#E5E0D8] w-full text-[11px] text-[#6C665D] leading-relaxed max-w-sm">
            {{ lang === 'en' 
              ? 'Optimized for high-speed streaming of over 26,000 localized Yangon landmarks, cultural centers, and heritage sites.' 
              : 'ရန်ကုန်တစ်ခွင်ရှိ နေရာပေါင်း ၂၆,၀၀၀ ကျော်ကို အမြန်နှုန်းအမြင့်မားဆုံးဖြင့် တိုက်ရိုက်ရယူနေပါသည်။'
            }}
          </div>
        </div>
      </div>
    </transition>

    <!-- 1. HEADER BANNER COMPONENT -->
    <HeaderBanner
      v-model:activeTab="activeTab"
      v-model:isMobileMenuOpen="isMobileMenuOpen"
      :lang="lang"
      @setLang="setLang"
    />



    <!-- 3. MAIN BODY VIEWS -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

      <!-- ================= HOME TAB VIEW ================= -->
      <HomeTabView
        v-if="activeTab === 'home'"
        :lang="lang"
        :places="places"
        :isAcquiringGps="isAcquiringGps"
        :gpsStatusMessage="gpsStatusMessage"
        @search="handleHomeSearch"
        @selectPlace="handleHomeSelectPlace"
        @emitExplorer="setActiveTab('explorer')"
        @triggerGps="triggerGpsLocate"
      />

      <!-- ================= EXPLORER DIRECTORY TAB ================= -->
      <div v-else-if="activeTab === 'explorer'" class="flex flex-col gap-6 animate-fade-in w-full">
        
        <!-- EXPLORER FILTERS COMPONENT -->
        <FilterSidebar
          v-model:localSearchQuery="localSearchQuery"
          v-model:isSearchFocused="isSearchFocused"
          v-model:showAdvancedFilters="showAdvancedFilters"
          v-model:categorySearchInputText="categorySearchInputText"
          v-model:showCategoryDropdown="showCategoryDropdown"
          v-model:selectedCategory="selectedCategory"
          v-model:selectedTownship="selectedTownship"
          v-model:minRating="minRating"
          v-model:sortBy="sortBy"
          v-model:smartSearchEnabled="smartSearchEnabled"
          v-model:customVectorApiUrl="customVectorApiUrl"
          :vectorApiAvailable="vectorApiAvailable"
          :suggestions="suggestions"
          :filteredSearchCategories="filteredSearchCategories"
          :availableTownships="availableTownships"
          :lang="lang"
          :t="t"
          :searchQueryActive="searchQuery.trim() !== ''"
          :getCatLabelText="getCatLabelText"
          :isAcquiringGps="isAcquiringGps"
          :gpsStatusMessage="gpsStatusMessage"
          @executeSearch="executeSearch"
          @clearSearch="clearSearch"
          @selectSuggestion="selectSuggestion"
          @selectCategoryOption="selectCategoryOption"
          @categoryFocus="handleCategoryInputFocus"
          @categoryBlur="handleCategoryInputBlur"
          @searchBlur="handleSearchBlur"
          @triggerGps="triggerGpsLocate"
        />

        <!-- EXPLORATION GIS DUAL GRID -->
        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
          
          <!-- LEFT COLUMN: LIST / DETAILED SHEETS -->
          <div class="lg:col-span-7 flex flex-col gap-5 h-full w-full">
            
            <div v-if="isLoading" class="bg-white border border-[#E5E0D8] p-12 flex flex-col items-center justify-center gap-4 text-center min-h-[450px]">
              <div class="w-10 h-10 border-2 border-[#E5E0D8] border-t-[#A23B24] animate-spin" />
              <p class="text-xs text-[#6C665D] font-light">Retrieving travel directory index streams...</p>
            </div>

            <!-- Primary Landmarks Catalog View -->
            <div v-else-if="!selectedPlace" class="bg-white border border-[#E5E0D8] p-5 flex flex-col gap-4 min-h-[500px] animate-fade-in shadow-sm w-full">
              <div class="flex items-center justify-between border-b border-[#E5E0D8]/70 pb-3">
                <div class="flex items-center gap-2">
                  <span class="bg-[#FAF8F5] text-[#A23B24] border border-[#E5E0D8] px-2.5 py-0.5 text-xs font-mono font-bold">
                    {{ filteredPlaces.length }}
                  </span>
                  <h3 class="text-xs font-bold text-[#1C1C1C] tracking-widest uppercase">
                    {{ lang === 'en' ? 'MATCHED LANDMARKS' : 'ကိုက်ညီသော နေရာများ' }}
                  </h3>
                  <!-- High-fidelity search status indicators -->
                  <span v-if="isVectorSearching" class="text-[9px] text-[#A23B24] font-mono animate-pulse flex items-center gap-1.5 ml-2">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#A23B24]" />
                    <span>{{ lang === 'en' ? 'Vector Match...' : 'ဗက်တာရှာဖွေနေဆဲ...' }}</span>
                  </span>
                  <span v-else-if="vectorApiAvailable && smartSearchEnabled && searchQuery.trim() !== ''" class="text-[8px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 uppercase tracking-wider ml-2">
                    {{ lang === 'en' ? '🤖 Vector Active' : '🤖 ဗက်တာကိုက်ညီမှု' }}
                  </span>
                  <span v-else-if="smartSearchEnabled && searchQuery.trim() !== ''" class="text-[8px] text-[#A23B24] font-mono font-bold bg-[#A23B24]/5 px-1.5 py-0.5 border border-[#A23B24]/10 uppercase tracking-wider ml-2">
                    {{ lang === 'en' ? '⚡ Local Match' : '⚡ ဒေသတွင်းကိုက်ညီမှု' }}
                  </span>
                </div>
                <span class="text-[10px] text-[#6C665D] font-light italic">
                  {{ lang === 'en' ? 'Select place to trigger coordinates' : 'အသေးစိတ်ကြည့်ရန် နှိပ်ပါ' }}
                </span>
              </div>

              <!-- Did you mean / Spelling suggestion -->
              <div v-if="didYouMeanSuggestion" class="bg-[#FAF8F5] border border-l-4 border-l-[#A23B24] border-[#E5E0D8] p-3 text-xs animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-[#A23B24] uppercase text-[10px] tracking-wider">
                    {{ lang === 'en' ? 'Did you mean:' : 'ဤသို့ရှာလိုပါသလား:' }}
                  </span>
                  <button 
                    @click="applyDidYouMean(didYouMeanSuggestion)"
                    class="font-serif italic font-semibold text-[#1C1C1C] underline hover:text-[#A23B24] transition-colors cursor-pointer text-left"
                  >
                    "{{ didYouMeanSuggestion }}"
                  </button>
                </div>
                <button
                  @click="applyDidYouMean(didYouMeanSuggestion)"
                  class="px-2.5 py-1 bg-[#1C1C1C] text-white text-[9px] font-bold uppercase hover:bg-[#A23B24] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  {{ lang === 'en' ? 'Search This' : 'ဤစကားလုံးဖြင့် ရှာမည်' }}
                </button>
              </div>

              <!-- Narrow Down options for too many options -->
              <div v-if="searchOptionsSuggest" class="bg-[#FAF8F5] border border-l-4 border-l-[#1C1C1C] border-[#E5E0D8] p-3 text-xs animate-fade-in flex flex-col gap-2">
                <span class="font-bold text-[#6C665D] uppercase text-[10px] tracking-wider">
                  {{ lang === 'en' ? 'Narrow down your search results:' : 'ရှာဖွေမှုကို ပိုမိုတိကျစေရန် စစ်ထုတ်ရန်:' }}
                </span>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-for="(opt, oIdx) in searchOptionsSuggest"
                    :key="oIdx"
                    @click="applyNarrowDown(opt.type, opt.value)"
                    class="px-2.5 py-1 bg-white border border-[#E5E0D8] text-[10px] text-[#1C1C1C] hover:border-[#A23B24] hover:text-[#A23B24] transition-all cursor-pointer flex items-center gap-1 font-mono uppercase font-semibold"
                  >
                    <span class="text-[#A23B24] text-[9px] font-bold">{{ opt.type === 'township' ? '@' : '#' }}</span>
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <!-- Inline Sort By Feature directly in search results -->
              <div v-if="filteredPlaces.length > 0" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF8F5] border border-[#E5E0D8]/60 p-3 animate-fade-in">
                <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-[#A23B24] flex items-center gap-1.5 shrink-0 font-sans">
                  <ArrowUpDown class="w-3.5 h-3.5 text-[#A23B24]" />
                  {{ lang === 'en' ? 'SORT RESULTS BY:' : 'ရလဒ်များကို စီရန်:' }}
                </span>
                <div class="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <button
                    v-if="searchQuery.trim() !== ''"
                    @click="sortBy = 'relevance'"
                    :class="[
                      'px-3 py-1.5 text-[9px] font-mono font-bold uppercase border tracking-wider transition-all cursor-pointer rounded-none',
                      sortBy === 'relevance' 
                        ? 'bg-[#A23B24] border-[#A23B24] text-white shadow-sm' 
                        : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
                    ]"
                  >
                    {{ lang === 'en' ? 'Best Match' : 'ကိုက်ညီမှု' }}
                  </button>
                  <button
                    @click="showMoreResults = !showMoreResults"
                    :class="[
                      'px-3 py-1.5 text-[9px] font-mono font-bold uppercase border tracking-wider transition-all cursor-pointer rounded-none ml-2',
                      showMoreResults ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white' : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
                    ]"
                  >
                    {{ showMoreResults ? (lang === 'en' ? 'Show fewer' : 'နည်းစေ') : (lang === 'en' ? 'Show more' : 'ပိုများ') }}
                  </button>
                  <button
                    @click="sortBy = 'rating'"
                    :class="[
                      'px-3 py-1.5 text-[9px] font-mono font-bold uppercase border tracking-wider transition-all cursor-pointer rounded-none',
                      sortBy === 'rating' 
                        ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white shadow-sm' 
                        : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
                    ]"
                  >
                    {{ lang === 'en' ? 'Rating' : 'အဆင့်စု' }}
                  </button>
                  <button
                    @click="sortBy = 'reviews'"
                    :class="[
                      'px-3 py-1.5 text-[9px] font-mono font-bold uppercase border tracking-wider transition-all cursor-pointer rounded-none',
                      sortBy === 'reviews' 
                        ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white shadow-sm' 
                        : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
                    ]"
                  >
                    {{ lang === 'en' ? 'Reviews' : 'သုံးသပ်ချက်' }}
                  </button>
                  <button
                    @click="sortBy = 'name'"
                    :class="[
                      'px-3 py-1.5 text-[9px] font-mono font-bold uppercase border tracking-wider transition-all cursor-pointer rounded-none',
                      sortBy === 'name' 
                        ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white shadow-sm' 
                        : 'bg-white border-[#E5E0D8] text-[#6C665D] hover:bg-[#FAF8F5]'
                    ]"
                  >
                    {{ lang === 'en' ? 'Name' : 'အမည်' }}
                  </button>
                </div>
              </div>

              <!-- Empty Matches Drawer -->
              <div v-if="filteredPlaces.length === 0" class="flex flex-col items-center justify-center text-center py-24 px-4 gap-4 bg-[#FAF8F5] border border-dashed border-[#E5E0D8]">
                <AlertCircle class="w-8 h-8 text-[#6C665D]/40" />
                <h4 class="text-sm font-serif font-semibold text-[#1C1C1C]">{{ t.noResults }}</h4>
                <p class="text-xs text-[#6C665D] max-w-sm font-light leading-relaxed">No matching listings found. Try resetting filters or adjusting search queries.</p>
                <button
                  @click="resetSearchFilters"
                  class="mt-2 px-4 py-2 bg-[#1C1C1C] hover:bg-[#A23B24] text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
                >
                  RESET GRID
                </button>
              </div>

              <!-- Paginated Results Panel Layout -->
              <div v-else class="flex flex-col gap-3">
                <PlaceCard
                  v-for="place in paginatedPlaces"
                  :key="place.place_id"
                  :place="place"
                  :lang="lang"
                  :hovered="hoveredPlace?.place_id === place.place_id"
                  :t="t"
                  :isVectorMatch="vectorSearchResults.some(r => r.place_id === place.place_id && r.is_vector !== false)"
                  :searchQueryActive="searchQuery.trim() !== ''"
                  @hover="hoveredPlace = $event ? place : null"
                  @select="triggerSelectPlace(place)"
                />

                <!-- Modern Elegant Pagination Controls -->
                <div v-if="totalPages > 1" class="flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-[#E5E0D8]/70 pt-4 mt-2">
                  <div class="flex items-center justify-between w-full lg:w-auto gap-3">
                    <button
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                      class="px-3 py-1.5 border border-[#1C1C1C] text-[10px] font-mono font-bold tracking-wider uppercase transition-all disabled:opacity-35 disabled:pointer-events-none cursor-pointer hover:bg-[#1C1C1C] hover:text-white animate-fade-in"
                    >
                      ← {{ lang === 'en' ? 'Prev' : 'ယခင်' }}
                    </button>
                    
                    <div class="flex items-center gap-1 flex-wrap justify-center font-mono">
                      <template v-for="(page, pIdx) in visiblePages" :key="pIdx">
                        <span
                          v-if="page === '...'"
                          class="px-1 text-[10px] font-bold text-[#6C665D]"
                        >
                          ...
                        </span>
                        <button
                          v-else
                          @click="currentPage = Number(page)"
                          :class="[
                            'w-7 h-7 flex items-center justify-center border text-[10px] font-bold transition-all cursor-pointer',
                            currentPage === Number(page)
                              ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white shadow-sm'
                              : 'bg-white border-[#E5E0D8] text-[#1C1C1C] hover:border-[#A23B24] hover:text-[#A23B24]'
                          ]"
                        >
                          {{ page }}
                        </button>
                      </template>
                    </div>

                    <button
                      :disabled="currentPage === totalPages"
                      @click="currentPage++"
                      class="px-3 py-1.5 border border-[#1C1C1C] text-[10px] font-mono font-bold tracking-wider uppercase transition-all disabled:opacity-35 disabled:pointer-events-none cursor-pointer hover:bg-[#1C1C1C] hover:text-white animate-fade-in"
                    >
                      {{ lang === 'en' ? 'Next' : 'နောက်' }} →
                    </button>
                  </div>

                  <!-- Typable Page Input -->
                  <div class="flex items-center gap-2 text-[10px] font-mono text-[#6C665D] bg-[#FAF8F5] px-3 py-1.5 border border-[#E5E0D8] w-full lg:w-auto justify-center sm:justify-start">
                    <span>{{ lang === 'en' ? 'GO TO PAGE:' : 'စာမျက်နှာသို့:' }}</span>
                    <input
                      type="text"
                      v-model="pageInputVal"
                      @keydown.enter="handlePageInputSubmit"
                      @blur="handlePageInputSubmit"
                      class="w-10 px-1 py-0.5 border border-[#E5E0D8] text-center text-[10px] font-bold text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#A23B24] focus:border-[#A23B24] bg-white rounded-none"
                    />
                    <span>/ {{ totalPages }}</span>
                    <button
                      @click="handlePageInputSubmit"
                      class="ml-1 px-1.5 py-0.5 bg-[#1C1C1C] text-white hover:bg-[#A23B24] text-[9px] font-bold uppercase transition-all cursor-pointer"
                    >
                      GO
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Landmark Specifications & Route Generation Sheets -->
            <PlaceDetailDrawer
              v-else
              :selectedPlace="selectedPlace"
              :lang="lang"
              :t="t"
              :route="route"
              :routeInstructions="routeInstructions"
              v-model:routeStartKey="routeStartKey"
              :isCalculatingRoute="isCalculatingRoute"
              :gpsError="gpsError"
              :relatedPlaces="relatedPlaces"
              :hoveredPlace="hoveredPlace"
              @close="selectedPlace = null"
              @selectPlace="triggerSelectPlace"
              @calculateRoute="handleCalculateRoute"
            />
          </div>

          <!-- RIGHT COLUMN: INTERACTIVE MAP (Sticky on desktop) -->
          <div class="lg:col-span-5 w-full lg:sticky lg:top-6 flex flex-col gap-4 bg-white border border-[#E5E0D8] p-4 shadow-sm h-[400px] lg:h-[650px] animate-fade-in z-20">
            <div class="flex items-center justify-between border-b border-[#E5E0D8]/70 pb-2">
              <div class="flex items-center gap-2">
                <MapIcon class="w-4 h-4 text-[#A23B24]" />
                <h4 class="text-[10px] font-bold text-[#1C1C1C] uppercase tracking-widest">
                  {{ selectedPlace ? (lang === 'en' ? 'Location Detail' : 'တည်နေရာအသေးစိတ်') : (lang === 'en' ? 'Interactive Explorer Map' : 'အပြန်အလှန်အကျိုးပြုမြေပုံ') }}
                </h4>
              </div>
              <span v-if="selectedPlace" class="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-[#FAF8F5] border border-[#E5E0D8] text-[#1C1C1C]">
                {{ selectedPlace.city }}
              </span>
              <span v-else class="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-[#FAF8F5] border border-[#E5E0D8] text-[#A23B24]">
                {{ lang === 'en' ? 'Live Pins' : 'မြေပုံအညွှန်း' }}
              </span>
            </div>
            
            <div class="flex-1 w-full relative min-h-0">
              <MapComponent
                :places="mapPlaces"
                :selectedPlace="selectedPlace"
                :hoveredPlace="hoveredPlace"
                :route="route"
                :lang="lang"
                :activeCategory="selectedCategory"
                @selectPlace="triggerSelectPlace"
                @categorySelect="selectedCategory = $event"
              />
            </div>
          </div>

        </div>
      </div>



      <!-- ================= ABOUT SPEC SHEET TAB ================= -->
      <AboutTabView
        v-else-if="activeTab === 'about'"
        :t="t"
      />

    </main>

    <!-- 4. FOOTER CREDITS -->
    <footer id="app-credits" class="border-t border-[#E5E0D8] bg-[#FAF8F5] py-8 text-[11px] text-[#6C665D] tracking-wider mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span class="font-serif font-semibold text-[#1C1C1C] text-sm tracking-tight">Yangon Places</span>
          <span class="hidden sm:inline text-[#E5E0D8]">|</span>
          <span class="font-light">Crafted for the spatial mapping community</span>
        </div>
        <div class="flex items-center gap-4 text-[11px] font-mono tracking-wider">
          <span>© 2026 — ALL RIGHTS RESERVED.</span>
          <Languages class="w-3.5 h-3.5 text-[#A23B24]" />
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { 
  Languages, 
  Map as MapIcon, 
  AlertCircle,
  ArrowUpDown
} from 'lucide-vue-next';

// Models, Translations and Service Layers
import { Place, Language, RouteInfo } from './types';
import { TRANSLATIONS } from './translations';
import { fetchPlacesFromSource, fetchPlacesPreview } from './lib/dataService';
import Fuse from 'fuse.js';
import { generateRouteInfo, generateNavigationSteps, DirectionStep, calculateHaversineDistance } from './utils/navigation';
import { 
  TOWNSHIPS_MAP, 
  enrichQueryWithTransliteration, 
  isNameMatch, 
  enrichPlacesWithTownship,
  BM25SearchIndex,
  precomputeQuery,
  calculateMatchScoreFast,
  placeMatchesKeywordSimple,
  buildDidYouMeanDictionary,
  getDidYouMeanSuggestion,
  getAllQueryVariants,
  DidYouMeanDictionary
} from './utils/search';

// Newly extracted decoupled SFC components
import HeaderBanner from './components/HeaderBanner.vue';
import HomeTabView from './components/HomeTabView.vue';
import AboutTabView from './components/AboutTabView.vue';
import PlaceCard from './components/PlaceCard.vue';
import PlaceDetailDrawer from './components/PlaceDetailDrawer.vue';
import FilterSidebar from './components/FilterSidebar.vue';
import MapComponent from './components/MapComponent.vue';

// Localisation Language Settings
const YANGON_CENTER_FALLBACK: [number, number] = [16.7828, 96.1614];
const lang = ref<Language>('en');
function setLang(newLang: Language) {
  lang.value = newLang;
}

const t = computed(() => TRANSLATIONS[lang.value]);

// Data fetch states
const places = ref<Place[]>([]);
const isLoading = ref<boolean>(true);
const isPreviewLoading = ref<boolean>(false);
const loadedCount = ref<number>(0);
const totalCount = ref<number>(0);

const loadingProgressPercentage = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((loadedCount.value / totalCount.value) * 100);
});

// Reactive Fuse.js instance, BM25 Search Index, and spelling dictionary for ultra-fast, high-relevance client-side searching
const fuseInstance = ref<Fuse<Place> | null>(null);
const bm25Index = ref<BM25SearchIndex | null>(null);
const didYouMeanDictionary = ref<DidYouMeanDictionary>({
  wordsSet: new Set(),
  wordsList: [],
  byLength: {}
});

const placesMap = computed(() => {
  const map = new Map<string, Place>();
  places.value.forEach((p) => {
    map.set(p.place_id, p);
  });
  return map;
});

// Watch loaded places dataset to compile and optimize search indexes instantly
watch(places, (newPlaces) => {
  if (newPlaces && newPlaces.length > 0) {
    bm25Index.value = new BM25SearchIndex(newPlaces);
    didYouMeanDictionary.value = buildDidYouMeanDictionary(newPlaces);
    fuseInstance.value = new Fuse(newPlaces, {
      keys: [
        { name: 'name', weight: 1.0 },
        { name: 'name_my', weight: 1.0 },
        { name: 'tags', weight: 0.9 },
        { name: 'category', weight: 0.6 },
        { name: 'category_my', weight: 0.6 },
        { name: 'full_address', weight: 0.4 },
        { name: 'full_address_my', weight: 0.4 }
      ],
      threshold: 0.35, 
      ignoreLocation: true, 
      useExtendedSearch: true 
    });
  } else {
    bm25Index.value = null;
    didYouMeanDictionary.value = {
      wordsSet: new Set(),
      wordsList: [],
      byLength: {}
    };
    fuseInstance.value = null;
  }
}, { immediate: true });

// Vector Search API integrations
const vectorSearchResults = ref<{ place_id: string; score: number; is_vector?: boolean }[]>([]);
const searchRelevanceScores = ref<Map<string, number>>(new Map());
const isVectorSearching = ref<boolean>(false);
const vectorApiAvailable = ref<boolean | null>(null);

// Migrate or fetch the correct vector API URL (default to user's active localtunnel URL)
const getInitialVectorUrl = (): string => {
  const storedUrl = localStorage.getItem('custom_vector_api_url');

  // Default to the official vector search host.
  if (!storedUrl || storedUrl.includes('icy-baths-pay.loca.lt') || storedUrl.includes('bumpy-clocks-fold.loca.lt')) {
    return 'https://api.dpsmap.com';
  }
  return storedUrl;
};

const customVectorApiUrl = ref<string>(getInitialVectorUrl());

let healthCheckTimeout: any = null;

watch(customVectorApiUrl, () => {
  localStorage.setItem('custom_vector_api_url', customVectorApiUrl.value);
  
  // Set to "CHECKING..." state immediately
  vectorApiAvailable.value = null;
  
  if (healthCheckTimeout) {
    clearTimeout(healthCheckTimeout);
  }
  
  // Debounce the health check by 600ms while typing
  healthCheckTimeout = setTimeout(() => {
    checkVectorApiHealth();
  }, 600);
});

async function checkVectorApiHealth() {
  const url = customVectorApiUrl.value.trim();
  
  // Quick validation: must be a well-formed URL starting with http:// or https://
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    console.log('[Vector API] Skipping health check, URL is empty or invalid:', url);
    vectorApiAvailable.value = false;
    return;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    // Route health check server-side using our Express server to bypass CORS and LocalTunnel warning pages
    const res = await fetch(`/api/health`, { 
      signal: controller.signal,
      headers: {
        'x-vector-api-url': url
      }
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      vectorApiAvailable.value = data.vector_api_connected === true || data.vector_connected === true;
      console.log('[Vector API] Health check status:', vectorApiAvailable.value ? 'ONLINE' : 'OFFLINE', data);
    } else {
      vectorApiAvailable.value = false;
    }
  } catch (e) {
    console.warn('[Vector API] Health check failed:', e);
    vectorApiAvailable.value = false;
  }
}

let activeVectorSearchAbort: AbortController | null = null;

async function fetchVectorSearchResults(query: string) {
  if (!smartSearchEnabled.value) {
    vectorSearchResults.value = [];
    return;
  }
  
  if (activeVectorSearchAbort) {
    activeVectorSearchAbort.abort();
  }
  
  const q = query.trim();
  if (!q) {
    vectorSearchResults.value = [];
    return;
  }
  
  const url = customVectorApiUrl.value.trim();
  
  activeVectorSearchAbort = new AbortController();
  isVectorSearching.value = true;
  
  try {
    // Route search queries server-side through our Express server to bypass CORS completely
    const res = await fetch(`/api/search`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-vector-api-url': url
      },
      body: JSON.stringify({ query: q, top_k: 300 }),
      signal: activeVectorSearchAbort.signal
    });
    
    if (res.ok) {
      const data = await res.json();
      // Normalize results and try to resolve external IDs to our canonical `place_id`
      const rawResults = Array.isArray(data.results) ? data.results : [];
      const normalized = rawResults.map((r: any) => ({
        place_id: String(r.place_id ?? r.poi_id ?? r.id ?? '').trim(),
        score: Number(r.score) || 0.0,
        is_vector: true,
        name: r.name ?? r.title ?? '',
        latitude: (typeof r.latitude === 'number') ? r.latitude : (typeof r.lat === 'number' ? r.lat : (r.latitude ? Number(r.latitude) : undefined)),
        longitude: (typeof r.longitude === 'number') ? r.longitude : (typeof r.lon === 'number' ? r.lon : (r.longitude ? Number(r.longitude) : undefined))
      }));

      // Attempt to map each vector result to the frontend's loaded `places` by id, coords, or name
      const resolved = normalized.map((r) => {
        if (placesMap.value.has(r.place_id)) return { ...r };

        // 1) Try numeric id that may correspond to a POI numeric primary key -> match by numeric string against poi_id
        if (r.place_id) {
          const alt = r.place_id.replace(/^0+/, '');
          if (placesMap.value.has(alt)) return { ...r, place_id: alt };
        }

        // 2) Try proximity match using lat/lon when available
        if (typeof r.latitude === 'number' && typeof r.longitude === 'number') {
          let best: any = null;
          let bestDist = Infinity;
          for (const p of places.value) {
            if (typeof p.lat !== 'number' || typeof p.lon !== 'number') continue;
            const dx = p.lat - r.latitude;
            const dy = p.lon - r.longitude;
            const d = dx * dx + dy * dy;
            if (d < bestDist) { bestDist = d; best = p; }
          }
          // threshold ~0.0005 degrees (~50m) squared
          if (best && bestDist < 0.0005 * 0.0005) {
            return { ...r, place_id: best.place_id };
          }
        }

        // 3) Try simple name substring match
        const nameNorm = (r.name || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        if (nameNorm) {
          for (const p of places.value) {
            const pn = (p.name || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
            const pmy = (p.name_my || '').toLowerCase().replace(/[^a-z0-9\s]/g, '');
            if (pn.includes(nameNorm) || pmy.includes(nameNorm)) {
              return { ...r, place_id: p.place_id };
            }
          }
        }

        return r; // unresolved, keep original id
      });

      vectorSearchResults.value = resolved;
      if (data.engine === 'vector-api-proxy') {
        vectorApiAvailable.value = true;
      }
    } else {
      vectorSearchResults.value = [];
    }
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.warn('[Vector Search] API failed or unreachable:', err);
      vectorSearchResults.value = [];
      vectorApiAvailable.value = false;
    }
  } finally {
    isVectorSearching.value = false;
    activeVectorSearchAbort = null;
  }
}

// Interactive directory filters
const searchQuery = ref<string>('');
const localSearchQuery = ref<string>('');

// Keep localSearchQuery synchronized immediately when searchQuery is modified from code
watch(searchQuery, (newVal) => {
  if (localSearchQuery.value !== newVal) {
    localSearchQuery.value = newVal;
  }
}, { immediate: true });

// Ultra-fast search suggestions limited to 6 results
const suggestions = ref<Place[]>([]);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(localSearchQuery, (newVal) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const query = newVal.trim().toLowerCase();
  if (query === '') {
    suggestions.value = [];
    searchQuery.value = '';
    return;
  }

  // Use a 150ms debounce so that typing is perfectly smooth and lightweight
  debounceTimer = setTimeout(() => {
    // 1. Calculate autocomplete suggestions list
    const matches: Place[] = [];
    const list = places.value;
    const len = list.length;
    for (let i = 0; i < len; i++) {
      const p = list[i];
      const nameEn = p.name ? p.name.toLowerCase() : '';
      const nameMy = p.name_my ? p.name_my.toLowerCase() : '';
      const catEn = p.category ? p.category.toLowerCase() : '';
      const tags = p.tags ? p.tags.toLowerCase() : '';

      if (
        nameEn.includes(query) ||
        nameMy.includes(query) ||
        catEn.includes(query) ||
        tags.includes(query)
      ) {
        matches.push(p);
        if (matches.length >= 6) {
          break;
        }
      }
    }
    suggestions.value = matches;
  }, 150);
});

function executeSearch() {
  searchQuery.value = localSearchQuery.value;
  isSearchFocused.value = false;
  const inputEl = document.getElementById('search-input');
  if (inputEl) {
    inputEl.blur();
  }
}

function clearSearch() {
  localSearchQuery.value = '';
  searchQuery.value = '';
  isSearchFocused.value = false;
}

const selectedCity = ref<'all' | 'Yangon'>('all');
const selectedCategory = ref<string>('all');
const selectedTownship = ref<string>('all');

// Custom Category Search & Autocomplete
const categorySearchInputText = ref<string>('');
const showCategoryDropdown = ref<boolean>(false);

watch(selectedCategory, (newCat) => {
  if (newCat === 'all') {
    categorySearchInputText.value = '';
  } else {
    categorySearchInputText.value = getCatLabelText(newCat);
  }
}, { immediate: true });

const filteredSearchCategories = computed(() => {
  const query = categorySearchInputText.value.trim().toLowerCase();
  if (!query) {
    return availableCategories.value;
  }
  return availableCategories.value.filter(cat => {
    const labelEn = cat.toLowerCase();
    const labelMy = (categoryDetails.value.get(cat)?.nameMy || '').toLowerCase();
    return labelEn.includes(query) || labelMy.includes(query);
  });
});

function selectCategoryOption(cat: string) {
  selectedCategory.value = cat;
  showCategoryDropdown.value = false;
}

function handleCategoryInputFocus() {
  showCategoryDropdown.value = true;
}

function handleCategoryInputBlur() {
  setTimeout(() => {
    showCategoryDropdown.value = false;
    if (selectedCategory.value === 'all') {
      categorySearchInputText.value = '';
    } else {
      categorySearchInputText.value = getCatLabelText(selectedCategory.value);
    }
  }, 200);
}

const userCoords = ref<[number, number] | null>(null);

function detectNearbyIntent(query: string): boolean {
  const q = query.toLowerCase().trim();
  return q.includes('near me') || 
         q.includes('nearby') || 
         q.includes('near') || 
         q.includes('အနီးအနား') || 
         q.includes('အနီးနား');
}

function getReferenceCoords(queryText: string): [number, number] | null {
  if (userCoords.value) {
    return userCoords.value;
  }
  return detectNearbyIntent(queryText) ? YANGON_CENTER_FALLBACK : null;
}

const isAcquiringGps = ref<boolean>(false);
const gpsStatusMessage = ref<string | null>(null);

function getAccurateLocation(
  onSuccess: (pos: GeolocationPosition) => void,
  onError: (err: GeolocationPositionError) => void
) {
  if (!navigator.geolocation) {
    const errorObj = {
      code: 0,
      message: 'Geolocation not supported',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    } as GeolocationPositionError;
    onError(errorObj);
    return;
  }

  // Try high accuracy first with a cached maximumAge
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log('[GPS] Successfully acquired coordinates with high accuracy:', pos.coords.latitude, pos.coords.longitude);
      onSuccess(pos);
    },
    (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        console.warn('[GPS] Permission denied.');
        onError(err);
        return;
      }
      console.warn('[GPS] High accuracy attempt failed or timed out. Falling back to lower-accuracy network location...', err.message);
      // Fallback: try standard/low accuracy with longer timeout and older cache
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('[GPS] Successfully acquired coordinates with low accuracy fallback:', pos.coords.latitude, pos.coords.longitude);
          onSuccess(pos);
        },
        (errFallback) => {
          console.error('[GPS] Fallback low accuracy attempt also failed:', errFallback.message);
          onError(errFallback);
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
      );
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
  );
}

function triggerGpsLocate() {
  if (!navigator.geolocation) {
    gpsStatusMessage.value = lang.value === 'en'
      ? 'Geolocation is not supported by your browser.'
      : 'သင့်ဘရောက်ဆာတွင် GPS စနစ်မထောက်ပံ့ပါ။';
    return;
  }
  isAcquiringGps.value = true;
  gpsStatusMessage.value = lang.value === 'en' ? 'Acquiring GPS...' : 'GPS တည်နေရာ ရှာဖွေနေဆဲ...';
  
  getAccurateLocation(
    (pos) => {
      userCoords.value = [pos.coords.latitude, pos.coords.longitude];
      isAcquiringGps.value = false;
      gpsStatusMessage.value = lang.value === 'en' ? 'GPS Location active' : 'GPS တည်နေရာ ရရှိပါပြီ';
      localSearchQuery.value = 'near me';
      searchQuery.value = 'near me';
      selectedPlace.value = null;
      activeTab.value = 'explorer';
    },
    (err) => {
      console.warn('Could not fetch GPS coordinate:', err);
      isAcquiringGps.value = false;
      if (err.code === err.PERMISSION_DENIED) {
        gpsStatusMessage.value = lang.value === 'en'
          ? 'GPS permission denied. Please allow location access in your browser settings.'
          : 'GPS အသုံးပြုခွင့် ငြင်းပယ်ထားပါသည်။ ဘရောက်ဆာ ဆက်တင်တွင် ခွင့်ပြုပေးပါ။';
      } else {
        gpsStatusMessage.value = lang.value === 'en'
          ? 'GPS timed out or unavailable. Defaulting to Central Terminal Hub.'
          : 'GPS အချိန်ကျော်လွန်သွားပါသည် (သို့) မရရှိနိုင်ပါ။ ဗဟိုဘူတာကြီးမှသာ လမ်းကြောင်းပြပါမည်။';
      }
      userCoords.value = YANGON_CENTER_FALLBACK;
      localSearchQuery.value = 'near me';
      searchQuery.value = 'near me';
      selectedPlace.value = null;
      activeTab.value = 'explorer';
    }
  );
}

// Watch searchQuery to automatically fetch GPS coordinates when "near me" or "nearby" is searched
watch(searchQuery, (newQuery) => {
  const hasNearbyIntent = detectNearbyIntent(newQuery);
  if (hasNearbyIntent && !userCoords.value && navigator.geolocation) {
    isAcquiringGps.value = true;
    gpsStatusMessage.value = lang.value === 'en' ? 'Acquiring GPS...' : 'GPS တည်နေရာ ရှာဖွေနေဆဲ...';
    getAccurateLocation(
      (pos) => {
        userCoords.value = [pos.coords.latitude, pos.coords.longitude];
        isAcquiringGps.value = false;
        gpsStatusMessage.value = lang.value === 'en' ? 'GPS Location active' : 'GPS တည်နေရာ ရရှိပါပြီ';
      },
      (err) => {
        console.warn('Could not fetch GPS coordinate for nearby query:', err);
        isAcquiringGps.value = false;
        if (err.code === err.PERMISSION_DENIED) {
          gpsStatusMessage.value = lang.value === 'en'
            ? 'GPS permission denied. Using Yangon center fallback.'
            : 'GPS အသုံးပြုခွင့် ငြင်းပယ်ထားပါသည်။ ဗဟိုဘူတာကြီးမှသာ လမ်းကြောင်းပြပါမည်။';
        } else {
          gpsStatusMessage.value = lang.value === 'en'
            ? 'GPS timed out or unavailable. Using Yangon center fallback.'
            : 'GPS အချိန်ကျော်လွန်သွားပါသည် (သို့) မရရှိနိုင်ပါ။ ဗဟိုဘူတာကြီးမှသာ လမ်းကြောင်းပြပါမည်။';
        }
        userCoords.value = YANGON_CENTER_FALLBACK;
      }
    );
  }
});

const smartSearchEnabled = ref<boolean>(true);
const detectedTownship = ref<string | null>(null);
const detectedCategory = ref<string | null>(null);
const detectedMinRating = ref<number | null>(null);
const detectedSortBy = ref<'rating' | 'reviews' | 'relevance' | null>(null);

// Watch searchQuery and smartSearchEnabled to extract filters from terms semantically
watch([searchQuery, smartSearchEnabled], () => {
  if (!smartSearchEnabled.value || searchQuery.value.trim() === '') {
    detectedTownship.value = null;
    detectedCategory.value = null;
    detectedMinRating.value = null;
    detectedSortBy.value = null;
    return;
  }

  const queryLower = searchQuery.value.toLowerCase().trim();

  // 1. Detect Townships
  let foundTownship: string | null = null;
  for (const ts of TOWNSHIPS_MAP) {
    const tsEnLower = ts.en.toLowerCase();
    const tsMy = ts.my;
    const regexEn = new RegExp(`\\b${tsEnLower}\\b`, 'i');
    if (regexEn.test(queryLower) || queryLower.includes(tsMy)) {
      foundTownship = ts.en;
      break;
    }
  }
  detectedTownship.value = foundTownship;

  // 2. Detect Categories
  let foundCategory: string | null = null;
  const categoriesList = availableCategories.value || [];
  for (const cat of categoriesList) {
    const catLower = cat.toLowerCase();
    const catDetailsObj = categoryDetails.value.get(cat);
    const catMy = catDetailsObj?.nameMy || '';
    const regexCat = new RegExp(`\\b${catLower}\\b`, 'i');
    if (regexCat.test(queryLower) || (catMy && queryLower.includes(catMy))) {
      foundCategory = cat;
      break;
    }
  }

  // Fallbacks mapping
  if (!foundCategory) {
    if (queryLower.includes('food') || queryLower.includes('restaurant') || queryLower.includes('dining') || queryLower.includes('စားသောက်ဆိုင်')) {
      foundCategory = 'Restaurant';
    } else if (queryLower.includes('coffee') || queryLower.includes('cafe') || queryLower.includes('ကော်ဖီ')) {
      foundCategory = 'Cafe';
    } else if (queryLower.includes('pagoda') || queryLower.includes('temple') || queryLower.includes('stupa') || queryLower.includes('ဘုရား')) {
      foundCategory = 'Pagoda';
    } else if (queryLower.includes('hotel') || queryLower.includes('hostel') || queryLower.includes('inn') || queryLower.includes('ဟိုတယ်')) {
      foundCategory = 'Hotel';
    } else if (queryLower.includes('park') || queryLower.includes('garden') || queryLower.includes('ပန်းခြံ')) {
      foundCategory = 'Park';
    } else if (queryLower.includes('museum') || queryLower.includes('art') || queryLower.includes('ပြတိုက်')) {
      foundCategory = 'Museum';
    } else if (queryLower.includes('market') || queryLower.includes('bazaar')) {
      foundCategory = 'Market';
    } else if (queryLower.includes('mall') || queryLower.includes('shopping') || queryLower.includes('plaza')) {
      foundCategory = 'Shopping Mall';
    }
  }
  detectedCategory.value = foundCategory;

  // 3. Detect Ratings
  const ratingRegex = /(?:rating|stars|star)?\s*(?:above|over|>|>=)?\s*([3-5](?:\.[0-9]+)?)\s*(?:stars|star|rating)?/i;
  const ratingMatch = queryLower.match(ratingRegex);
  if (ratingMatch) {
    const parsedRating = parseFloat(ratingMatch[1]);
    if (parsedRating >= 3 && parsedRating <= 5) {
      detectedMinRating.value = parsedRating;
    } else {
      detectedMinRating.value = null;
    }
  } else if (queryLower.includes('best') || queryLower.includes('top') || queryLower.includes('highly rated') || queryLower.includes('အကောင်းဆုံး')) {
    detectedMinRating.value = 4.5;
    detectedSortBy.value = 'rating';
  } else {
    detectedMinRating.value = null;
    detectedSortBy.value = null;
  }
});

// Compute available townships dynamically based on loaded and enriched places dataset
const availableTownships = computed(() => {
  const townshipsMap = new Map<string, string>(); 
  places.value.forEach((p) => {
    if (p.township) {
      townshipsMap.set(p.township, p.township_my || p.township);
    }
  });
  return Array.from(townshipsMap.entries())
    .map(([en, my]) => ({ en, my }))
    .sort((a, b) => {
      if (a.en === 'Other') return 1;
      if (b.en === 'Other') return -1;
      return a.en.localeCompare(b.en);
    });
});

// Pagination for Matched Landmarks Directory List
const currentPage = ref<number>(1);
// Increase default page size so BM25/local search returns many results immediately
const itemsPerPage = ref<number>(50);
// UI toggle state to let user show more results immediately
const showMoreResults = ref<boolean>(false);

// Toggle itemsPerPage when the user switches the control
watch(showMoreResults, (val) => {
  itemsPerPage.value = val ? 150 : 50;
});
const pageInputVal = ref<string>('1');

watch(currentPage, (newVal) => {
  pageInputVal.value = String(newVal);
});

function handlePageInputSubmit() {
  let pageNum = parseInt(pageInputVal.value, 10);
  if (isNaN(pageNum)) {
    pageInputVal.value = String(currentPage.value);
    return;
  }
  if (pageNum < 1) pageNum = 1;
  if (pageNum > totalPages.value) pageNum = totalPages.value;
  currentPage.value = pageNum;
  pageInputVal.value = String(pageNum);
}

const minRating = ref<number>(0);
const sortBy = ref<'relevance' | 'rating' | 'reviews' | 'name'>('rating');
const showAdvancedFilters = ref<boolean>(false);
const isSearchFocused = ref<boolean>(false);

function handleSearchBlur() {
  setTimeout(() => {
    isSearchFocused.value = false;
  }, 200);
}

function selectSuggestion(place: Place) {
  const name = lang.value === 'en' ? place.name : (place.name_my || place.name);
  localSearchQuery.value = name;
  searchQuery.value = name;
  triggerSelectPlace(place);
  isSearchFocused.value = false;
}

watch(searchQuery, async (newQuery) => {
  currentPage.value = 1;
  if (newQuery && newQuery.trim() !== '') {
    selectedPlace.value = null; 
    sortBy.value = 'relevance';
    // Start vector search asynchronously so local BM25/Fuse results show immediately
    // Vector results will merge in when ready.
    fetchVectorSearchResults(newQuery);
  } else {
    vectorSearchResults.value = [];
    if (sortBy.value === 'relevance') {
      sortBy.value = 'rating';
    }
  }
});

// Active navigation selection states
const selectedPlace = ref<Place | null>(null);
const hoveredPlace = ref<Place | null>(null);

// Computes selected place along with at least 20 closest nearby places for the map view
const mapPlaces = computed(() => {
  if (!selectedPlace.value) {
    return filteredPlaces.value.slice(0, 150);
  }
  
  const current = selectedPlace.value;
  const sortedOthers = [...places.value]
    .filter(p => p.place_id !== current.place_id)
    .map(p => {
      const dist = calculateHaversineDistance(current.lat, current.lon, p.lat, p.lon);
      return { place: p, dist };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 20)
    .map(item => item.place);

  return [current, ...sortedOthers];
});

// Routing calculation states
const route = ref<RouteInfo | null>(null);
const routeStartKey = ref<string>('hub-station');
const isCalculatingRoute = ref<boolean>(false);
const routeInstructions = ref<DirectionStep[]>([]);
const gpsError = ref<string | null>(null);

// UI structure tabs
const activeTab = ref<'home' | 'explorer' | 'about'>('home');
const isMobileMenuOpen = ref<boolean>(false);

// Initialize data from the API backend / fallback
onMounted(async () => {
  try {
    // Start health check immediately
    checkVectorApiHealth();

    // 1) Fast preview load (small limit) so the UI becomes interactive quickly
    isPreviewLoading.value = true;
    const preview = await fetchPlacesPreview(100);
    if (preview.places && preview.places.length > 0) {
      places.value = enrichPlacesWithTownship(preview.places);
    }
    // Hide the preview loader once preview is ready and close full-screen loader
    isPreviewLoading.value = false;
    isLoading.value = false;

    // 2) In background, load the full dataset and rebuild indexes when ready
    (async () => {
      try {
        loadedCount.value = 0;
        totalCount.value = 0;
        const res = await fetchPlacesFromSource((loaded, total) => {
          loadedCount.value = loaded;
          totalCount.value = total;
        });
        if (res.places && res.places.length > 0) {
          places.value = enrichPlacesWithTownship(res.places);
        }
      } catch (err) {
        console.error('Background full fetch failed:', err);
      }
    })();
  } catch (err: any) {
    console.error('Preview fetch lifecycle failure:', err);
    isLoading.value = false;
  }
});

// Watch selected place transitions to reset routing info
watch(selectedPlace, () => {
  route.value = null;
  routeInstructions.value = [];
  routeStartKey.value = 'hub-station';
  gpsError.value = null;
});

function setActiveTab(tab: 'home' | 'explorer' | 'about') {
  activeTab.value = tab;
  if (tab !== 'explorer') {
    selectedPlace.value = null;
  }
}

// Compute high-performance categories details map
const categoryDetails = computed(() => {
  const map = new Map<string, { count: number; nameMy: string }>();
  places.value.forEach((p) => {
    if (!p.category) return;
    const existing = map.get(p.category);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(p.category, { count: 1, nameMy: p.category_my || p.category });
    }
  });
  return map;
});

const availableCategories = computed(() => {
  return Array.from(categoryDetails.value.keys()).sort((a, b) => a.localeCompare(b));
});

// Category Burmese and English naming mapper
function getCatLabelText(cat: string) {
  return lang.value === 'en' ? cat : (categoryDetails.value.get(cat)?.nameMy || cat);
}

// Helper to perform smart semantic search queries and rank them
function getSearchCandidates(queryText: string): Place[] {
  const activeFuzzyQuery = queryText;
  if (activeFuzzyQuery === '') {
    return [...places.value];
  }

  const enrichedQuery = enrichQueryWithTransliteration(activeFuzzyQuery);
  
  let fuseMatchedPlaces: { item: Place; score?: number }[] = [];
  if (fuseInstance.value && activeFuzzyQuery.length > 3) {
    fuseMatchedPlaces = fuseInstance.value.search(enrichedQuery);
  }

  let bm25Matches: { place: Place; score: number }[] = [];
  if (bm25Index.value) {
    bm25Matches = bm25Index.value.search(activeFuzzyQuery, placesMap.value);
  }

  const customMatches: { item: Place; score: number }[] = [];
  const pq = precomputeQuery(activeFuzzyQuery);

  // Scan candidates (always scan all places for substring/custom match to support prefix and short query variants)
  places.value.forEach((p) => {
    const score = calculateMatchScoreFast(p, pq);
    if (score > 0) {
      customMatches.push({ item: p, score });
    }
  });

  const combinedMap = new Map<string, { item: Place; relevanceScore: number }>();

  // Incorporate BM25 scoring with a tuned weight multiplier
  bm25Matches.forEach(({ place, score }) => {
    combinedMap.set(place.place_id, { item: place, relevanceScore: score * 15 });
  });

  // Incorporate local or remote vector search scores if available
  if (vectorSearchResults.value.length > 0) {
    vectorSearchResults.value.forEach((res) => {
      const item = placesMap.value.get(res.place_id);
      if (item) {
        // Boost similarity relevance (e.g. up to 1200 points) based on vector score or database fuzzy match
        let boost = 0;
        if (res.is_vector !== false) {
          boost = (res.score > 0) ? (res.score * 800) : 400;
        } else {
          // Pure database fuzzy matches from Express backend
          boost = 300;
        }
        const existing = combinedMap.get(res.place_id);
        if (existing) {
          existing.relevanceScore += boost;
        } else {
          combinedMap.set(res.place_id, { item, relevanceScore: boost });
        }
      }
    });
  }

  // Add custom substring/prefix heuristic scores
  customMatches.forEach(({ item, score }) => {
    const existing = combinedMap.get(item.place_id);
    if (existing) {
      existing.relevanceScore += score;
    } else {
      combinedMap.set(item.place_id, { item, relevanceScore: score });
    }
  });

  // Add Fuse fuzzy match scores
  fuseMatchedPlaces.forEach((r) => {
    const fuseScoreBonus = (1 - (r.score || 0)) * 50; 
    const existing = combinedMap.get(r.item.place_id);
    if (existing) {
      existing.relevanceScore += fuseScoreBonus;
    } else {
      combinedMap.set(r.item.place_id, { item: r.item, relevanceScore: fuseScoreBonus });
    }
  });

  // Apply field-aware boosting and exact-match prioritization
  const qLower = activeFuzzyQuery.toLowerCase().trim();
  combinedMap.forEach((entry) => {
    const item = entry.item;
    const nameEn = (item.name || '').toLowerCase().trim();
    const nameMy = (item.name_my || '').toLowerCase().trim();
    const addrEn = (item.full_address || '').toLowerCase().trim();
    const addrMy = (item.full_address_my || '').toLowerCase().trim();

    // 1. Exact name match boost (guarantees exact name match is at the absolute top)
    if (nameEn === qLower || nameMy === qLower) {
      entry.relevanceScore += 50000;
    }
    // 2. Starts-with name match boost
    else if (nameEn.startsWith(qLower) || nameMy.startsWith(qLower)) {
      entry.relevanceScore += 25000;
    }
    // 3. Substring name match boost
    else if (nameEn.includes(qLower) || nameMy.includes(qLower)) {
      entry.relevanceScore += 12000;
    }

    // 4. Exact address/road match boost
    if (addrEn === qLower || addrMy === qLower) {
      entry.relevanceScore += 30000;
    }
    // 5. Contained address/road match boost
    else if (addrEn.includes(qLower) || addrMy.includes(qLower)) {
      entry.relevanceScore += 15000;
    }

    // 6. Name + Address/Road combination boost
    const queryWords = qLower.split(/\s+/).filter(w => w.length >= 2);
    if (queryWords.length > 1) {
      let nameWordMatched = false;
      let addressWordMatched = false;
      queryWords.forEach(word => {
        if (nameEn.includes(word) || nameMy.includes(word)) nameWordMatched = true;
        if (addrEn.includes(word) || addrMy.includes(word)) addressWordMatched = true;
      });
      if (nameWordMatched && addressWordMatched) {
        entry.relevanceScore += 40000; // Boost combined name + road query matches
      }
    }

    // Field-aware boosts based on smart search features
    if (smartSearchEnabled.value) {
      // Boost location match significantly if township is detected in query
      if (detectedTownship.value) {
        const isTownshipMatch = item.township?.toLowerCase() === detectedTownship.value.toLowerCase() ||
                                item.township_my === detectedTownship.value;
        if (isTownshipMatch) {
          entry.relevanceScore += 5000;
        }
      }

      // Boost category match if category is detected in query
      if (detectedCategory.value) {
        const isCategoryMatch = item.category?.toLowerCase() === detectedCategory.value.toLowerCase();
        if (isCategoryMatch) {
          entry.relevanceScore += 2500;
        }
      }
    }
  });

  // Save computed relevance scores globally for applySorting
  const newScores = new Map<string, number>();
  combinedMap.forEach((entry) => {
    newScores.set(entry.item.place_id, entry.relevanceScore);
  });
  searchRelevanceScores.value = newScores;

  let candidates = Array.from(combinedMap.values())
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map((x) => x.item);

  // Ensure strict multi-word matching for multi-word queries
  const STOP_WORDS = new Set(['in', 'at', 'the', 'a', 'of', 'and', 'near', 'with', 'for', 'above', 'below', 'stars', 'star']);
  const significantWords = pq.originalQueryWords.filter(w => !STOP_WORDS.has(w) && w.length >= 2);
  const finalWords = significantWords.length > 0 ? significantWords : pq.originalQueryWords;

  if (finalWords.length > 1) {
    const queryVariants = getAllQueryVariants(activeFuzzyQuery);
    // Precompute variant word groups to avoid redundant parsing or transliteration inside the loop
    const variantWordGroups = queryVariants.map(v => v.split(/\s+/).filter(Boolean)).filter(g => g.length > 0);

    // Create a Set of vector result IDs for O(1) lookups
    const vectorResultIds = new Set(vectorSearchResults.value.map(r => r.place_id));

    candidates = candidates.filter(p => {
      // ALWAYS keep if it is a top vector/semantic search match!
      if (vectorResultIds.has(p.place_id)) {
        return true;
      }

      const matchesAllOriginal = finalWords.every(word => placeMatchesKeywordSimple(p, word));
      if (matchesAllOriginal) return true;

      return variantWordGroups.some(group => {
        return group.every(vw => placeMatchesKeywordSimple(p, vw));
      });
    });
  }

  return candidates;
}

// Helper to filter candidates based on selected filters or detected metadata
function applyFilters(candidates: Place[], queryText: string): Place[] {
  let filtered = [...candidates];

  // Map vector results to a set of place_id for O(1) checks
  const vectorResultIds = new Set(vectorSearchResults.value.map(r => r.place_id));
  const hasVectorResults = vectorResultIds.size > 0;

  if (selectedCity.value !== 'all') {
    filtered = filtered.filter((p) => p.city === selectedCity.value);
  }

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  } else if (smartSearchEnabled.value && detectedCategory.value && hasVectorResults) {
    const queryLower = queryText.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
    
    filtered = filtered.filter((p) => {
      // Keep any top vector search match regardless of smart category extraction
      if (vectorResultIds.has(p.place_id)) return true;

      if (isNameMatch(p, queryText)) return true;
      if (p.category === detectedCategory.value) return true;
      
      const nameEn = (p.name || '').toLowerCase();
      const nameMy = (p.name_my || '').toLowerCase();
      const tags = (p.tags || '').toLowerCase();
      
      if (queryWords.length > 0) {
        return queryWords.some(word => 
          nameEn.includes(word) || 
          nameMy.includes(word) || 
          tags.includes(word)
        );
      } else if (queryLower.length > 0) {
        return nameEn.includes(queryLower) || nameMy.includes(queryLower) || tags.includes(queryLower);
      }
      return false;
    });
  }

  const activeTownship = (smartSearchEnabled.value && detectedTownship.value) 
    ? detectedTownship.value 
    : selectedTownship.value;

  if (activeTownship !== 'all' && hasVectorResults) {
    filtered = filtered.filter((p) => {
      // Keep any top vector search match regardless of smart township extraction, as long as user hasn't explicitly set a township in the UI
      if (vectorResultIds.has(p.place_id) && selectedTownship.value === 'all') {
        return true;
      }

      if (smartSearchEnabled.value && detectedTownship.value && isNameMatch(p, queryText)) {
        return true;
      }
      return p.township === activeTownship;
    });
  }

  const activeMinRating = (smartSearchEnabled.value && detectedMinRating.value !== null)
    ? Math.max(minRating.value, detectedMinRating.value)
    : minRating.value;

  if (activeMinRating > 0 && hasVectorResults) {
    filtered = filtered.filter((p) => {
      // Keep any top vector search match regardless of smart rating extraction, as long as user hasn't explicitly set a rating in the UI
      if (vectorResultIds.has(p.place_id) && minRating.value === 0) {
        return true;
      }

      if (smartSearchEnabled.value && detectedMinRating.value !== null && isNameMatch(p, queryText)) {
        return true;
      }
      return p.rating >= activeMinRating;
    });
  }

  return filtered;
}

// Helper to append distance metadata from geolocated reference coordinates
function enrichWithDistance(items: Place[], queryText: string): Place[] {
  const refCoords = getReferenceCoords(queryText);

  if (refCoords) {
    return items.map(p => {
      const dist = calculateHaversineDistance(refCoords[0], refCoords[1], p.lat, p.lon);
      let distanceText = '';
      if (dist < 1) {
        distanceText = `${Math.round(dist * 1000)}m`;
      } else {
        distanceText = `${dist.toFixed(1)}km`;
      }
      return {
        ...p,
        distanceText,
        distanceFromUser: dist
      };
    });
  } else {
    return items.map(p => {
      const pCopy = { ...p };
      delete pCopy.distanceText;
      return pCopy;
    });
  }
}

// Helper to sort the final results based on proximity, custom ratings or index scores
function applySorting(items: Place[], queryText: string): Place[] {
  const nearbyIntent = detectNearbyIntent(queryText);

  const activeSortBy = (smartSearchEnabled.value && detectedSortBy.value && sortBy.value === 'relevance')
    ? detectedSortBy.value
    : sortBy.value;

  const refCoords = getReferenceCoords(queryText);

  // Precompute vector score/index map for O(1) lookups during sorting
  const vectorIndexMap = new Map<string, number>();
  vectorSearchResults.value.forEach((res, idx) => {
    vectorIndexMap.set(res.place_id, idx);
  });

  // Build union of provided items and any vector-only matches so we can
  // order results by the requested preference: (both) > (vector-only) > (normal-only).
  const originalIds = new Set(items.map(i => i.place_id));

  // Add vector-only places that pass current filters
  const vectorPlacesToConsider: Place[] = [];
  vectorSearchResults.value.forEach((res) => {
    const pid = res.place_id;
    if (!pid) return;
    if (originalIds.has(pid)) return; // already included
    const p = placesMap.value.get(pid);
    if (!p) return;
    // Re-run filters for this single place to ensure it's allowed in current view
    const filtered = applyFilters([p], queryText);
    if (filtered.length > 0) {
      vectorPlacesToConsider.push(p);
    }
  });

  const combined = [...items, ...vectorPlacesToConsider];

  // Tier assignment: 2 = in both, 1 = vector-only, 0 = normal-only
  const vectorResultIds = new Set(vectorSearchResults.value.map(r => r.place_id));

  function tierFor(p: Place) {
    const inNormal = originalIds.has(p.place_id);
    const inVector = vectorResultIds.has(p.place_id);
    if (inNormal && inVector) return 2;
    if (inVector) return 1;
    return 0;
  }

  // Comparator that preserves previous activeSortBy logic within each tier
  function compareWithinTier(a: Place, b: Place) {
    if (nearbyIntent && refCoords) {
      return (a.distanceFromUser ?? Infinity) - (b.distanceFromUser ?? Infinity);
    }
    if (activeSortBy === 'rating') {
      return b.rating - a.rating || b.review_count - a.review_count;
    }
    if (activeSortBy === 'reviews') {
      return b.review_count - a.review_count;
    }
    if (activeSortBy === 'name') {
      const nameA = lang.value === 'en' ? a.name : a.name_my;
      const nameB = lang.value === 'en' ? b.name : b.name_my;
      return (nameA || '').localeCompare(nameB || '', lang.value === 'en' ? 'en' : 'my');
    }
    if (activeSortBy === 'relevance') {
      if (queryText !== '') {
        const scoreA = searchRelevanceScores.value.get(a.place_id) || 0;
        const scoreB = searchRelevanceScores.value.get(b.place_id) || 0;
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }
        const hasA = vectorIndexMap.has(a.place_id);
        const hasB = vectorIndexMap.has(b.place_id);
        if (hasA && hasB) {
          return vectorIndexMap.get(a.place_id)! - vectorIndexMap.get(b.place_id)!;
        }
        if (hasA) return -1;
        if (hasB) return 1;
      }
      return b.rating - a.rating || b.review_count - a.review_count;
    }
    return 0;
  }

  combined.sort((a, b) => {
    const ta = tierFor(a);
    const tb = tierFor(b);
    if (ta !== tb) return tb - ta; // higher tier first
    return compareWithinTier(a, b);
  });

  return combined;
}

// Advanced reactive filter logic computation list
const filteredPlaces = computed(() => {
  const queryText = searchQuery.value.trim();
  const candidates = getSearchCandidates(queryText);
  const filtered = applyFilters(candidates, queryText);
  const enriched = enrichWithDistance(filtered, queryText);
  return applySorting(enriched, queryText);
});

const didYouMeanSuggestion = computed(() => {
  const query = searchQuery.value.trim();
  if (!query) return null;
  // If we have search results, do not perform expensive spelling correction
  if (filteredPlaces.value.length > 0) return null;
  return getDidYouMeanSuggestion(query, didYouMeanDictionary.value);
});

const searchOptionsSuggest = computed(() => {
  const query = searchQuery.value.trim();
  if (query === '' || filteredPlaces.value.length <= 8) return null;
  
  const catsInResults = new Set<string>();
  const tsInResults = new Set<string>();
  filteredPlaces.value.forEach(p => {
    if (p.category) catsInResults.add(p.category);
    if (p.township) tsInResults.add(p.township);
  });

  interface NarrowDownSuggestion {
    type: 'category' | 'township';
    value: string;
    label: string;
  }
  const suggestionsList: NarrowDownSuggestion[] = [];
  
  if (selectedCategory.value === 'all' && catsInResults.size > 1) {
    const catCounts = new Map<string, number>();
    filteredPlaces.value.forEach(p => {
      if (p.category) catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1);
    });
    const sortedCats = Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1]);
    sortedCats.slice(0, 2).forEach(([cat]) => {
      suggestionsList.push({
        type: 'category',
        value: cat,
        label: getCatLabelText(cat)
      });
    });
  }

  if (selectedTownship.value === 'all' && tsInResults.size > 1) {
    const tsCounts = new Map<string, number>();
    filteredPlaces.value.forEach(p => {
      if (p.township) tsCounts.set(p.township, (tsCounts.get(p.township) || 0) + 1);
    });
    const sortedTs = Array.from(tsCounts.entries()).sort((a, b) => b[1] - a[1]);
    sortedTs.slice(0, 2).forEach(([ts]) => {
      const tsMapItem = TOWNSHIPS_MAP.find(item => item.en === ts);
      const label = lang.value === 'en' ? ts : (tsMapItem?.my || ts);
      suggestionsList.push({
        type: 'township',
        value: ts,
        label
      });
    });
  }

  return suggestionsList.length > 0 ? suggestionsList : null;
});

function applyDidYouMean(suggestion: string) {
  localSearchQuery.value = suggestion;
  searchQuery.value = suggestion;
}

function applyNarrowDown(type: 'category' | 'township', value: string) {
  if (type === 'category') {
    selectedCategory.value = value;
  } else if (type === 'township') {
    selectedTownship.value = value;
  }
}

const totalPages = computed(() => {
  return Math.ceil(filteredPlaces.value.length / itemsPerPage.value) || 1;
});

const visiblePages = computed(() => {
  const range: (number | string)[] = [];
  const delta = 1; 
  const left = currentPage.value - delta;
  const right = currentPage.value + delta;
  const total = totalPages.value;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      range.push(i);
    } else if (i === left - 1 || i === right + 1) {
      range.push('...');
    }
  }

  const result: (number | string)[] = [];
  let lastVal: number | string | null = null;
  for (const val of range) {
    if (val === '...' && lastVal === '...') {
      continue;
    }
    result.push(val);
    lastVal = val;
  }
  return result;
});

const paginatedPlaces = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPlaces.value.slice(start, end);
});

const relatedPlaces = computed(() => {
  if (!selectedPlace.value) return [];
  const origin = selectedPlace.value;
  return places.value
    .filter((p) => p.place_id !== origin.place_id)
    .map((p) => {
      const dist = calculateHaversineDistance(origin.lat, origin.lon, p.lat, p.lon);
      const isSameCategory = p.category === origin.category;
      
      const categoryScore = isSameCategory ? 1.5 : 0;
      const distanceScore = 2.0 / (1.0 + dist);
      const score = categoryScore + distanceScore;

      let distanceText = '';
      if (dist < 1) {
        distanceText = `${Math.round(dist * 1000)}m`;
      } else {
        distanceText = `${dist.toFixed(1)}km`;
      }

      return {
        ...p,
        distanceText,
        score
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
});

function handleHomeSearch(query: string) {
  localSearchQuery.value = query;
  searchQuery.value = query;
  selectedPlace.value = null; 
  activeTab.value = 'explorer';
}

function handleHomeSelectPlace(place: Place) {
  triggerSelectPlace(place);
  activeTab.value = 'explorer';
}

function resetSearchFilters() {
  searchQuery.value = '';
  localSearchQuery.value = '';
  selectedCity.value = 'all';
  selectedCategory.value = 'all';
  selectedTownship.value = 'all';
  minRating.value = 0;
  sortBy.value = 'rating';
}

function triggerSelectPlace(place: Place) {
  selectedPlace.value = place;
  hoveredPlace.value = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}



function handleCalculateRoute() {
  if (!selectedPlace.value) return;
  isCalculatingRoute.value = true;
  gpsError.value = null;

  let startName = '';
  let startCoords: [number, number] = [0, 0];

  if (routeStartKey.value === 'gps') {
    if (!navigator.geolocation) {
      gpsError.value = lang.value === 'en' ? 'Geolocation is not supported by your browser.' : 'သင့်ဘရောက်ဆာတွင် GPS စနစ်မထောက်ပံ့ပါ။';
      isCalculatingRoute.value = false;
      return;
    }

    getAccurateLocation(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        startName = t.value.currentLocation;
        startCoords = [lat, lon];
        
        generateRouteInfo(
          startName,
          startCoords,
          lang.value === 'en' ? selectedPlace.value!.name : selectedPlace.value!.name_my,
          [selectedPlace.value!.lat, selectedPlace.value!.lon]
        ).then((computedRoute) => {
          route.value = computedRoute;
          routeInstructions.value = generateNavigationSteps(
            startName, 
            selectedPlace.value!.name, 
            computedRoute.distanceKm,
            startCoords,
            [selectedPlace.value!.lat, selectedPlace.value!.lon]
          );
        }).catch((err) => {
          console.error('Error generating GPS route:', err);
        }).finally(() => {
          isCalculatingRoute.value = false;
        });
      },
      (error) => {
        console.warn('GPS trigger error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          gpsError.value = lang.value === 'en'
            ? 'GPS permission denied. Please allow location access.'
            : 'GPS အသုံးပြုခွင့် ငြင်းပယ်ထားပါသည်။ ခွင့်ပြုပေးရန် လိုအပ်ပါသည်။';
        } else {
          gpsError.value = lang.value === 'en'
            ? 'GPS timed out or unavailable. Defaulting to Central Terminal Hub.'
            : 'GPS တည်နေရာ မရရှိပါ (သို့) အချိန်ကျော်လွန်သွားပါသဖြင့် ဗဟိုဘူတာကြီးမှ တွက်ချက်ပေးပါသည်။';
        }
        
        routeStartKey.value = 'hub-station';
        calculateHubRoute('hub-station');
      }
    );
  } else {
    calculateHubRoute(routeStartKey.value);
  }

  function calculateHubRoute(key: string) {
    if (key === 'hub-station') {
      startName = lang.value === 'en' ? 'Yangon Central Railway Station' : 'ရန်ကုန်ပတ်ရထားဘူတာကြီး';
      startCoords = YANGON_CENTER_FALLBACK;
    } else if (key === 'hub-pagoda') {
      startName = lang.value === 'en' ? 'Sule Square Hub' : 'ဆူးလေဘုရားဗဟို';
      startCoords = [16.7744, 96.1587];
    } else {
      startName = lang.value === 'en' ? 'Yangon Airport (RGN)' : 'ရန်ကုန်လေဆိပ်';
      startCoords = [16.9038, 96.1311];
    }

    generateRouteInfo(
      startName,
      startCoords,
      lang.value === 'en' ? selectedPlace.value!.name : selectedPlace.value!.name_my,
      [selectedPlace.value!.lat, selectedPlace.value!.lon]
    ).then((computedRoute) => {
      route.value = computedRoute;
      routeInstructions.value = generateNavigationSteps(
        startName, 
        selectedPlace.value!.name, 
        computedRoute.distanceKm,
        startCoords,
        [selectedPlace.value!.lat, selectedPlace.value!.lon]
      );
    }).catch((err) => {
      console.error('Error generating Hub route:', err);
    }).finally(() => {
      isCalculatingRoute.value = false;
    });
  }
}

</script>

<style scoped>
/* Translucent fading transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
