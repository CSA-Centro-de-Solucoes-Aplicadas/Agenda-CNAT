<script setup lang="ts">
import CardInscricao from './componentes/CardInscricao.vue'
import Carrossel from './componentes/Carrossel.vue'
import CardDestaque from './componentes/CardDestaque.vue'
import ButtonSeta from './componentes/ButtonSeta.vue'
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
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
  {
    titulo: 'CineBiblio',
    local: 'Biblioteca Central',
    categoria: 'Cultura',
    datas: [
      { data: '06/11', hora: '15:00', descricao: 'Abertura das inscrições' },
      { data: '10/11', hora: '09:00', descricao: 'Início do evento' },
      { data: '10/11', hora: '12:00', descricao: 'Período final das inscrições' },
    ],
  },
]
</script>

<template>
  <ButtonSeta></ButtonSeta>
  <Carrossel :itens="eventos" :component="CardDestaque"></Carrossel>
  <Carrossel :itens="eventos" :component="CardInscricao"></Carrossel>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
