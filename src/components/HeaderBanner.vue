<template>
  <!-- 1. HEADER BANNER -->
  <header class="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E5E0D8] transition-all duration-200 animate-fade-in">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      
      <!-- Brand identity -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#A23B24] flex items-center justify-center text-white text-xl font-serif font-bold tracking-tighter shadow-sm transition-transform hover:scale-105">
          Y
        </div>
        <div>
          <h1 class="text-xl md:text-2xl font-serif font-semibold text-[#1C1C1C] leading-none tracking-tight">
            Yangon Places
          </h1>
          <p class="text-[10px] md:text-[11px] text-[#A23B24] font-medium tracking-widest mt-1">
            A LIVING DIRECTORY OF YANGON
          </p>
        </div>
      </div>

      <!-- Navigation Tabs & Language Switcher -->
      <div class="flex items-center gap-6">
        <nav class="hidden md:flex items-center gap-5">
          <button
            id="tab-home"
            @click="emitActiveTab('home')"
            :class="[
              'text-[11px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer',
              activeTab === 'home' 
                ? 'text-[#A23B24] border-b-2 border-[#A23B24] pb-0.5' 
                : 'text-[#6C665D] hover:text-[#1C1C1C]'
            ]"
          >
            {{ lang === 'en' ? 'HOME' : 'ပင်မစာမျက်နှာ' }}
          </button>
          <button
            id="tab-explorer"
            @click="emitActiveTab('explorer')"
            :class="[
              'text-[11px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer',
              activeTab === 'explorer' 
                ? 'text-[#A23B24] border-b-2 border-[#A23B24] pb-0.5' 
                : 'text-[#6C665D] hover:text-[#1C1C1C]'
            ]"
          >
            {{ lang === 'en' ? 'BROWSE' : 'ရှာဖွေရန်' }}
          </button>

          <button
            id="tab-about"
            @click="emitActiveTab('about')"
            :class="[
              'text-[11px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer',
              activeTab === 'about' 
                ? 'text-[#A23B24] border-b-2 border-[#A23B24] pb-0.5' 
                : 'text-[#6C665D] hover:text-[#1C1C1C]'
            ]"
          >
            {{ lang === 'en' ? 'ABOUT' : 'အကြောင်းအရာ' }}
          </button>
        </nav>

        <!-- Bilingual Selector (Styled exactly like the screenshot) -->
        <div class="flex items-center">
          <button
            id="lang-en"
            @click="emitSetLang('en')"
            :class="[
              'px-4 py-1.5 text-xs font-bold tracking-wider transition-all duration-150 cursor-pointer border border-[#1C1C1C]',
              lang === 'en' 
                ? 'bg-[#1C1C1C] text-white' 
                : 'bg-transparent text-[#1C1C1C] hover:bg-[#E5E0D8]/40'
            ]"
          >
            EN
          </button>
          <button
            id="lang-my"
            @click="emitSetLang('my')"
            :class="[
              'px-4 py-1.5 text-xs font-bold font-sans tracking-wide transition-all duration-150 cursor-pointer border-y border-r border-[#1C1C1C]',
              lang === 'my' 
                ? 'bg-[#1C1C1C] text-white' 
                : 'bg-transparent text-[#1C1C1C] hover:bg-[#E5E0D8]/40'
            ]"
          >
            မြန်မာ
          </button>
        </div>

        <!-- Mobile Menu Trigger -->
        <button
          id="mobile-menu-toggle"
          @click="toggleMobileMenu"
          class="md:hidden p-1.5 rounded-lg border border-[#E5E0D8] hover:bg-[#E5E0D8]/40 text-[#1C1C1C] transition-colors cursor-pointer"
        >
          <X v-if="isMobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-[#FAF8F5] border-t border-[#E5E0D8] px-4 py-3 flex flex-col gap-2 animate-fade-in">
      <button
        @click="selectTabMobile('home')"
        :class="[
          'w-full text-left px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer',
          activeTab === 'home' ? 'text-[#A23B24]' : 'text-[#6C665D]'
        ]"
      >
        ⛪ {{ lang === 'en' ? 'Home' : 'ပင်မစာမျက်နှာ' }}
      </button>
      <button
        @click="selectTabMobile('explorer')"
        :class="[
          'w-full text-left px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer',
          activeTab === 'explorer' ? 'text-[#A23B24]' : 'text-[#6C665D]'
        ]"
      >
        🌎 {{ lang === 'en' ? 'Browse Directory' : 'ရှာဖွေရန်' }}
      </button>

      <button
        @click="selectTabMobile('about')"
        :class="[
          'w-full text-left px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer',
          activeTab === 'about' ? 'text-[#A23B24]' : 'text-[#6C665D]'
        ]"
      >
        ℹ️ {{ lang === 'en' ? 'About Grid' : 'အကြောင်းအရာ' }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next';

const props = defineProps<{
  lang: 'en' | 'my';
  activeTab: string;
  isMobileMenuOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', tab: string): void;
  (e: 'update:isMobileMenuOpen', open: boolean): void;
  (e: 'setLang', l: 'en' | 'my'): void;
}>();

function emitActiveTab(tab: string) {
  emit('update:activeTab', tab);
}

function emitSetLang(l: 'en' | 'my') {
  emit('setLang', l);
}

function toggleMobileMenu() {
  emit('update:isMobileMenuOpen', !props.isMobileMenuOpen);
}

function selectTabMobile(tab: string) {
  emit('update:activeTab', tab);
  emit('update:isMobileMenuOpen', false);
}
</script>
