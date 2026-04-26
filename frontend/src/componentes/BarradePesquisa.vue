<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

import type { EventRecord } from '@/types/event'
import { formatDate } from '@/utils/date'

const props = defineProps<{
  eventos: EventRecord[]
  compact?: boolean
}>()

const emit = defineEmits<{
  select: [event: EventRecord]
}>()

const busca = ref('')
const categoriaSelecionada = ref('Todas')
const mostrarCategorias = ref(false)

const inputRef = ref<HTMLInputElement | null>(null)
const filterWrapperRef = ref<HTMLElement | null>(null)

const categorias = computed(() => {
  const allCategories = props.eventos.flatMap((event) => event.categorias)
  return ['Todas', ...new Set(allCategories)]
})

const eventosFiltrados = computed(() => {
  const term = busca.value.trim().toLowerCase()
  if (!term) return []

  return props.eventos
    .filter((event) => {
      const matchesSearch =
        event.titulo.toLowerCase().includes(term) ||
        event.local.toLowerCase().includes(term) ||
        event.categorias.some((category) => category.toLowerCase().includes(term))

      const matchesCategory =
        categoriaSelecionada.value === 'Todas' ||
        event.categorias.includes(categoriaSelecionada.value)

      return matchesSearch && matchesCategory
    })
    .slice(0, 6)
})

watch(busca, (value) => {
  if (!value.trim()) {
    mostrarCategorias.value = false
  }
})

function selecionarCategoria(category: string) {
  categoriaSelecionada.value = category
  mostrarCategorias.value = false
  inputRef.value?.focus()
}

function limparBusca() {
  busca.value = ''
  inputRef.value?.focus()
}

function handleClickOutside(event: MouseEvent) {
  if (
    filterWrapperRef.value &&
    !filterWrapperRef.value.contains(event.target as Node)
  ) {
    mostrarCategorias.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="search-shell" :class="{ compact: props.compact }">
    
    <div class="search-bar-unified">
      <img src="@/assets/lupa.png" alt="" class="icon" aria-hidden="true" />
      
      <input
        ref="inputRef"
        v-model="busca"
        type="text"
        class="input-field"
        placeholder="Pesquisar por nome, local ou categoria"
        aria-label="Buscar eventos"
      />
      
      <button 
        v-show="busca.length > 0" 
        class="clear-btn" 
        @click="limparBusca"
        aria-label="Limpar busca"
      >
        &times;
      </button>

      <div class="divider"></div>

      <div class="filter-wrapper" ref="filterWrapperRef">
        <button 
          type="button" 
          class="filter-button-inline" 
          :aria-expanded="mostrarCategorias"
          aria-haspopup="listbox"
          @click="mostrarCategorias = !mostrarCategorias"
        >
          <span class="category-label">{{ categoriaSelecionada }}</span>
          <img src="@/assets/filtro.png" alt="" class="icon-small" aria-hidden="true" />
        </button>

        <Transition name="fade-slide">
          <div v-if="mostrarCategorias" class="filter-dropdown" role="listbox">
            <button
              v-for="category in categorias"
              :key="category"
              type="button"
              class="filter-option"
              :class="{ active: category === categoriaSelecionada }"
              role="option"
              :aria-selected="category === categoriaSelecionada"
              @click="selecionarCategoria(category)"
            >
              {{ category }}
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="busca.trim() !== ''" class="search-results-container">
        <div v-if="eventosFiltrados.length > 0" class="search-results">
          <button
            v-for="event in eventosFiltrados"
            :key="event.id"
            type="button"
            class="result-card"
            @click="emit('select', event)"
          >
            <strong>{{ event.titulo }}</strong>
            <span>{{ event.local }}</span>
            <small>{{ formatDate(event.dataEventoInicio) }}</small>
          </button>
        </div>

        <div v-else class="empty-state">
          Nenhum evento encontrado para "{{ busca }}".
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.search-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 500px; /* ⬅️ AQUI ESTÁ A MÁGICA! Limita o tamanho máximo da barra */
  z-index: 2;
}

/* Estrutura da barra de pesquisa */
.search-bar-unified {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid rgba(7, 117, 62, 0.15);
  border-radius: 999px;
  padding: 6px 14px; /* Mais compacta */
  box-shadow: 0 4px 12px rgba(2, 64, 46, 0.05); /* Sombra mais sutil */
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  width: 100%;
}

.search-bar-unified:focus-within {
  box-shadow: 0 6px 16px rgba(7, 117, 62, 0.12);
  border-color: rgba(7, 117, 62, 0.3);
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #0a4635;
  font: inherit;
  font-size: 0.9rem; /* Fonte um pouco menor */
  width: 100%;
  min-width: 0; 
}

.input-field::placeholder {
  color: rgba(10, 70, 53, 0.5);
}

.clear-btn {
  background: transparent;
  border: none;
  color: #0a4635;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.5;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  opacity: 1;
}

/* Divisor entre o input e o botão de filtro */
.divider {
  width: 1px;
  height: 20px;
  background: rgba(7, 117, 62, 0.2);
  margin: 0 2px;
}

.filter-wrapper {
  position: relative;
  flex-shrink: 0;
}

.filter-button-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #07753e;
  font-weight: 600;
  font-size: 0.85rem; /* Fonte menor para combinar com a barra */
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 999px;
  transition: background 0.2s;
}

.filter-button-inline:hover {
  background: rgba(7, 117, 62, 0.08);
}

.category-label {
  max-width: 100px; /* Limite menor para não esticar a barra */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  padding: 8px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(2, 64, 46, 0.12);
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.filter-option {
  border: none;
  background: transparent;
  color: #0b513f;
  text-align: left;
  padding: 8px 12px;
  border-radius: 8px;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-option.active,
.filter-option:hover {
  background: rgba(138, 238, 195, 0.3);
}

/* Resultados da Busca - Flutuantes */
.search-results-container {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(2, 64, 46, 0.15);
  overflow: hidden;
  z-index: 5;
}

.search-results {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
  gap: 4px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #0a4635;
  font-weight: 500;
  font-size: 0.9rem;
}

.result-card {
  border: none;
  text-align: left;
  background: transparent;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  color: #0a4635;
  transition: background 0.2s;
}

.result-card:hover {
  background: rgba(7, 117, 62, 0.05);
}

.result-card strong {
  font-size: 0.9rem;
}

.result-card span,
.result-card small {
  font-size: 0.8rem;
  color: rgba(10, 70, 53, 0.74);
}

.icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.icon-small {
  width: 12px;
  height: 12px;
}

/* Animações */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Responsividade extra para celulares */
@media (max-width: 600px) {
  .search-shell {
    max-width: 100%; /* No celular, ela volta a ocupar 100% da linha para facilitar o toque */
  }
}
</style>