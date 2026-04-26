<script setup lang="ts">
import { ref } from 'vue'

import logoImg from '@/assets/logo.svg'
import BarradePesquisa from '@/componentes/BarradePesquisa.vue'
import type { EventRecord } from '@/types/event'

const props = defineProps<{
  eventos: EventRecord[]
}>()

const emit = defineEmits<{
  select: [event: EventRecord]
}>()

const mobileMenuOpen = ref(false)

const links = [
  { label: 'Programação', href: '#programacao' },
  { label: 'Adicionar Evento', href: '#adicionar-evento' },
  { label: 'Inscrições Abertas', href: '#inscricoes' },
]
</script>

<template>
  <header class="main-header">
    <div class="header-motion header-motion--one"></div>
    <div class="header-motion header-motion--two"></div>

    <div class="header-container">
      
      <RouterLink to="/" class="header-logo-container">
        <img :src="logoImg" alt="Logo Eventos CNAT" class="header-logo" />
      </RouterLink>

      <div class="header-search">
        <BarradePesquisa :eventos="props.eventos" compact @select="emit('select', $event)" />
      </div>

      <nav class="desktop-nav">
        <a v-for="link in links" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>

      <button type="button" class="mobile-trigger" @click="mobileMenuOpen = !mobileMenuOpen">
        Menu
      </button>
      
    </div>

    <nav v-if="mobileMenuOpen" class="mobile-nav">
      <a v-for="link in links" :key="link.href" :href="link.href" @click="mobileMenuOpen = false">
        {{ link.label }}
      </a>
    </nav>

    <div class="wave-container">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="wave-svg wave-back">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </svg>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="wave-svg wave-front">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </svg>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  position: relative;
  z-index: 30;
  background: linear-gradient(120deg, #8aeec3 0%, #9cf2ca 38%, #86e2b9 100%);
}

.wave-container {
  position: absolute;
  top: 99%;
  left: 0;
  width: 100%;
  height: 70px;
  overflow: hidden;
  line-height: 0;
  filter: drop-shadow(0px 10px 15px rgba(2, 64, 46, 0.1));
}

.wave-svg {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: calc(100% + 1.3px);
  height: 60px;
}

.wave-front path {
  fill: #86e2b9;
}

.wave-back {
  transform: scaleX(-1);
  opacity: 0.6;
}

.wave-back path {
  fill: #a4f7d4;
}

.header-motion {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0.35;
  filter: blur(10px);
}

.header-motion--one {
  top: -24px;
  right: 8%;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0));
  animation: driftOne 12s ease-in-out infinite alternate;
}

.header-motion--two {
  left: 24%;
  bottom: -32px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(7, 117, 62, 0.22), rgba(7, 117, 62, 0));
  animation: driftTwo 16s ease-in-out infinite alternate;
}

.header-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.header-logo {
  width: 176px;
  height: auto;
  display: block;
}

.header-search {
  flex: 1;
  max-width: 500px;
  margin: 0 auto;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.desktop-nav a,
.mobile-nav a {
  color: #055638;
  text-decoration: none;
  font-weight: 700;
  white-space: nowrap;
}

.desktop-nav a {
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.46);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.desktop-nav a:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.86);
}

.mobile-trigger {
  display: none;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.72);
  color: #055638;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.mobile-nav {
  display: none;
}

@keyframes driftOne {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(22px, 14px, 0) scale(1.08); }
}

@keyframes driftTwo {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(-18px, -10px, 0) scale(1.12); }
}

@media (max-width: 1100px) {
  .header-container {
    gap: 16px;
    padding: 14px 20px;
  }
}

@media (max-width: 950px) {
  .header-container {
    flex-wrap: wrap;
  }
  .desktop-nav {
    display: none;
  }
  .mobile-trigger {
    display: inline-flex;
    order: 2;
  }
  .header-logo-container {
    order: 1;
  }
  .header-search {
    order: 3;
    max-width: 100%;
    width: 100%;
    margin-top: 8px;
  }
  .mobile-nav {
    display: grid;
    gap: 8px;
    padding: 0 18px 14px;
  }
  .mobile-nav a {
    background: rgba(255, 255, 255, 0.74);
    border-radius: 14px;
    padding: 12px 14px;
  }
}

@media (max-width: 640px) {
  .header-logo {
    width: 140px;
  }
  .wave-svg {
    height: 40px;
  }
}
</style>