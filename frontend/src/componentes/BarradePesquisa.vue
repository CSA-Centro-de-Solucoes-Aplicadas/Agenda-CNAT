<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Evento {
  titulo: string
  categoria: string
}

const eventos = ref<Evento[]>([
  { titulo: 'Arraiá Junino', categoria: 'Cultura' },
  { titulo: 'Winfo', categoria: 'Tecnologia' },
  { titulo: 'Wtads', categoria: 'Tecnologia' },
  { titulo: 'Jogos Internos', categoria: 'Esporte' },
])

const busca = ref('')
const categoriaSelecionada = ref('Todas')
const mostrarLista = ref(false)
const mostrarCategorias = ref(false)

const categorias = computed(() => {
  const unicas = new Set(eventos.value.map((e) => e.categoria))
  return ['Todas', ...unicas]
})

const eventosFiltrados = computed(() => {
  if (!busca.value) return []

  return eventos.value.filter((evento) => {
    const tituloOk = evento.titulo.toLowerCase().includes(busca.value.toLowerCase())

    const categoriaOk =
      categoriaSelecionada.value === 'Todas' || evento.categoria === categoriaSelecionada.value

    return tituloOk && categoriaOk
  })
})

watch(busca, (valor) => {
  mostrarLista.value = valor.length > 0
})

function selecionarCategoria(cat: string) {
  categoriaSelecionada.value = cat
  mostrarCategorias.value = false
}

const inputRef = ref<HTMLInputElement | null>(null)

function focarBusca() {
  inputRef.value?.focus()
}
</script>

<template>
  <div class="barra-pesquisa">
    <div class="campo">
      <img src="@/assets/lupa.png" alt="Buscar" class="icone" @click="focarBusca" />
      <input ref="inputRef" type="text" placeholder="Pesquisar por evento" v-model="busca" />
      <!-- botão filtro -->
      <div class="filtro-wrapper">
        <img
          src="@/assets/filtro.png"
          alt="Categorias"
          class="icone"
          @click="mostrarCategorias = !mostrarCategorias"
        />
        <div v-if="mostrarCategorias" class="dropdown-categorias">
          <div
            v-for="cat in categorias"
            :key="cat"
            class="categoria-item"
            :class="{ ativa: cat === categoriaSelecionada }"
            @click="selecionarCategoria(cat)"
          >
            {{ cat }}
          </div>
        </div>
      </div>
    </div>

    <!-- lista de eventos -->
    <div v-if="mostrarLista && eventosFiltrados.length" class="lista">
      <div v-for="evento in eventosFiltrados" :key="evento.titulo" class="item">
        <strong>{{ evento.titulo }}</strong>
        <small>{{ evento.categoria }}</small>
      </div>
    </div>

    <p v-if="mostrarLista && !eventosFiltrados.length" class="vazio">Nenhum evento encontrado</p>
  </div>
</template>

<style scoped>
.barra-pesquisa {
  width: 100%;
  max-width: 620px;
  padding: 50px 20px;
  position: relative;
  font-family: 'Inter', sans-serif;
}

.campo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 25px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  text-align: center;
}

.icone {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Categorias como uma aba discreta, minimalista */
.dropdown-categorias {
  margin-top: 6px;
  display: flex;
  flex-direction: column; /* uma embaixo da outra */
  gap: 4px; /* espaço mínimo entre categorias */
}

/* wrapper do filtro para posicionar o dropdown lateral */
.filtro-wrapper {
  position: relative; /* dropdown fica relativo ao ícone */
  display: inline-block;
}

/* dropdown flutuante */
.dropdown-categorias {
  position: absolute;
  top: 24px; /* logo abaixo do ícone */
  right: 0;
  min-width: 100px; /* largura pequena */
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 6px 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.categoria-item {
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  background: transparent;
  color: #333;
  text-align: left;
  transition: all 0.2s;
}

.categoria-item:hover {
  background: #f0f0f0;
}

.categoria-item.ativa {
  background: #137333;
  color: #fff;
}

/* Lista de eventos também sem position absolute */
.lista {
  margin-top: 8px; /* distância do input */
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  max-height: 200px;
  overflow-y: auto;
}

.item {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.item:hover {
  background: #f1f8f4;
}

.item small {
  font-size: 11px;
  color: #137333;
}

.vazio {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.6;
}
</style>
