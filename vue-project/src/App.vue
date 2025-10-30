<script setup lang="ts">
import Button from './componentes/Button.vue'
import CardInscricoes from './componentes/CardInscricoes.vue'
const eventos = [
  {
    titulo: 'Evento alusivo ao dia do professor de geografia',
    local: 'Miniauditório Central',
    categoria: 'Palestras',
    datas: [
      { data: '20/06', hora: '14h', descricao: 'Abertura das inscrições' },
      { data: '24/06', hora: '23:59', descricao: 'Período final das inscrições' },
    ],
  },
]
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <Button></Button>
  <CardInscricoes
    v-for="(evento, index) in eventos"
    :key="index"
    :titulo="evento.titulo"
    :local="evento.local"
    :categoria="evento.categoria"
    :datas="evento.datas"
  >
  </CardInscricoes>
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
