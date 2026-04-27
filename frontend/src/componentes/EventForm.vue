<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import type { EventPayload, EventRecord } from '@/types/event'
import { toDateInputValue, toIsoString } from '@/utils/date'

interface FormState {
  titulo: string
  descricao: string
  local: string
  linkInformacao: string
  linkInscricao: string
  dataEventoInicio: string
  dataEventoFim: string
  dataInscricaoInicio: string
  dataInscricaoFim: string
  categorias: string[]
  organizadores: string[]
}

const props = withDefaults(
  defineProps<{
    initialValue?: EventRecord | null
    submitLabel?: string
    busy?: boolean
    categorySuggestions?: string[]
  }>(),
  {
    initialValue: null,
    submitLabel: 'Salvar evento',
    busy: false,
    categorySuggestions: () => [],
  },
)

const emit = defineEmits<{
  submit: [payload: EventPayload]
}>()

const previewUrl = ref<string | null>(props.initialValue?.imagem ?? null)
const imageFile = ref<File | null>(null)
const categoryInput = ref('')
const organizerInput = ref('')
const errors = ref<string[]>([])

const form = reactive<FormState>({
  titulo: '',
  descricao: '',
  local: '',
  linkInformacao: '',
  linkInscricao: '',
  dataEventoInicio: '',
  dataEventoFim: '',
  dataInscricaoInicio: '',
  dataInscricaoFim: '',
  categorias: [],
  organizadores: [''],
})

function syncForm(event: EventRecord | null) {
  form.titulo = event?.titulo ?? ''
  form.descricao = event?.descricao ?? ''
  form.local = event?.local ?? ''
  form.linkInformacao = event?.linkInformacao ?? ''
  form.linkInscricao = event?.linkInscricao ?? ''
  form.dataEventoInicio = toDateInputValue(event?.dataEventoInicio) ?? ''
  form.dataEventoFim = toDateInputValue(event?.dataEventoFim) ?? ''
  form.dataInscricaoInicio = toDateInputValue(event?.dataInscricaoInicio) ?? ''
  form.dataInscricaoFim = toDateInputValue(event?.dataInscricaoFim) ?? ''
  form.categorias = [...(event?.categorias ?? [])]
  form.organizadores = event?.organizadores?.length ? [...event.organizadores] : ['']
  previewUrl.value = event?.imagem ?? null
  imageFile.value = null
  errors.value = []
}

watch(
  () => props.initialValue,
  (value) => syncForm(value),
  { immediate: true },
)

const availableCategories = computed(() => {
  const merged = [...props.categorySuggestions, ...form.categorias]
  return [...new Set(merged)].filter(Boolean)
})

function addCategory(value: string) {
  const normalized = value.trim()
  if (!normalized || form.categorias.includes(normalized)) return
  form.categorias.push(normalized)
  categoryInput.value = ''
}

function removeCategory(category: string) {
  form.categorias = form.categorias.filter((item) => item !== category)
}

function addOrganizer() {
  const normalized = organizerInput.value.trim()
  if (!normalized || form.organizadores.includes(normalized)) return
  form.organizadores = form.organizadores.filter(Boolean)
  form.organizadores.push(normalized)
  organizerInput.value = ''
}

function removeOrganizer(email: string) {
  form.organizadores = form.organizadores.filter((item) => item !== email)
  if (!form.organizadores.length) form.organizadores = ['']
}

function onImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  imageFile.value = file
  previewUrl.value = file ? URL.createObjectURL(file) : (props.initialValue?.imagem ?? null)
}

function validateForm() {
  const validationErrors: string[] = []

  if (!form.titulo.trim()) validationErrors.push('Informe o nome do evento.')
  if (!form.local.trim()) validationErrors.push('Informe o local do evento.')
  if (!form.descricao.trim()) validationErrors.push('Adicione uma descrição para o evento.')
  if (!form.dataEventoInicio || !form.dataEventoFim) {
    validationErrors.push('Preencha início e fim do evento.')
  }
  if (!form.categorias.length) validationErrors.push('Adicione ao menos uma categoria.')

  const eventStart = toIsoString(form.dataEventoInicio)
  const eventEnd = toIsoString(form.dataEventoFim)
  const registrationStart = toIsoString(form.dataInscricaoInicio)
  const registrationEnd = toIsoString(form.dataInscricaoFim)

  if (eventStart && eventEnd && new Date(eventEnd) < new Date(eventStart)) {
    validationErrors.push('A data final do evento deve ser posterior à inicial.')
  }

  if (
    registrationStart &&
    registrationEnd &&
    new Date(registrationEnd) < new Date(registrationStart)
  ) {
    validationErrors.push('A data final de inscrição deve ser posterior à inicial.')
  }

  if (registrationEnd && eventStart && new Date(registrationEnd) > new Date(eventStart)) {
    validationErrors.push('As inscrições devem terminar antes do início do evento.')
  }

  errors.value = validationErrors
  return validationErrors.length === 0
}

function handleSubmit() {
  console.log('1. Botão clicado! Iniciando validação...')

  if (!validateForm()) {
    console.log('2. Validação FALHOU! Revise os campos obrigatórios.')
    return
  }

  console.log('3. Validação passou! Emitindo evento para o componente pai...')
  if (!validateForm()) return

  emit('submit', {
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    local: form.local.trim(),
    categorias: form.categorias,
    organizadores: form.organizadores.map((item) => item.trim()).filter(Boolean),
    linkInformacao: form.linkInformacao.trim() || null,
    linkInscricao: form.linkInscricao.trim() || null,
    dataEventoInicio: toIsoString(form.dataEventoInicio)!,
    dataEventoFim: toIsoString(form.dataEventoFim)!,
    dataInscricaoInicio: toIsoString(form.dataInscricaoInicio),
    dataInscricaoFim: toIsoString(form.dataInscricaoFim),
    imagem: imageFile.value,
  })
}
</script>

<template>
  <form class="event-form" @submit.prevent="handleSubmit">
    <div v-if="errors.length" class="form-alert">
      <p>Revise os campos abaixo:</p>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>

    <section class="form-card form-card--hero">
      <div class="form-card__header">
        <div>
          <span class="eyebrow">Identidade do evento</span>
          <h2>Informações principais</h2>
        </div>
        <div class="image-preview" :class="{ 'is-empty': !previewUrl }">
          <img v-if="previewUrl" :src="previewUrl" alt="Prévia da imagem do evento" />
          <span v-else>Imagem de capa</span>
        </div>
      </div>

      <div class="form-grid">
        <label class="field field--wide">
          <span>Nome do evento</span>
          <input v-model="form.titulo" type="text" placeholder="Semana de Tecnologia do IFRN" />
        </label>

        <label class="field">
          <span>Local</span>
          <input v-model="form.local" type="text" placeholder="Campus Natal-Central" />
        </label>

        <label class="field">
          <span>Imagem de divulgação</span>
          <input type="file" accept="image/*" @change="onImageChange" />
        </label>

        <label class="field field--wide">
          <span>Descrição</span>
          <textarea
            v-model="form.descricao"
            rows="5"
            placeholder="Descreva o objetivo do evento, público e atividades."
          />
        </label>

        <label class="field">
          <span>Link com mais informações</span>
          <input v-model="form.linkInformacao" type="url" placeholder="https://..." />
        </label>

        <label class="field">
          <span>Link de inscrição</span>
          <input v-model="form.linkInscricao" type="url" placeholder="https://..." />
        </label>
      </div>
    </section>

    <section class="form-card">
      <div class="section-title">
        <span class="eyebrow">Agenda</span>
        <h2>Datas e inscrições</h2>
      </div>

      <div class="form-grid">
        <label class="field">
          <span>Início do evento</span>
          <input v-model="form.dataEventoInicio" type="datetime-local" />
        </label>

        <label class="field">
          <span>Fim do evento</span>
          <input v-model="form.dataEventoFim" type="datetime-local" />
        </label>

        <label class="field">
          <span>Início das inscrições</span>
          <input v-model="form.dataInscricaoInicio" type="datetime-local" />
        </label>

        <label class="field">
          <span>Fim das inscrições</span>
          <input v-model="form.dataInscricaoFim" type="datetime-local" />
        </label>
      </div>
    </section>

    <section class="form-card">
      <div class="section-title">
        <span class="eyebrow">Relacionamentos</span>
        <h2>Categorias e organização</h2>
      </div>

      <div class="meta-grid">
        <div class="meta-block">
          <label class="field">
            <span>Adicionar categoria</span>
            <div class="inline-input">
              <input
                v-model="categoryInput"
                list="category-suggestions"
                type="text"
                placeholder="Tecnologia"
                @keydown.enter.prevent="addCategory(categoryInput)"
              />
              <button type="button" class="inline-button" @click="addCategory(categoryInput)">
                Adicionar
              </button>
            </div>
          </label>

          <datalist id="category-suggestions">
            <option v-for="category in availableCategories" :key="category" :value="category" />
          </datalist>

          <div class="tag-list">
            <button
              v-for="category in form.categorias"
              :key="category"
              type="button"
              class="tag"
              @click="removeCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="meta-block">
          <label class="field">
            <span>Adicionar organizador</span>
            <div class="inline-input">
              <input
                v-model="organizerInput"
                type="email"
                placeholder="email@ifrn.edu.br"
                @keydown.enter.prevent="addOrganizer"
              />
              <button type="button" class="inline-button" @click="addOrganizer">Adicionar</button>
            </div>
          </label>

          <div class="tag-list">
            <button
              v-for="organizer in form.organizadores.filter(Boolean)"
              :key="organizer"
              type="button"
              class="tag tag--soft"
              @click="removeOrganizer(organizer)"
            >
              {{ organizer }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="form-actions">
      <button class="submit-button" type="submit" :disabled="busy">
        {{ busy ? 'Salvando...' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.event-form {
  display: grid;
  gap: 24px;
}

.form-alert {
  border: 1px solid rgba(140, 36, 36, 0.18);
  background: rgba(255, 241, 241, 0.92);
  color: #6e2a2a;
  border-radius: 20px;
  padding: 18px 20px;
}

.form-alert ul {
  margin: 8px 0 0 18px;
}

.form-card {
  background: #ffffff;
  border: 1px solid rgba(7, 117, 62, 0.08);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 14px 35px rgba(2, 64, 46, 0.08);
}

.form-card--hero {
  background: linear-gradient(135deg, rgba(138, 238, 195, 0.2), rgba(255, 255, 255, 0.95)), #ffffff;
}

.form-card__header,
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  display: inline-flex;
  margin-bottom: 8px;
  color: #07753e;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.section-title h2,
.form-card__header h2 {
  color: #0b513f;
  font-size: 1.8rem;
  line-height: 1.1;
}

.image-preview {
  width: 200px;
  aspect-ratio: 4 / 3;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(7, 117, 62, 0.08);
  border: 1px dashed rgba(7, 117, 62, 0.28);
  display: grid;
  place-items: center;
  color: #0b513f;
  font-weight: 600;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.meta-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.meta-block {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 10px;
  color: #0b513f;
  font-weight: 700;
}

.field--wide {
  grid-column: 1 / -1;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid rgba(7, 117, 62, 0.15);
  background: rgba(255, 255, 255, 0.94);
  border-radius: 16px;
  padding: 14px 16px;
  font: inherit;
  color: #0a4635;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: rgba(7, 117, 62, 0.4);
  box-shadow: 0 0 0 4px rgba(138, 238, 195, 0.3);
}

.inline-input {
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) auto;
}

.inline-button,
.submit-button {
  border: none;
  border-radius: 999px;
  background: #07753e;
  color: #ffffff;
  padding: 14px 22px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.inline-button:hover,
.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(7, 117, 62, 0.18);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  font: inherit;
  background: rgba(138, 238, 195, 0.35);
  color: #0b513f;
  cursor: pointer;
}

.tag--soft {
  background: rgba(11, 81, 63, 0.08);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .form-card__header,
  .section-title,
  .meta-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-card__header {
    flex-direction: column;
  }

  .image-preview {
    width: 100%;
    max-width: 320px;
  }
}

@media (max-width: 640px) {
  .form-card {
    padding: 20px;
    border-radius: 22px;
  }

  .section-title h2,
  .form-card__header h2 {
    font-size: 1.4rem;
  }

  .inline-input {
    grid-template-columns: 1fr;
  }

  .form-actions {
    justify-content: stretch;
  }

  .submit-button {
    width: 100%;
  }
}
</style>
