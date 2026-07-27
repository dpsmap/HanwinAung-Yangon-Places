<template>
  <div class="flex flex-col gap-16 md:gap-24 animate-fade-in py-4">
    
    <!-- Hero Section -->
    <section id="hero-heroic" class="flex flex-col gap-6 md:gap-8 max-w-3xl">
      <div class="flex items-center gap-3">
        <div class="h-[1px] w-12 bg-[#A23B24]" />
        <span class="text-[11px] font-bold tracking-[0.25em] text-[#A23B24] uppercase">
          DISCOVER • EXPLORE • CONNECT
        </span>
      </div>

      <h2 class="text-4xl sm:text-5xl md:text-6xl text-[#1C1C1C] font-serif tracking-tight leading-[1.08]">
        {{ lang === 'en' ? 'Discover the Golden Heart of' : 'ရန်ကုန်မြို့၏ ဆွဲဆောင်မှုအရှိဆုံး' }}
        <span class="italic text-[#A23B24]">{{ lang === 'en' ? 'Yangon.' : 'နေရာများ။' }}</span>
      </h2>

      <p class="text-sm md:text-base text-[#6C665D] font-light leading-relaxed max-w-2xl">
        {{ lang === 'en' 
          ? `Search ${livePlacesCount}+ verified places — auto shops, cafés, hospitals, hotels and more — across Yangon. Smart search, real coordinates, real reviews.`
          : `ရန်ကုန်တစ်ခွင်ရှိ ရွေးချယ်ထားသော ဆိုင်ခန်းများ၊ ကဖေးများ၊ ဆေးရုံများနှင့် ဟိုတယ်များ အပါအဝင် နေရာပေါင်း ${livePlacesCountBurmese} ကျော်ကို ရှာဖွေလိုက်ပါ။ တိကျသောတည်နေရာ မြေပုံညွှန်းနှင့် သုံးသပ်ချက်အစစ်အမှန်များ။` 
        }}
      </p>

      <!-- Search Widget Block -->
      <div class="relative w-full max-w-lg mt-4 z-20">
        <div class="flex flex-col sm:flex-row items-stretch border border-[#1C1C1C] bg-[#FAF8F5] shadow-sm overflow-hidden shrink-0">
          <input
            type="text"
            v-model="localSearchQuery"
            @focus="isHomeSearchFocused = true"
            @blur="handleHomeSearchBlur"
            @keydown.enter="handleHeroSearch"
            :placeholder="currentPlaceholder"
            class="flex-1 px-4 py-3.5 bg-transparent border-none text-[#1C1C1C] placeholder-[#6C665D]/60 focus:outline-none focus:ring-0 text-sm animate-fade-in"
          />
          <button
            @click="handleHeroSearch"
            class="px-6 py-3.5 bg-[#1C1C1C] hover:bg-[#A23B24] text-white font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>{{ lang === 'en' ? 'SEARCH' : 'ရှာဖွေဉီးမည်' }}</span>
            <span class="text-xs">→</span>
          </button>
        </div>

        <!-- GPS Location Trigger Action -->
        <div class="flex flex-wrap items-center gap-3 mt-3">
          <button
            @click="$emit('triggerGps')"
            class="px-3 py-1.5 bg-white border border-[#1C1C1C] hover:bg-[#A23B24] hover:text-white text-[#1C1C1C] font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span class="text-xs">📍</span>
            <span>{{ lang === 'en' ? 'Find Places Near Me (Use GPS)' : 'အနီးနားရှိနေရာများရှာရန် (GPS သုံးရန်)' }}</span>
          </button>
          
          <span v-if="gpsStatusMessage" class="text-[10px] font-medium text-[#6C665D] bg-[#FAF8F5] px-2.5 py-1 border border-[#E5E0D8] flex items-center gap-1.5">
            <span class="inline-block w-1.5 h-1.5 rounded-full" :class="isAcquiringGps ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'"></span>
            {{ gpsStatusMessage }}
          </span>
        </div>

        <!-- Home Search suggestions dropdown -->
        <div 
          v-if="isHomeSearchFocused && localSearchQuery.trim() !== '' && suggestions.length > 0"
          class="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E5E0D8] shadow-lg z-50 divide-y divide-[#E5E0D8]/40 max-h-60 overflow-y-auto"
        >
          <div
            v-for="place in suggestions"
            :key="'suggest-home-' + place.place_id"
            @mousedown="selectHomeSuggestion(place)"
            class="p-3 hover:bg-[#FAF8F5] cursor-pointer flex flex-col gap-1 transition-colors text-left"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex flex-col gap-0.5">
                <span class="font-serif font-bold text-[#1C1C1C] text-xs leading-tight">
                  {{ place.name }}
                </span>
                <span v-if="place.name_my && place.name_my !== place.name" class="font-sans font-semibold text-[10px] text-[#6C665D]">
                  {{ place.name_my }}
                </span>
              </div>
              <span class="text-[8px] font-bold uppercase text-[#A23B24] tracking-wider px-1.5 py-0.5 bg-[#A23B24]/5 border border-[#A23B24]/20 whitespace-nowrap shrink-0">
                {{ place.category }}
                <span v-if="place.category_my && place.category_my !== place.category" class="font-semibold text-[#6C665D] normal-case">/{{ place.category_my }}</span>
              </span>
            </div>
            <div class="text-[10px] text-[#6C665D]/90 truncate font-light leading-normal">
              <span class="font-bold text-[#A23B24]">
                [{{ place.township }} Township<span v-if="place.township_my"> ({{ place.township_my }}မြို့နယ်)</span>]
              </span>
              {{ place.full_address }}
              <span v-if="place.full_address_my && place.full_address_my !== place.full_address" class="text-slate-400"> | {{ place.full_address_my }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATISTICS COMPONENT -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 border-t border-[#E5E0D8] pt-10 md:pt-14">
      <div class="flex flex-col gap-3.5 md:gap-4">
        <span class="text-4xl md:text-5xl font-serif text-[#A23B24] font-medium tracking-tight leading-normal md:leading-relaxed block pb-1">
          {{ lang === 'en' ? `${livePlacesCount}+` : `${livePlacesCountBurmese}+` }}
        </span>
        <span class="text-[10px] font-bold tracking-widest text-[#6C665D] uppercase block leading-none">{{ lang === 'en' ? 'PLACES LISTED' : 'စုစုပေါင်းနေရာများ' }}</span>
      </div>
      <div class="flex flex-col gap-3.5 md:gap-4">
        <span class="text-4xl md:text-5xl font-serif text-[#A23B24] font-medium tracking-tight leading-normal md:leading-relaxed block pb-1">
          {{ lang === 'en' ? liveCategoriesCount : liveCategoriesCountBurmese }}
        </span>
        <span class="text-[10px] font-bold tracking-widest text-[#6C665D] uppercase block leading-none">{{ lang === 'en' ? 'CATEGORIES' : 'အမျိုးအစားများ' }}</span>
      </div>
      <div class="flex flex-col gap-3.5 md:gap-4">
        <span class="text-4xl md:text-5xl font-serif text-[#A23B24] font-medium tracking-tight leading-normal md:leading-relaxed block pb-1">
          {{ lang === 'en' ? '2' : '၂' }}
        </span>
        <span class="text-[10px] font-bold tracking-widest text-[#6C665D] uppercase block leading-none">{{ lang === 'en' ? 'LANGUAGES' : 'ဘာသာစကားနှစ်မျိုး' }}</span>
      </div>
    </section>

    <!-- ALL CATEGORIES & PLACES SECTION -->
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-1 border-b border-[#E5E0D8] pb-4">
        <span class="text-[10px] font-bold tracking-widest text-[#A23B24] uppercase">— 01</span>
        <div class="flex items-end justify-between">
          <h3 class="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-[#1C1C1C]">
            {{ lang === 'en' ? 'Explore by category' : 'အမျိုးအစားအလိုက် ရှာဖွေပါ' }}
          </h3>
          <p class="text-[11px] text-[#6C665D] tracking-wide font-light italic hidden sm:block">
            {{ lang === 'en' ? 'Select a tag below to view and explore matching places directly' : 'နေရာများကို တိုက်ရိုက်ကြည့်ရှုရန် အောက်ပါ အမျိုးအစား တစ်ခုခုကို ကလစ်နှိပ်ပါ' }}
          </p>
        </div>
      </div>

      <!-- All Category Tags List (Collapsible/Relapsable) -->
      <div class="flex flex-col gap-3">
        <!-- Top Collapse/Expand Toggler Button for instant accessibility without scrolling -->
        <div v-if="availableCategories.length > 5" class="flex justify-between items-center border-b border-[#E5E0D8]/40 pb-1.5 mb-1">
          <span class="text-[9px] font-mono font-bold text-[#6C665D] uppercase tracking-wider">
            {{ lang === 'en' ? 'Quick Tag Explorer' : 'အမျိုးအစား အညွှန်းစစ်စနစ်' }}
          </span>
          <button
            @click="isCategoriesExpanded = !isCategoriesExpanded"
            class="text-xs font-mono font-bold text-[#A23B24] hover:text-[#1C1C1C] transition-all flex items-center gap-1.5 uppercase tracking-widest cursor-pointer py-1"
          >
            <span>
              {{ isCategoriesExpanded 
                ? (lang === 'en' ? 'Collapse ▴' : 'ချုံ့မည် ▴') 
                : (lang === 'en' ? `Show All (${availableCategories.length}) ▾` : `အားလုံးကြည့်မည် (${availableCategories.length}) ▾`) 
              }}
            </span>
          </button>
        </div>

        <div class="flex flex-wrap gap-2 justify-start">
          <button
            @click="homeSelectedCategory = 'all'"
            :class="[
              'px-4 py-2 text-xs font-mono tracking-wider uppercase border transition-all duration-250 cursor-pointer',
              homeSelectedCategory === 'all'
                ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white font-bold shadow-sm'
                : 'bg-white border-[#E5E0D8] text-[#1C1C1C] hover:border-[#A23B24] hover:text-[#A23B24]'
            ]"
          >
            {{ lang === 'en' ? 'All' : 'အားလုံး' }} ({{ places.length }})
          </button>
          <button
            v-for="cat in (isCategoriesExpanded ? availableCategories : availableCategories.slice(0, 5))"
            :key="cat"
            @click="homeSelectedCategory = cat"
            :class="[
              'px-4 py-2 text-xs font-mono tracking-wider uppercase border transition-all duration-250 cursor-pointer',
              homeSelectedCategory === cat
                ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white font-bold shadow-sm'
                : 'bg-white border-[#E5E0D8] text-[#1C1C1C] hover:border-[#A23B24] hover:text-[#A23B24]'
            ]"
          >
            {{ getCatLabelText(cat) }} ({{ categoryDetails.get(cat)?.count || 0 }})
          </button>
        </div>
        
        <!-- Collapse/Expand Toggler Button -->
        <div v-if="availableCategories.length > 5" class="flex justify-start">
          <button
            @click="isCategoriesExpanded = !isCategoriesExpanded"
            class="text-xs font-mono font-bold text-[#A23B24] hover:text-[#1C1C1C] transition-all flex items-center gap-1.5 uppercase tracking-widest cursor-pointer py-1"
          >
            <span>
              {{ isCategoriesExpanded 
                ? (lang === 'en' ? 'Collapse Categories ▴' : 'အမျိုးအစားများကို ချုံ့မည် ▴') 
                : (lang === 'en' ? `Show All Categories (${availableCategories.length}) ▾` : `အမျိုးအစားအားလုံးကြည့်မည် (${availableCategories.length}) ▾`) 
              }}
            </span>
          </button>
        </div>
      </div>

      <!-- Places Grid for Home Page Category Selection -->
      <div v-if="homeCategoryPlaces.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="place in homeCategoryPlaces"
          :key="place.place_id"
          @click="handleHighlyRatedClick(place)"
          class="group p-5 bg-white border border-[#E5E0D8] hover:border-[#A23B24] transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between gap-4"
        >
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-start gap-3">
              <div class="flex flex-col gap-0.5">
                <h4 class="font-serif font-semibold text-[#1C1C1C] group-hover:text-[#A23B24] text-base leading-tight transition-colors">
                  {{ place.name }}
                </h4>
                <h5 v-if="place.name_my && place.name_my !== place.name" class="font-sans font-semibold text-xs text-[#6C665D]">
                  {{ place.name_my }}
                </h5>
              </div>
            </div>
            
            <div class="flex flex-col gap-1 text-[11px] text-[#6C665D]">
              <div class="flex flex-wrap items-center gap-1.5 tracking-wide">
                <span class="font-bold text-[#A23B24] uppercase text-[10px]">
                  {{ place.category }}
                  <span v-if="place.category_my && place.category_my !== place.category" class="font-semibold text-[#6C665D]/80 normal-case">/ {{ place.category_my }}</span>
                </span>
                <span class="text-[#E5E0D8]">•</span>
                <span class="font-semibold text-[#1C1C1C] flex items-center gap-1">
                  <span>📍</span>
                  <span>
                    {{ place.township }} Township
                    <span v-if="place.township_my" class="font-medium text-[#6C665D] text-[10px]"> ({{ place.township_my }}မြို့နယ်)</span>
                  </span>
                </span>
              </div>
              
              <div class="font-light text-[10px] leading-normal" :title="place.full_address + (place.full_address_my ? ' | ' + place.full_address_my : '')">
                <span class="block truncate max-w-full text-[#1C1C1C]/80">{{ place.full_address }}</span>
                <span v-if="place.full_address_my && place.full_address_my !== place.full_address" class="block text-[#6C665D]/80 truncate max-w-full mt-0.5">{{ place.full_address_my }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-[#E5E0D8]/60 pt-3 text-xs text-[#6C665D]">
            <div class="flex items-center gap-2">
              <span class="text-amber-500 text-sm">★</span>
              <span class="font-mono font-bold text-[#1C1C1C]">{{ place.rating.toFixed(1) }}</span>
              <span class="font-mono text-[10px] text-[#6C665D]/70">({{ place.review_count }})</span>
            </div>
            <span class="text-[#1C1C1C] font-bold text-[10px] tracking-widest uppercase group-hover:text-[#A23B24] transition-all">
              {{ lang === 'en' ? 'VIEW MAP' : 'မြေပုံကြည့်မည်' }} →
            </span>
          </div>
        </div>
      </div>
      
      <!-- Show more explorer link if there are more than 12 places in this category -->
      <div v-if="homeCategoryPlaces.length > 0 && homeCategoryTotalCount > 12" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-[#E5E0D8] shadow-sm">
        <div class="text-xs text-[#6C665D] leading-relaxed">
          <span class="font-bold text-[#1C1C1C]">
            {{ lang === 'en' ? `Showing top 12 of ${homeCategoryTotalCount.toLocaleString()} places.` : `အကောင်းဆုံး ၁၂ ခုကိုသာ ဖော်ပြထားပါသည်။ (စုစုပေါင်း ${homeCategoryTotalCount.toLocaleString()} ခုရှိ)` }}
          </span>
          <p class="mt-1">
            {{ lang === 'en' 
              ? 'Use our advanced interactive search explorer tab to live filter, query, and locate all places.' 
              : 'နေရာအားလုံးကို စစ်ထုတ်၊ ရှာဖွေပြီး မြေပုံပေါ်တွင် ကြည့်ရှုရန် အဆင့်မြင့်ရှာဖွေရေးစာမျက်နှာကို အသုံးပြုပါ။'
            }}
          </p>
        </div>
        <button 
          @click="emitExplorer"
          class="w-full sm:w-auto px-5 py-2.5 bg-[#A23B24] hover:bg-[#8A321E] text-white text-[11px] font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-sm font-bold shrink-0"
        >
          {{ lang === 'en' ? 'Open Explorer' : 'ရှာဖွေရေးစာမျက်နှာ ဖွင့်မည်' }} →
        </button>
      </div>
      <div v-else-if="homeCategoryPlaces.length === 0" class="text-center py-12 bg-[#FAF8F5] border border-dashed border-[#E5E0D8]">
        <p class="text-xs text-[#6C665D] font-light">{{ lang === 'en' ? 'No places found in this category' : 'ဤအမျိုးအစားတွင် မည်သည့်နေရာမှ မရှိသေးပါ' }}</p>
      </div>
    </section>

    <!-- BROWSE BY TOWNSHIP SECTION -->
    <section class="flex flex-col gap-8">
      <div class="flex items-end justify-between border-b border-[#E5E0D8] pb-4">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-bold tracking-widest text-[#A23B24] uppercase">— 02</span>
          <h3 class="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-[#1C1C1C]">
            {{ lang === 'en' ? 'Browse by Township' : 'ရန်ကုန်မြို့နယ်အလိုက် ရှာဖွေပါ' }}
          </h3>
        </div>
        <p class="text-[11px] text-[#6C665D] tracking-wide font-light italic hidden sm:block">
          {{ lang === 'en' ? 'Explore places grouped by their localized township directories' : 'အုပ်စုဖွဲ့ထားသော မြို့နယ်လမ်းညွှန်များအလိုက် နေရာများကို ရှာဖွေပါ' }}
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="ts in popularTownships"
          :key="ts.nameEn"
          @click="handleHeroSearchWithQuery(ts.nameEn)"
          class="group p-5 bg-white border border-[#E5E0D8] hover:border-[#A23B24] transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between gap-4"
        >
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-mono font-bold text-[#A23B24] uppercase tracking-wider">
              {{ lang === 'en' ? 'Township' : 'မြို့နယ်' }}
            </span>
            <h4 class="font-serif font-bold text-[#1C1C1C] group-hover:text-[#A23B24] text-lg leading-tight transition-colors">
              {{ ts.nameEn }}
            </h4>
            <span class="text-xs text-[#6C665D] font-light">
              {{ ts.nameMy }}{{ lang === 'en' ? '' : 'မြို့နယ်' }}
            </span>
          </div>
          <div class="flex items-center justify-between border-t border-[#E5E0D8]/40 pt-2.5 text-[10px] font-mono text-[#6C665D] font-bold group-hover:text-[#A23B24] transition-colors">
            <span>{{ lang === 'en' ? `${ts.count} places` : `စုစုပေါင်း ${ts.count} ခု` }}</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </section>

    <!-- HIGHLY RATED THIS WEEK SECTION -->
    <section class="flex flex-col gap-8">
      <div class="flex items-end justify-between border-b border-[#E5E0D8] pb-4">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-bold tracking-widest text-[#A23B24] uppercase">— 03</span>
          <h3 class="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-[#1C1C1C]">
            {{ lang === 'en' ? 'Highly rated this week' : 'ယခုအပတ် အဆင့်သတ်မှတ်ချက် အကောင်းဆုံး' }}
          </h3>
        </div>
        <p class="text-[11px] text-[#6C665D] tracking-wide font-light italic hidden sm:block">
          {{ lang === 'en' ? 'Top picks from real reviews' : 'သုံးသပ်ချက်အစစ်အမှန်များမှ ရွေးချယ်မှုများ' }}
        </p>
      </div>

      <!-- Highly rated cards list -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(place, idx) in highlyRatedPlaces"
          :key="place.place_id"
          @click="handleHighlyRatedClick(place)"
          class="group relative p-6 bg-white border border-[#E5E0D8] hover:border-[#A23B24] transition-all duration-300 hover:shadow-sm cursor-pointer flex flex-col justify-between gap-6 animate-fade-in"
        >
          <!-- Index Number and Rating Pill -->
          <div class="flex items-start justify-between">
            <span class="text-xs font-serif text-[#A23B24] font-medium">{{ String(idx + 1).padStart(2, '0') }}</span>
            <div class="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E5E0D8] px-2.5 py-0.5 text-xs text-[#1C1C1C]">
              <span class="text-amber-500">★</span>
              <span class="font-mono font-bold">{{ place.rating.toFixed(1) }}</span>
              <span class="text-[#6C665D]/50 text-[10px]">({{ place.review_count }})</span>
            </div>
          </div>

          <!-- Content details -->
          <div class="flex flex-col gap-1">
            <div class="flex flex-wrap items-center gap-1.5 text-[10px] tracking-wider font-bold text-[#A23B24] uppercase">
              <span>{{ place.category }}</span>
              <span v-if="place.category_my && place.category_my !== place.category" class="font-semibold text-[#6C665D]/80 normal-case">/ {{ place.category_my }}</span>
            </div>
            
            <div class="flex flex-col gap-0.5 mt-0.5">
              <h4 class="text-xl font-serif font-semibold text-[#1C1C1C] leading-snug group-hover:text-[#A23B24] transition-colors">
                {{ place.name }}
              </h4>
              <h5 v-if="place.name_my && place.name_my !== place.name" class="font-sans font-semibold text-xs text-[#6C665D]">
                {{ place.name_my }}
              </h5>
            </div>

            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-[#1C1C1C] mt-1.5">
              <span>📍</span>
              <span>
                {{ place.township }} Township
                <span v-if="place.township_my" class="font-medium text-[#6C665D] text-[10px]"> ({{ place.township_my }}မြို့နယ်)</span>
              </span>
            </div>

            <div class="font-light text-[10px] leading-normal mt-1.5">
              <span class="block text-[#1C1C1C]/80 line-clamp-1">{{ place.full_address }}</span>
              <span v-if="place.full_address_my && place.full_address_my !== place.full_address" class="block text-[#6C665D]/80 line-clamp-1 mt-0.5">{{ place.full_address_my }}</span>
            </div>
            
            <div v-if="place.phone" class="text-xs font-mono text-[#6C665D] mt-2 flex items-center gap-1.5">
              <span class="text-[#A23B24]">•</span>
              <span>{{ place.phone }}</span>
            </div>
          </div>

          <!-- Floating Link Arrow -->
          <div class="self-end text-xs font-bold text-[#1C1C1C] group-hover:text-[#A23B24] group-hover:translate-x-1 transition-all">
            {{ lang === 'en' ? 'Map Details' : 'မြေပုံတွင် ကြည့်ရန်' }} →
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS SECTION -->
    <section class="flex flex-col gap-8">
      <div class="flex items-end justify-between border-b border-[#E5E0D8] pb-4">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-bold tracking-widest text-[#A23B24] uppercase">— 04</span>
          <h3 class="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-[#1C1C1C]">
            {{ lang === 'en' ? 'How it works' : 'လုပ်ငန်းဆောင်ရွက်ပုံ လမ်းညွှန်' }}
          </h3>
        </div>
      </div>

      <!-- Three columns steps exactly matching the layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="flex flex-col gap-4 border-l border-[#E5E0D8] pl-5">
          <span class="text-4xl font-serif text-[#A23B24]/40 font-bold">01</span>
          <h4 class="text-lg font-serif font-semibold text-[#1C1C1C]">
            {{ lang === 'en' ? 'Search anything' : 'ရှာဖွေခြင်း' }}
          </h4>
          <p class="text-xs text-[#6C665D] leading-relaxed font-light">
            {{ lang === 'en' 
              ? 'Type a name, address, or category — in English or Burmese.' 
              : 'မည်သည့်ဆိုင်၊ အမျိုးအစား သို့မဟုတ် လိပ်စာများကိုမဆို မြန်မာ သို့မဟုတ် အင်္ဂလိပ်လို ရှာဖွေပါ။' }}
          </p>
        </div>
        <div class="flex flex-col gap-4 border-l border-[#E5E0D8] pl-5">
          <span class="text-4xl font-serif text-[#A23B24]/40 font-bold">02</span>
          <h4 class="text-lg font-serif font-semibold text-[#1C1C1C]">
            {{ lang === 'en' ? 'Browse on map' : 'မြေပုံတွင် ကြည့်ရှုခြင်း' }}
          </h4>
          <p class="text-xs text-[#6C665D] leading-relaxed font-light">
            {{ lang === 'en' 
              ? 'See exact coordinates, photos of nearby roads, and related spots.' 
              : 'တိကျသော တည်နေရာအမှတ်အသားများ၊ အနီးနားရှိ လမ်းမများနှင့် ပတ်သက်သော နေရာများကို ကြည့်ရှုပါ။' }}
          </p>
        </div>
        <div class="flex flex-col gap-4 border-l border-[#E5E0D8] pl-5">
          <span class="text-4xl font-serif text-[#A23B24]/40 font-bold">03</span>
          <h4 class="text-lg font-serif font-semibold text-[#1C1C1C]">
            {{ lang === 'en' ? 'Get directions' : 'လမ်းကြောင်းဆွဲခြင်း' }}
          </h4>
          <p class="text-xs text-[#6C665D] leading-relaxed font-light">
            {{ lang === 'en' 
              ? 'Open the route in your favourite map app and head out.' 
              : 'မိမိစိတ်ကြိုက် မြေပုံစနစ်ဖြင့် ချိတ်ဆက်ကာ ခရီးသွားလမ်းကြောင်းများကို ရေးဆွဲပါ။' }}
          </p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Place } from '../types';

const props = defineProps<{
  lang: 'en' | 'my';
  places: Place[];
  isAcquiringGps?: boolean;
  gpsStatusMessage?: string | null;
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'selectPlace', place: Place): void;
  (e: 'emitExplorer'): void;
  (e: 'triggerGps'): void;
}>();

const localSearchQuery = ref<string>('');
const isHomeSearchFocused = ref<boolean>(false);
const homeSelectedCategory = ref<string>('all');
const isCategoriesExpanded = ref<boolean>(false);

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

// Suggestions autocomplete
const suggestions = ref<Place[]>([]);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(localSearchQuery, (newVal) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const query = newVal.trim().toLowerCase();
  if (query === '') {
    suggestions.value = [];
    return;
  }

  // Use a 120ms debounce so that typing in the homepage is perfectly smooth and lag-free
  debounceTimer = setTimeout(() => {
    const matches: Place[] = [];
    const list = props.places;
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
  }, 120);
});

// Category computations
const categoryDetails = computed(() => {
  const map = new Map<string, { count: number; nameMy: string }>();
  props.places.forEach((p) => {
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

// Township computations to organize directory structure beautifully
const townshipDetails = computed(() => {
  const map = new Map<string, { count: number; nameMy: string }>();
  props.places.forEach((p) => {
    if (!p.township) return;
    const existing = map.get(p.township);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(p.township, { count: 1, nameMy: p.township_my || p.township });
    }
  });
  return map;
});

const popularTownships = computed(() => {
  const list: { nameEn: string; nameMy: string; count: number }[] = [];
  townshipDetails.value.forEach((val, key) => {
    list.push({
      nameEn: key,
      nameMy: val.nameMy,
      count: val.count
    });
  });
  return list.sort((a, b) => b.count - a.count).slice(0, 8);
});

function handleHeroSearchWithQuery(query: string) {
  emit('search', query);
  isHomeSearchFocused.value = false;
}

function getCatLabelText(cat: string) {
  return props.lang === 'en' ? cat : (categoryDetails.value.get(cat)?.nameMy || cat);
}

const livePlacesCount = computed(() => {
  return props.places.length || 750;
});

const liveCategoriesCount = computed(() => {
  return availableCategories.value.length;
});

const burmeseDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
function toBurmeseNumerals(num: number): string {
  return String(num).split('').map(digit => {
    const d = parseInt(digit, 10);
    return isNaN(d) ? digit : burmeseDigits[d];
  }).join('');
}

const livePlacesCountBurmese = computed(() => {
  return toBurmeseNumerals(livePlacesCount.value);
});

const liveCategoriesCountBurmese = computed(() => {
  return toBurmeseNumerals(liveCategoriesCount.value);
});

const homeCategoryPlaces = computed(() => {
  let list = [];
  if (homeSelectedCategory.value === 'all') {
    list = props.places;
  } else {
    list = props.places.filter((p) => p.category === homeSelectedCategory.value);
  }
  return [...list]
    .sort((a, b) => b.rating - a.rating || b.review_count - a.review_count)
    .slice(0, 12);
});

const homeCategoryTotalCount = computed(() => {
  if (homeSelectedCategory.value === 'all') {
    return props.places.length;
  }
  return categoryDetails.value.get(homeSelectedCategory.value)?.count || 0;
});

const highlyRatedPlaces = computed(() => {
  return [...props.places]
    .sort((a, b) => b.rating - a.rating || b.review_count - a.review_count)
    .slice(0, 4);
});

function handleHeroSearch() {
  emit('search', localSearchQuery.value);
  isHomeSearchFocused.value = false;
}

function selectHomeSuggestion(place: Place) {
  emit('selectPlace', place);
  isHomeSearchFocused.value = false;
  localSearchQuery.value = '';
}

function handleHighlyRatedClick(place: Place) {
  emit('selectPlace', place);
}

function emitExplorer() {
  emit('emitExplorer');
}

function handleHomeSearchBlur() {
  setTimeout(() => {
    isHomeSearchFocused.value = false;
  }, 200);
}
</script>
