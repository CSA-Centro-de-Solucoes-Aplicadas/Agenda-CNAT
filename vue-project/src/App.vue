<script setup lang="ts">
import Button from './componentes/Button.vue'
import CardInscricoes from './componentes/CardInscricao.vue'
import CardDestaque from './componentes/CardDestaque.vue'
import CarrosselDestaque from './componentes/CarrosselDestaque.vue'
import CarrosselDestaque from './componentes/CarrosselDestaque.vue'
const eventos = [
  {
    titulo: 'Evento alusivo ao dia do professor de geografia',
    local: 'Miniauditório Central',
    categoria: 'Palestras',
    datas: [
      { data: '20/06', hora: '14:00', descricao: 'Abertura das inscrições' },
      { data: '20/07', hora: '12:00', descricao: 'Inicio do evento' },
      { data: '24/06', hora: '23:59', descricao: 'Período final das inscrições' },
    ],
  },
]
</script>

<template>
  <CarrosselDestaque></CarrosselDestaque>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  font-size: 1rem;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}
</style>
