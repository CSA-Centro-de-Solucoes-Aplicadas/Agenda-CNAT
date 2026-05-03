<script setup lang="ts">
import { onMounted, ref } from 'vue'

import EventForm from '@/componentes/EventForm.vue'
import Footer from '@/componentes/footer.vue'
import HeaderAdm from '@/componentes/headerAdm.vue'
import { createEvent, listCategories } from '@/services/events'
import type { EventPayload } from '@/types/event'

const busy = ref(false)
const message = ref('')
const categorySuggestions = ref<string[]>([])
const formKey = ref(0)

onMounted(loadCategories)

async function loadCategories() {
  try {
    const categories = await listCategories()
    categorySuggestions.value = categories.map((category) => category.nome)
  } catch {
    categorySuggestions.value = []
  }
}

async function handleSubmit(payload: EventPayload) {
  busy.value = true
  message.value = ''

  try {
    await createEvent(payload)
    message.value = 'Evento cadastrado com sucesso.'
    formKey.value += 1
    await loadCategories()
  } catch (error) {
    message.value = getErrorMessage(error)
  } finally {
    busy.value = false
  }
}

function getErrorMessage(error: unknown) {
  const maybeAxiosError = error as {
    response?: {
      status?: number
      data?: {
        message?: string
        errors?: Array<{ message?: string }>
      }
    }
    message?: string
  }

  const apiMessage =
    maybeAxiosError.response?.data?.message ||
    maybeAxiosError.response?.data?.errors?.map((item) => item.message).filter(Boolean).join(' ')

  if (apiMessage) return `Não foi possível cadastrar o evento: ${apiMessage}`
  if (maybeAxiosError.response?.status) {
    return `Não foi possível cadastrar o evento. Erro ${maybeAxiosError.response.status} no backend.`
  }

  return 'Não foi possível cadastrar o evento. Verifique se o backend está rodando.'
}
</script>

<template>
  <div class="page">
    <HeaderAdm />

    <main class="admin-page">
      <section class="page-hero">
        <span class="eyebrow">Painel administrativo</span>
        <h1>Cadastrar novo evento</h1>
      </section>

      <section class="form-wrapper">
        <p v-if="message" class="feedback">{{ message }}</p>

        <EventForm
          :key="formKey"
          :busy="busy"
          :category-suggestions="categorySuggestions"
          submit-label="Cadastrar evento"
          @submit="handleSubmit"
        />
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-page {
  flex: 1;
  width: min(1440px, calc(100% - 48px));
  margin: 0 auto;
  padding: 36px 0 48px;
  display: grid;
  gap: 28px;
}

.page-hero {
  display: grid;
  gap: 14px;
}

.eyebrow {
  color: #07753e;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

.page-hero h1 {
  color: #0b513f;
  font-size: clamp(2rem, 4vw, 3.2rem);
}

.page-hero p,
.feedback {
  color: rgba(10, 70, 53, 0.78);
}

.feedback {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 16px 18px;
  box-shadow: 0 18px 35px rgba(2, 64, 46, 0.08);
}

@media (max-width: 640px) {
  .admin-page {
    width: min(100%, calc(100% - 24px));
    padding-top: 20px;
  }
}
</style>
