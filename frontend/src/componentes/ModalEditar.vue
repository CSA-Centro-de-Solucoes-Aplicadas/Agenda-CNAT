<script setup lang="ts">
import { ref, computed } from 'vue' 
import { VueDatePicker as DatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
const emit = defineEmits(['close'])

interface Evento {
  id: number
  titulo: string
  local: string
  descricao: string
  imagem: string
  organizadores?: string[]
  dataInscricaoInicio?: string
  dataInscricaoFim?: string
  dataEventoInicio: string
  dataEventoFim: string
  categorias: string[]
  linkInscricao?: string
}
// formatar datas
const separarDataHora = (dataISO?: string) => {
  if (!dataISO) return { data: '--/--/--', hora: '--:--' }

  const dataObj = new Date(dataISO)
  const dataFormatada = dataObj.toLocaleDateString('pt-BR')
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return { data: dataFormatada, hora: horaFormatada }
}

// funções para organizadores
function adicionarOrganizador() {
  organizadores.value.push('')
}

function removerOrganizador(index: number) {
  organizadores.value.splice(index, 1)
}

// atributos
const titulo = ref('')
const imagem = ref<File | null>(null)
const descricao = ref('')
const linkInformacao = ref('')
const dataInicioEvento = ref<Date | null>(null)
const dataFimEvento = ref<Date | null>(null)
const dataInicioInscricao = ref<Date | null>(null)
const dataFimInscricao = ref<Date | null>(null)
const organizadores = ref<string[]>([''])

const props = defineProps<{
  eventoSelecionado: Evento
}>()
</script>
<template>
    <div class="form-container">
        <h2>Informações do Evento</h2>
        <div class="form-group">
          <label>Nome do Evento*</label>
          <input type="text" required />
        </div>

        <div class="form-group">
          <label>Imagem de divulgação*</label>
          <input type="file" required />
        </div>

        <!-- por enquanto categorias ta comentado, atualizar dps do commit de geovanna -->
        <!-- <div class="form-group">
          <div class="cat-header">
            <span class="cat-label">Categorias</span>
            <button type="button" class="cat-icon-btn" @click="toggleCategorias">
              <span class="arrow">⌄</span>
            </button>
          </div>

          <div v-if="categoriasAbertas" class="cat-dropdown">
            <input 
              type="text" 
              v-model="novaCategoria" 
              placeholder="Adicionar categoria..." 
              class="cat-input" 
              @keyup.enter="adicionarCategoriaManual" 
              :disabled="categoriasSelecionadas.length >= 2" 
              required 
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
        </div> -->

        <div class="form-group">
          <label>Descrição</label>
          <textarea required></textarea>
        </div>

        <div class="form-group">
          <label>Link para mais informações</label>
          <input type="url" />
        </div>

        <h2>Datas e Inscrições</h2>
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
        
        <h2>Organizadores</h2>
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
    </div>
</template>
<style scoped>
.form-container {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
  width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px #0003;
  display: flex;
  flex-direction: column;
  gap: 20px;

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
</style>