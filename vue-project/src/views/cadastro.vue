<script setup lang="ts">
import logoImg from '@/assets/logo.svg'
import logoFooter from '@/assets/logoFooter.png'
import logoIfrn from '@/assets/ifrn.png'
import XImg from '@/assets/x.png'
import instagramImg from '@/assets/instagram.png'
import youtubeImg from '@/assets/youtube.png'
import { VueDatePicker as DatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { ref } from 'vue'
const todasCategorias = [
  'Tecnologia',
  'Ensino',
  'Pesquisa e Extensão',
  'Arte e Cultura',
  'Esporte',
  'Gestão',
  'Recursos naturais',
  'Palestra',
]

const categoriasAbertas = ref(false)
const categoriasSelecionadas = ref<string[]>([])

function toggleCategorias() {
  categoriasAbertas.value = !categoriasAbertas.value
}

function selecionarCategoria(nome: string) {
  if (!categoriasSelecionadas.value.includes(nome)) {
    categoriasSelecionadas.value.push(nome)
  }
}

function removerCategoria(nome: string) {
  categoriasSelecionadas.value = categoriasSelecionadas.value.filter((cat) => cat !== nome)
}

const datasEvento = ref<Date[]>([])
const datasInscricao = ref<Date[]>([])

const horarioEvento = ref({
  inicio: '',
  fim: '',
})

const horarioInscricao = ref({
  inicio: '',
  fim: '',
})

const form = ref({
  nome: '',
  imagem: null,

  categorias: [],
  descricao: '',
  link: '',

  evento: {
    inicioData: null,
    fimData: null,
    inicioHora: '',
    fimHora: '',
  },

  inscricao: {
    inicioData: null,
    fimData: null,
    inicioHora: '',
    fimHora: '',
  },

  organizadores: ['', '', ''],
})
</script>

<template>
  <div class="page">
    <header class="main-header">
      <div class="header-logo-container">
        <img :src="logoImg" alt="Logo Eventos CNAT" class="header-logo" />
      </div>
      <div class="header-inner">
        <ul>
          <li><a href="">Calendário</a></li>
          <li><a href="">Adicionar Evento</a></li>
          <li><a href="">Inscrições Abertas</a></li>
        </ul>
      </div>
    </header>

    <main class="main-content">
      <h1>Adicionar Evento</h1>
      <!-- Section 1 -->
      <section class="form-section">
        <h2>1. Informações do Evento</h2>

        <div class="form-group">
          <label>Nome do Evento*</label>
          <input type="text" />
        </div>

        <div class="form-group">
          <label>Imagem de divulgação*</label>
          <input type="file" />
        </div>

        <div class="form-group">
          <div class="cat-header">
            <span class="cat-label">Categorias</span>

            <button type="button" class="cat-icon-btn" @click="toggleCategorias">
              <span class="arrow">⌄</span>
            </button>
          </div>

          <!-- LISTA DROPDOWN -->
          <div v-if="categoriasAbertas" class="cat-dropdown">
            <div
              class="cat-option"
              v-for="cat in todasCategorias"
              :key="cat"
              @click="selecionarCategoria(cat)"
            >
              {{ cat }}
            </div>
          </div>

          <div class="cat-tags">
            <span v-for="cat in categoriasSelecionadas" :key="cat" class="tag">
              {{ cat }}
              <button class="remove-tag" @click="removerCategoria(cat)">✖</button>
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea></textarea>
        </div>
        <div class="form-group">
          <label>Link para mais informações</label>
          <input type="url" />
        </div>
      </section>

      <section class="form-section">
        <h2>2. Data e Horário do Evento</h2>

        <div class="form-group">
          <label>Selecione o período do evento</label>

          <div class="date-time-row">
            <DatePicker
              v-model="datasEvento"
              multi-dates
              :enable-time-picker="false"
              :clearable="true"
              placeholder="Selecione os dias do evento"
            />
            <ul class="lista-datas">
              <li v-for="(d, index) in datasEvento" :key="index">
                {{ d.toLocaleDateString('pt-BR') }}
              </li>
            </ul>

            <input
              type="time"
              v-model="horarioEvento.inicio"
              class="time-input"
              placeholder="Início"
            />

            <input type="time" v-model="horarioEvento.fim" class="time-input" placeholder="Fim" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <h2>2. Data e Horário da abertura de inscrições</h2>

        <div class="form-group">
          <label>Selecione o período de inscrições</label>

          <div class="date-time-row">
            <DatePicker
              v-model="datasInscricao"
              multi-dates
              :enableTimePicker="false"
              placeholder="Selecione os dias de inscrição"
            />

            <ul class="lista-datas">
              <li v-for="(d, index) in datasInscricao" :key="index">
                {{ d.toLocaleDateString('pt-BR') }}
              </li>
            </ul>

            <input type="time" v-model="horarioInscricao.inicio" class="time-input" />

            <input type="time" v-model="horarioInscricao.fim" class="time-input" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <h2>3. Informações dos organizadores</h2>

        <div class="form-group">
          <label>Email</label>
          <input type="email" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" />
        </div>
      </section>

      <div class="submit-container">
        <button class="submit-btn">Confirmar</button>
      </div>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <img :src="logoFooter" alt="Eventos CNAT" class="footer-logo" />
          <img :src="logoIfrn" alt="Logo do IFRN" class="logo-if" />
        </div>

        <div class="footer-right">
          <div class="social">
            <img :src="instagramImg" alt="Logotipo do Instagram" />
            <img :src="XImg" alt="Logotipo do X" />
            <img :src="youtubeImg" alt="Logotipo do YouTube" />
          </div>
          <p>cnat@ifrn.com</p>
          <address>
            Av. Sen. Salgado Filho, 1559 – Tirol, Natal – RN <br /><strong>CEP:</strong> 59015-000
          </address>
        </div>
      </div>
      <div class="copy">
        <p>© 2025 - Centro de Soluções Aplicadas. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page {
  background: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  width: 100%;
  background-color: #8aeec3;
  box-shadow: 2px 1px 5px #b8b8b8;
  position: relative;
  margin-bottom: 100px;
  overflow: hidden;
  min-height: 120px;
  max-height: 250px;
}

.header-logo-container {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1440px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 0 20px;
  z-index: 10;
}

.header-logo {
  width: 15%;
  max-width: 180px;
  height: auto;
  cursor: pointer;
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 20px;
}

header ul {
  list-style: none;
  display: flex;
  gap: 2.5rem;
  padding: 1.5rem;
  z-index: 20;
  margin-left: auto;
}

header li a {
  text-decoration: none;
  font-size: 1.2rem;
  color: #07753e;
  font-weight: 500;
  transition: 0.2s;
}

header li a:hover {
  color: #044632;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

/* MAIN */
.main-content {
  max-width: 1440px;
  width: 1440px;
  margin: 20px auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

h1 {
  color: #0a4635;
}
.form-section {
  width: 100%;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0002;
}

.form-section h2 {
  margin-bottom: 20px;
  color: #1b473a;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.cat-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 10px;
}

.cat-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
}

.cat-icon-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: #f3f3f3;
  border: 1px solid #dcdcdc;
  border-radius: 8px;

  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 1px 2px #0001;
}

.cat-icon-btn:hover {
  background: #e7e7e7;
  border-color: #c9c9c9;
  box-shadow: 0 2px 4px #0002;
}

.arrow {
  font-size: 25px;
  color: #444;
  font-weight: bold;
  transform: translateY(-7px);
}

.cat-dropdown {
  margin-top: 5px;
  background: white;
  border: 1px solid #b6e8d2;
  border-radius: 8px;
  box-shadow: 0 2px 6px #0002;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 260px;
}

.cat-option {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.cat-option:hover {
  background: #d8f7ea;
}

.cat-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.tag {
  background: #c8f5de;
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.remove-tag {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #0a8f5a;
}
.remove-tag:hover {
  color: red;
}

.date-time-row {
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
}

.calendar-input {
  flex: 2;
  padding: 12px;
  border: 1px solid #0a8f5a;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.time-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #0a8f5a;
  border-radius: 8px;
}

.calendar-input:hover {
  border-color: #077a4c;
}

.vc-container {
  --vc-accent-100: #8aeec3;
  --vc-accent-200: #5ed7a5;
  --vc-accent-300: #2fbf85;
  --vc-accent-400: #0a8f5a; /* verde principal */
}

.submit-container {
  display: flex;
  justify-content: flex-end;
}
.submit-btn {
  background: #08472e;
  color: white;
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

footer {
  background-color: #02402e;
  color: #ffffff;
  font-size: 14px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.footer-content {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 40px 20px 30px;
  gap: 20px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 10px 4px;
}

.footer-logo {
  width: 220px;
}

.logo-if {
  width: 220px;
}

.footer-right {
  display: flex;
  flex-direction: column;
  text-align: right;
  gap: 6px;
}

.footer-right p {
  margin: 10px 4px;
  font-size: 20px;
}

.social {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.social img {
  width: 38px;
  cursor: pointer;
  transition: 0.2s;
}

.social img:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

.copy {
  text-align: center;
  font-size: 12px;
  padding: 15px 20px;
  background-color: #012118;
  width: 100%;
  opacity: 0.85;
}

/* Space before footer */
main section:last-child {
  margin-bottom: 6rem;
}
</style>
