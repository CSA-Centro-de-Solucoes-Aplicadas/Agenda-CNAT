<script setup lang="ts">
import logoImg from '@/assets/logo.svg'
import logoFooter from '@/assets/logoFooter.png'
import logoIfrn from '@/assets/ifrn.png'
import XImg from '@/assets/x.png'
import instagramImg from '@/assets/instagram.png'
import youtubeImg from '@/assets/youtube.png'
import { VueDatePicker as DatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, watch } from "vue"

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
const horariosEvento = ref<{ dia: Date; inicio: string; fim: string }[]>([])

const organizadores = ref<string[]>([""])
const novaCategoria = ref("") 

const nomeEvento = ref("");
const imagem = ref<File | null>(null);
const descricao = ref("");
const link = ref("");

function toggleCategorias() {
  categoriasAbertas.value = !categoriasAbertas.value
}


function selecionarCategoria(nome: string) {
  if (categoriasSelecionadas.value.length >= 2) return // LIMITA A 2

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
  novaCategoria.value = ""
}


function removerCategoria(nome: string) {
  categoriasSelecionadas.value = categoriasSelecionadas.value.filter((cat) => cat !== nome)
}

const datasEvento = ref<Date[]>([])

// Período de inscrições 
const dataInicioInscricao = ref<Date | null>(null)
const dataFimInscricao = ref<Date | null>(null)


function removerDiaEvento(dia: Date) {
  datasEvento.value = datasEvento.value.filter(
    d => d.getTime() !== dia.getTime()
  )
}

function adicionarOrganizador() {
  organizadores.value.push("")
}

function removerOrganizador(index: number) {
  organizadores.value.splice(index, 1)
}
// validar inputs

const erros = ref<string[]>([])

function validarFormulario() {
  erros.value = []

  if (!nomeEvento.value.trim()) erros.value.push("O nome do evento é obrigatório.")
  if (!imagem.value) erros.value.push("A imagem é obrigatória.")
  if (categoriasSelecionadas.value.length === 0) erros.value.push("Selecione ao menos 1 categoria.")
  if (datasEvento.value.length === 0) erros.value.push("Selecione pelo menos 1 dia de evento.")
  if (!dataInicioInscricao.value) erros.value.push("Data de início das inscrições é obrigatória.")
  if (!dataFimInscricao.value) erros.value.push("Data final das inscrições é obrigatória.")
 

  return erros.value.length === 0
}

function enviarFormulario() {
  if (!validarFormulario()) {
    console.log("ERROS:", erros.value)
    return
  }

  const dados = {
    nomeEvento: nomeEvento.value,
    imagem: imagem.value,
    categorias: categoriasSelecionadas.value,
    descricao: descricao.value,
    link: link.value,
    datasEvento: horariosEvento.value,
    organizadores: organizadores.value.filter(o => o.trim() !== ""),
    inscricao: {
      dataInicio: dataInicioInscricao.value,
      dataFim: dataFimInscricao.value,
    
    }
  }
  
  console.log("ENVIADO COM SUCESSO:", dados)

}

watch(datasEvento, (novasDatas) => {
  horariosEvento.value = novasDatas.map((d) => {
    const existente = horariosEvento.value.find(
      (h) => h.dia.getTime() === d.getTime()
    )
    return existente || { dia: d, inicio: "", fim: "" }
  })
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
        <h2>2. Data e Horário do Evento</h2>

        <div class="form-group">
          <label>Selecione o período do evento</label>

          <div class="form-group">
            <DatePicker
              v-model="datasEvento"
              multi-dates
              :enable-time-picker="false"
              :clearable="true"
              placeholder="Selecione os dias do evento"
            />
            <div class="lista-dias-container">
              <div
                class="dia-item"
                v-for="(item, idx) in horariosEvento"
                :key="idx"
              >
               <button class="remove-day" @click="removerDiaEvento(item.dia)">✖</button>

                <span class="dia-label">{{ item.dia.toLocaleDateString("pt-BR") }}</span>

                <input
                  type="time"
                  v-model="item.inicio"
                  class="time-input"
                  placeholder="Início"
                required/>
                <input
                  type="time"
                  v-model="item.fim"
                  class="time-input"
                  placeholder="Fim"
                required/>
              </div>
            </div>
          </div>
        </div>
      </section>

     <section class="form-section">
        <h2>2.1 Período de Inscrições</h2>

        <div class="form-group">
          <label>Data de início *</label>
          <DatePicker
            v-model="dataInicioInscricao"
            :enable-time-picker="false"
            placeholder="Selecione o dia de início"
          />
        </div>

        <div class="form-group">
          <label>Data de fim *</label>
          <DatePicker
            v-model="dataFimInscricao"
            :enable-time-picker="false"
            placeholder="Selecione o dia final"
          />
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
         <div v-if="erros.length" class="erros-box">
          <p v-for="err in erros" :key="err" class="erro-item">{{ err }}</p>
        </div>
      <div class="submit-container">
         <button class="submit-btn" @click="enviarFormulario">Confirmar</button>
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
.lista-dias-container {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 12px 20px;
  width: 100%;
}

.remove-day {
  border: none;
  color: #900;
  background-color: rgb(252, 232, 232);
  font-weight: bold;
  border-radius: 15px;
  padding: 4px 7px;
  cursor: pointer;
  transition: 0.2s;
}

.remove-day:hover {
  color: #ff8080;
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
.erros-box {
  
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.erro-item {
  color: #b33f3f;
  font-weight: 600;
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
