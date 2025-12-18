<script setup lang="ts">
import AgendaSemana from '@/components/AgendaSemana.vue'
import CalendarioAnual from './components/CalendarioAnual.vue'
import BarradePesquisa from '@/components/BarradePesquisa.vue'
</script>

<template>
  <div>
    <router-view />
    <BarradePesquisa />
    <AgendaSemana />
    <CalendarioAnual />
  </div>
</template>

<style scoped></style>
