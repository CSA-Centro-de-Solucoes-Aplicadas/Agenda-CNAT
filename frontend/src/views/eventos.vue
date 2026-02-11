<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import logoImg from '@/assets/logo.svg'
import logoFooter from '@/assets/logoFooter.png'
import logoIfrn from '@/assets/ifrn.png'
import XImg from '@/assets/x.png'
import instagramImg from '@/assets/instagram.png'
import youtubeImg from '@/assets/youtube.png'
import BarradePesquisa from '@/componentes/BarradePesquisa.vue'
import { VueDatePicker as DatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import {
  fetchEventos,
  deleteEvento as apiDeleteEvento,
  updateEvento,
  uploadMedia,
  type PayloadEvento,
} from '@/services/api'

const isAdmin = ref(true)

const eventos = ref<PayloadEvento[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetchEventos()
    eventos.value = res.docs
  } catch (err) {
    console.error('Erro ao carregar eventos:', err)
  } finally {
    loading.value = false
  }
})

// ── Modal de edição ────────────────────────────
const modalAberto = ref(false)
const salvando = ref(false)

// Campos do formulário de edição
const editId = ref<number | null>(null)
const editTitulo = ref('')
const editDescricao = ref('')
const editLocal = ref('')
const editLink = ref('')
const editDataEventoInicio = ref<Date | null>(null)
const editDataEventoFinal = ref<Date | null>(null)
const editDataInscricaoInicio = ref<Date | null>(null)
const editDataInscricaoFinal = ref<Date | null>(null)
const editImagem = ref<File | null>(null)
const editOrganizadores = ref<string[]>([''])
const editCategorias = ref<string[]>([])
const editCategoriasAbertas = ref(false)
const editNovaCategoria = ref('')

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

function toggleEditCategorias() {
  editCategoriasAbertas.value = !editCategoriasAbertas.value
}

function selecionarEditCategoria(nome: string) {
  if (editCategorias.value.length >= 2) return
  if (!editCategorias.value.includes(nome)) {
    editCategorias.value.push(nome)
  }
}

function adicionarEditCategoriaManual() {
  const nome = editNovaCategoria.value.trim()
  if (!nome || editCategorias.value.length >= 2 || editCategorias.value.includes(nome)) return
  editCategorias.value.push(nome)
  editNovaCategoria.value = ''
}

function removerEditCategoria(nome: string) {
  editCategorias.value = editCategorias.value.filter((c) => c !== nome)
}

function adicionarEditOrganizador() {
  editOrganizadores.value.push('')
}

function removerEditOrganizador(index: number) {
  editOrganizadores.value.splice(index, 1)
}

function abrirEdicao(evento: PayloadEvento) {
  editId.value = evento.id
  editTitulo.value = evento.titulo || ''
  editDescricao.value = evento.descricao || ''
  editLocal.value = evento.local || ''
  editLink.value = evento.link || ''
  editDataEventoInicio.value = evento.dataEventoInicio ? new Date(evento.dataEventoInicio) : null
  editDataEventoFinal.value = evento.dataEventoFinal ? new Date(evento.dataEventoFinal) : null
  editDataInscricaoInicio.value = evento.dataInscricaoInicio ? new Date(evento.dataInscricaoInicio) : null
  editDataInscricaoFinal.value = evento.dataInscricaoFinal ? new Date(evento.dataInscricaoFinal) : null
  editImagem.value = null
  editOrganizadores.value = evento.organizadores?.length
    ? evento.organizadores.map((o) => o.email || '')
    : ['']
  editCategorias.value = evento.categorias?.map((c) => c.nome || '').filter(Boolean) || []
  editCategoriasAbertas.value = false
  editNovaCategoria.value = ''
  modalAberto.value = true
}

async function salvarEdicao() {
  if (!editId.value || salvando.value) return
  salvando.value = true

  try {
    let imagemId: number | undefined
    if (editImagem.value) {
      const media = await uploadMedia(editImagem.value, editTitulo.value)
      imagemId = media.id
    }

    const body: Record<string, unknown> = {
      titulo: editTitulo.value,
      descricao: editDescricao.value,
      local: editLocal.value,
      link: editLink.value,
      dataEventoInicio: editDataEventoInicio.value?.toISOString() || null,
      dataEventoFinal: editDataEventoFinal.value?.toISOString() || null,
      dataInscricaoInicio: editDataInscricaoInicio.value?.toISOString() || null,
      dataInscricaoFinal: editDataInscricaoFinal.value?.toISOString() || null,
      categorias: editCategorias.value.map((nome) => ({ nome })),
      organizadores: editOrganizadores.value.filter((e) => e.trim()).map((email) => ({ email })),
    }

    if (imagemId) body.imagem = imagemId

    const updated = await updateEvento(editId.value, body)

    const index = eventos.value.findIndex((e) => e.id === editId.value)
    if (index !== -1) eventos.value[index] = updated

    modalAberto.value = false
  } catch (err) {
    console.error('Erro ao salvar evento:', err)
    alert('Erro ao salvar evento. Verifique o console.')
  } finally {
    salvando.value = false
  }
}

async function excluirEvento(id: number) {
  const confirmar = confirm('Tem certeza que deseja excluir este evento?')
  if (!confirmar) return

  try {
    await apiDeleteEvento(id)
    eventos.value = eventos.value.filter((evento) => evento.id !== id)
  } catch (err) {
    console.error('Erro ao excluir evento:', err)
    alert('Erro ao excluir evento.')
  }
}

function formatarData(iso?: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
</script>

<template>
  <div class="page">
    <header class="main-header">
      <RouterLink to="/" class="header-logo-container">
        <img :src="logoImg" alt="Logo Eventos CNAT" class="header-logo" />
      </RouterLink>

      <div v-if="isAdmin" class="header-inner">
        <ul>
          <li>
            <RouterLink to="/cadastro"> Cadastrar eventos </RouterLink>
          </li>
          <li>
            <RouterLink to="/eventos"> Editar eventos </RouterLink>
          </li>
        </ul>
      </div>

      <!-- HEADER PÚBLICO -->
      <div v-else class="header-inner">
        <ul>
          <li><RouterLink to="/#programacao">Programação</RouterLink></li>
          <li><RouterLink to="/#adicionar-evento">Adicionar Evento</RouterLink></li>
          <li><RouterLink to="/#inscricoes">Inscrições Abertas</RouterLink></li>
        </ul>
      </div>
    </header>

    <main class="main-content">
      <BarradePesquisa />
      <section class="eventos-wrapper">
        <h2>Visualização dos eventos</h2>

        <p v-if="loading" class="loading-text">Carregando eventos...</p>

        <div class="eventos-list" v-else>
          <div
            class="evento-linha"
            v-for="evento in eventos"
            :key="evento.id"
            @click="abrirEdicao(evento)"
          >
            <div class="evento-titulo">
              {{ evento.titulo }}
            </div>

            <div class="evento-data">
              {{ formatarData(evento.dataEventoInicio) }}
              <template v-if="evento.dataEventoFinal">
                — {{ formatarData(evento.dataEventoFinal) }}
              </template>
            </div>

            <div class="evento-local">
              {{ evento.local || '—' }}
            </div>
            <button v-if="isAdmin" class="evento-acao" @click.stop="excluirEvento(evento.id)" title="Excluir evento">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>

          <p v-if="eventos.length === 0">Nenhum evento encontrado.</p>
        </div>
      </section>
    </main>

    <!-- ── Modal de Edição Completo ── -->
    <div v-if="modalAberto" class="modal-backdrop" @click.self="modalAberto = false">
      <div class="modal-edit">
        <button class="modal-close" @click="modalAberto = false">✕</button>
        <h3>Editar Evento</h3>

        <div class="modal-scroll">
          <!-- Seção 1 -->
          <section class="form-section">
            <h4>1. Informações do Evento</h4>

            <div class="form-group">
              <label>Nome do Evento *</label>
              <input type="text" v-model="editTitulo" required />
            </div>

            <div class="form-group">
              <label>Imagem de divulgação (substituir)</label>
              <input type="file" accept="image/*" @change="(e: Event) => editImagem = (e.target as HTMLInputElement).files?.[0] || null" />
            </div>

            <div class="form-group">
              <div class="cat-header">
                <span class="cat-label">Categorias</span>
                <button type="button" class="cat-icon-btn" @click="toggleEditCategorias">
                  <span class="arrow">⌄</span>
                </button>
              </div>

              <div v-if="editCategoriasAbertas" class="cat-dropdown">
                <input
                  type="text"
                  v-model="editNovaCategoria"
                  placeholder="Adicionar categoria..."
                  class="cat-input"
                  @keyup.enter="adicionarEditCategoriaManual"
                  :disabled="editCategorias.length >= 2"
                />
                <div
                  class="cat-option"
                  v-for="cat in todasCategorias"
                  :key="cat"
                  @click="selecionarEditCategoria(cat)"
                  :class="{ disabled: editCategorias.length >= 2 }"
                >
                  {{ cat }}
                </div>
              </div>

              <div class="cat-tags">
                <span v-for="cat in editCategorias" :key="cat" class="tag">
                  {{ cat }}
                  <button class="remove-tag" @click="removerEditCategoria(cat)">✖</button>
                </span>
              </div>
            </div>

            <div class="form-group">
              <label>Descrição</label>
              <textarea v-model="editDescricao" rows="3"></textarea>
            </div>

            <div class="form-group">
              <label>Link para mais informações</label>
              <input type="url" v-model="editLink" />
            </div>
          </section>

          <!-- Seção 2 -->
          <section class="form-section">
            <h4>2. Data e Horário do Evento</h4>

            <div class="form-group">
              <label>Data de início *</label>
              <DatePicker
                v-model="editDataEventoInicio"
                :enable-time-picker="true"
                placeholder="Selecione o dia e horário de início"
              />
            </div>

            <div class="form-group">
              <label>Data de fim *</label>
              <DatePicker
                v-model="editDataEventoFinal"
                :enable-time-picker="false"
                placeholder="Selecione o dia e horário final"
              />
            </div>
          </section>

          <!-- Seção 2.1 -->
          <section class="form-section">
            <h4>2.1 Período de Inscrições</h4>

            <div class="form-group">
              <label>Data de início</label>
              <DatePicker
                v-model="editDataInscricaoInicio"
                :enable-time-picker="true"
                placeholder="Selecione o dia e horário de início"
              />
            </div>

            <div class="form-group">
              <label>Data de fim</label>
              <DatePicker
                v-model="editDataInscricaoFinal"
                :enable-time-picker="false"
                placeholder="Selecione o dia e horário final"
              />
            </div>
          </section>

          <!-- Seção 3 -->
          <section class="form-section">
            <h4>3. Organizadores</h4>
            <div class="organizadores-section">
              <div
                v-for="(email, index) in editOrganizadores"
                :key="index"
                class="organizador-field"
              >
                <input
                  type="email"
                  v-model="editOrganizadores[index]"
                  placeholder="Email do organizador"
                />
                <button
                  v-if="editOrganizadores.length > 1"
                  @click="removerEditOrganizador(index)"
                  class="remove-field"
                >
                  ✖
                </button>
              </div>
              <button @click="adicionarEditOrganizador" class="add-field">
                + Adicionar organizador
              </button>
            </div>
          </section>
        </div>

        <div class="modal-actions">
          <button @click="modalAberto = false" class="btn-cancelar">Cancelar</button>
          <button class="btn-salvar" @click="salvarEdicao" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>

    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <img :src="logoFooter" alt="Eventos CNAT" class="footer-logo" />
          <img :src="logoIfrn" alt="Logo do IFRN" class="logo-if" />
        </div>

        <div class="footer-right">
          <div class="social">
            <a href="https://www.instagram.com/ifrncnat">
              <img :src="instagramImg" alt="Instagram" />
            </a>
            <a href="https://x.com/IFRNCNAT">
              <img :src="XImg" alt="X" />
            </a>
            <a href="https://www.youtube.com/ifrncnat">
              <img :src="youtubeImg" alt="YouTube" />
            </a>
          </div>

          <p>seac.cnat@ifrn.edu.br</p>

          <address>
            Av. Sen. Salgado Filho, 1559 – Tirol, Natal – RN<br />
            <strong>CEP:</strong> 59015-000
          </address>
        </div>
      </div>

      <div class="copy">
        <a href="https://csa.cnat.ifrn.edu.br/">
          © 2025 - Centro de Soluções Aplicadas. Todos os direitos reservados.
        </a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  width: 100%;
  background-color: #8aeec3;
  box-shadow: 2px 1px 5px #b8b8b8;
  position: relative;

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
.admin-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #c0392b;
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
}
.barra-pesquisa {
  display: flex;
  margin: auto;
  width: 100%;
  display: block;
}
.main-content {
  flex: 1;
  background: #f4f4f4;
  padding: 2rem 0;
}

.eventos-wrapper {
  max-width: 1200px;

  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem 2rem;
}

.eventos-wrapper h2 {
  color: #0b5c4b;
  margin-bottom: 1rem;
}

/* SEARCH */
.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
}

.filter-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #e5e5e5;
  cursor: pointer;
}

/* LISTA */
.eventos-list {
  max-height: 85vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* LINHA DO EVENTO */
.evento-linha {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0.4rem;
  margin-bottom: 0.5rem;
}

/* FAIXA VERDE */
.evento-titulo {
  background: #4caf84;
  color: #fff;
  padding: 0.45rem 0.8rem;
  border-radius: 6px;
  min-width: 260px;
  max-width: 260px;
  font-size: 0.8rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* DATA E LOCAL */
.evento-data,
.evento-local {
  font-size: 0.75rem;
  color: #333;
  white-space: nowrap;
}

/* BOTÃO DE EXCLUSÃO */
.evento-acao {
  margin-left: auto;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #c0392b;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.evento-acao:hover {
  background: #fde8e8;
  color: #922020;
}

.evento-acao svg {
  width: 22px;
  height: 22px;
}

/* SCROLL */
.eventos-list::-webkit-scrollbar {
  width: 6px;
}
.eventos-list::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 10px;
}

/* TAG VERDE */
.evento-tag {
  background: #4caf84;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* TEXTO */
.evento-data,
.evento-local {
  font-size: 0.8rem;
  color: #333;
}

.evento-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
}

.eventos-list::-webkit-scrollbar {
  width: 6px;
}

.eventos-list::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 10px;
}
.loading-text {
  text-align: center;
  color: #888;
  padding: 2rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-edit {
  background: #f4f4f4;
  width: 680px;
  max-width: 95vw;
  max-height: 90vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.modal-edit > h3 {
  padding: 20px 24px 0;
  color: #0a4635;
  font-size: 1.4rem;
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #e8e8e8;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-close:hover {
  background: #d0d0d0;
}

.modal-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-edit .form-section {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px #0001;
}

.modal-edit .form-section h4 {
  margin-bottom: 14px;
  color: #1b473a;
  font-size: 1rem;
}

.modal-edit .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.modal-edit .form-group label {
  font-size: 0.85rem;
  margin-bottom: 4px;
  font-weight: 500;
}

.modal-edit .form-group input,
.modal-edit .form-group textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.modal-edit .form-group textarea {
  resize: vertical;
}

/* Categorias no modal */
.modal-edit .cat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.modal-edit .cat-label {
  font-size: 0.95rem;
  font-weight: 600;
}

.modal-edit .cat-icon-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f3f3;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  cursor: pointer;
}

.modal-edit .arrow {
  font-size: 22px;
  color: #444;
  font-weight: bold;
  transform: translateY(-5px);
}

.modal-edit .cat-dropdown {
  margin-top: 4px;
  background: white;
  border: 1px solid #b6e8d2;
  border-radius: 8px;
  box-shadow: 0 2px 6px #0002;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 250px;
}

.modal-edit .cat-option {
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.modal-edit .cat-option:hover {
  background: #d8f7ea;
}

.modal-edit .cat-input {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.modal-edit .disabled {
  opacity: 0.4;
  pointer-events: none;
}

.modal-edit .cat-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.modal-edit .tag {
  background: #c8f5de;
  padding: 5px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.modal-edit .remove-tag {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #0a8f5a;
}

.modal-edit .remove-tag:hover {
  color: red;
}

/* Organizadores no modal */
.modal-edit .organizadores-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
}

.modal-edit .organizador-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-edit .organizador-field input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.85rem;
}

.modal-edit .remove-field {
  background: #ffe5e5;
  border: 1px solid #ffb3b3;
  color: #a00;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}

.modal-edit .remove-field:hover {
  background: #ffd2d2;
  color: #700;
}

.modal-edit .add-field {
  align-self: flex-start;
  background: #c8f5de;
  border: 1px solid #9bd9b9;
  padding: 6px 14px;
  border-radius: 8px;
  color: #0b5c3e;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
}

.modal-edit .add-field:hover {
  background: #b2f0d1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 14px 24px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancelar {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-cancelar:hover {
  background: #f0f0f0;
}

.btn-salvar {
  background: #4caf84;
  border: none;
  padding: 8px 22px;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
}

.btn-salvar:hover {
  background: #3d9970;
}

.btn-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
.copy a {
  color: inherit;
  text-decoration: none;
}
.copy p {
  color: #ffffff;
}

/* Space before footer */
main section:last-child {
  margin-bottom: 6rem;
}

@media (max-width: 1024px) {
  .header-logo {
    top: 20px;
    left: 30px;
    max-width: 130px;
  }
}
@media (max-width: 900px) {
  .header-container {
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
    gap: 20px;
  }

  header ul {
    display: none;
  }

  header li a {
    font-size: 1rem;
  }

  .header-logo-container {
    justify-content: left;
  }

  .header-logo {
    width: 120px;
  }
}

@media (max-width: 750px) {
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

  h3 {
    font-size: 20px;
    text-align: left;
  }

  .footer-content {
    flex-direction: column;
    align-items: left;
    text-align: left;
  }
  .footer-right {
    text-align: left;
    align-items: left;
    margin-top: 20px;
  }
  .social {
    justify-content: left;
  }
}
</style>
