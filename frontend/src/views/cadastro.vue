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
import footer from '@/componentes/footer.vue'
import Footer from '@/componentes/footer.vue'
import Header from '@/componentes/header.vue'

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
const novaCategoria = ref('')

function toggleCategorias() {
  categoriasAbertas.value = !categoriasAbertas.value
}

function selecionarCategoria(nome: string) {
  if (categoriasSelecionadas.value.length >= 2) return
  if (!categoriasSelecionadas.value.includes(nome)) {
    categoriasSelecionadas.value.push(nome)
  }
}

function adicionarCategoriaManual() {
  const nome = novaCategoria.value.trim()
  if (!nome) return
  if (categoriasSelecionadas.value.length >= 2) return
  if (categoriasSelecionadas.value.includes(nome)) return

  categoriasSelecionadas.value.push(nome)
  novaCategoria.value = ''
}

function removerCategoria(nome: string) {
  categoriasSelecionadas.value =
    categoriasSelecionadas.value.filter(c => c !== nome)
}


const titulo = ref('')
const imagem = ref<File | null>(null)
const descricao = ref('')
const linkInformacoes = ref('')


const dataInicioEvento = ref<Date | null>(null)
const dataFimEvento = ref<Date | null>(null)


const dataInicioInscricao = ref<Date | null>(null)
const dataFimInscricao = ref<Date | null>(null)
const linkInscricao = ref('')


const organizadores = ref<string[]>([''])

function adicionarOrganizador() {
  organizadores.value.push('')
}

function removerOrganizador(index: number) {
  organizadores.value.splice(index, 1)
}


function enviarFormulario() {
  const dados = {
    titulo: titulo.value,
    imagem: imagem.value,
    categorias: categoriasSelecionadas.value,
    descricao: descricao.value,
    linkInformacoes: linkInformacoes.value,
    dataInicioEvento: dataInicioEvento.value,
    dataFimEvento: dataFimEvento.value,
    dataInicioInscricao: dataInicioInscricao.value,
    dataFimInscricao: dataFimInscricao.value, 
    linkInscricao: linkInscricao.value,
    organizadores: organizadores.value.filter(o => o.trim() !== ''),
  }

  console.log('ENVIADO COM SUCESSO:', dados)
}
</script>


<template>
  <div class="page">
    <Header />

    <main class="main-content">
      <h1>Adicionar Evento</h1>
      <!-- Section 1 -->
      <section class="form-section">
        <h2>1. Informações do Evento</h2>

        <div class="form-group">
          <label>Nome do Evento*</label>
          <input type="text" required />
        </div>

        <div class="form-group">
          <label>Imagem de divulgação*</label>
          <input type="file" required />
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

             <input
                type="text"
                v-model="novaCategoria"
                placeholder="Adicionar categoria..."
                class="cat-input"
                @keyup.enter="adicionarCategoriaManual"
                :disabled="categoriasSelecionadas.length >= 2" required
              />

            <div
              class="cat-option"
              v-for="cat in todasCategorias"
              :key="cat"
              @click="selecionarCategoria(cat)"
              :class="{ disabled: categoriasSelecionadas.length >= 2 }"
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
          <textarea></textarea required>
        </div>
        <div class="form-group">
          <label>Link para mais informações</label>
          <input type="url" />
        </div>
      </section>

      <section class="form-section">
        <h2>2. Datas e Horário do Evento</h2>

        <div class="datas-in-row">
          <div class="form-group">
          <label>Data de início *</label>
          <DatePicker
            v-model="dataInicioEvento"
            :enable-time-picker="true"
            placeholder="Selecione o dia e horário de início"
          />
        </div>

        <div class="form-group">
          <label>Data de fim *</label>
          <DatePicker
            v-model="dataFimEvento"
            :enable-time-picker="false"
            placeholder="Selecione o dia e horário final"
          />
        </div>
      </div>
        
      </section>
      
      
      <section class="form-section">
        <h2>2.1 Período de Inscrições</h2>
        <div class="datas-in-row">
          <div class="form-group">
          <label>Data de início das inscrições *</label>
          <DatePicker
          v-model="dataInicioInscricao"
          :enable-time-picker="false"
          placeholder="Dia de início das inscrições"
          />
        </div>
        <div class="form-group">
          <label>Data de fim das inscrições *</label>
          <DatePicker
          v-model="dataFimInscricao"
          :enable-time-picker="false"
          placeholder="Dia de fim das inscrições"
          />
        </div>
      </div>
        
        <div class="form-group">
          <label>Link para inscrições</label>
          <input type="url" />
        </div>
        
      </section>


      <section class="form-section">
        <h2>3. Informações dos organizadores</h2>
          <div class="organizadores-section">
            <div
              v-for="(email, index) in organizadores"
              :key="index"
              class="organizador-field"
            >
              <input
                type="email"
                v-model="organizadores[index]"
                placeholder="Email do organizador"
              />

              <button
                v-if="organizadores.length > 1"
                @click="removerOrganizador(index)"
                class="remove-field"
              >
                ✖
              </button>
            </div>

            <button @click="adicionarOrganizador" class="add-field">
              + Adicionar organizador
            </button>
          </div>
      </section>
      <div class="submit-container">
         <button class="submit-btn" >Confirmar</button>
      </div>
    </main>
    <Footer/>
  </div>
</template>

<style scoped>
.page {
  background: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  max-width: 1440px;
  width: 100%;
  margin: 20px auto;
  padding: 0 20px;
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

.datas-in-row {
  display: flex;
  flex-direction: row;
  gap: 100px;
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
.cat-input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 8px;
}

.disabled {
  opacity: 0.4;
  pointer-events: none;
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

.dia-item {
  background: #e6fff4;
  border: 1px solid #ddf5e9;
  padding: 12px 15px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  gap: 20px;

  box-shadow: 0 2px 6px #0001;
}

.dia-label {
  font-weight: 600;
  color: #066245;
  width: 120px;
}

.time-input {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fff;
  min-width: 120px;
}
/*organizadores */
.organizadores-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
  width: 100%;
}
.organizador-field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 10px;
}

.organizador-field input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
}

.remove-field {
  background: #ffe5e5;
  border: 1px solid #ffb3b3;
  color: #a00;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
}

.remove-field:hover {
  background: #ffd2d2;
  color: #700;
}

.add-field {
  align-self: flex-start;
  background: #c8f5de;
  border: 1px solid #9bd9b9;
  padding: 8px 16px;
  border-radius: 8px;
  color: #0b5c3e;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.add-field:hover {
  background: #b2f0d1;
  border-color: #89cdaa;
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

@media screen and (max-width: 750px) {
  .datas-in-row {
    flex-direction: column;
    gap: 10px;
  }
  header ul {
    display: none;
  }

  .main-header {
    min-height: 60px;
    max-height: 60px;
  }

  .header-container {
    padding: 0;
  }

  .header-logo-container {
    position: static;
    transform: none;
    justify-content: left;
    padding: 10px 8px;
  }

  .header-logo {
    top: 50px;
    left: 10px;
    width: 50%;
    max-width: 80px;
  }
}
</style>
