<script setup lang="ts">
 import AgendaSemana from '@/components/AgendaSemana.vue'
 import CalendarioAnual from './components/CalendarioAnual.vue';
</script>

<template>
  <div>
      <router-view />
     <AgendaSemana />
     <CalendarioAnual/>
  </div>
</template>

<style scoped>

</style>
