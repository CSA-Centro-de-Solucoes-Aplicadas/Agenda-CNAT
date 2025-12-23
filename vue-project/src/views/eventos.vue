<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import logoImg from '@/assets/logo.svg'
import logoFooter from '@/assets/logoFooter.png'
import logoIfrn from '@/assets/ifrn.png'
import XImg from '@/assets/x.png'
import instagramImg from '@/assets/instagram.png'
import youtubeImg from '@/assets/youtube.png'
import BarradePesquisa from '@/componentes/BarradePesquisa.vue'
// const API_URL = ' ' 

// onMounted(async () => {
//   const res = await fetch(API_URL)
//   eventos.value = await res.json()
// })

interface Evento {
  id: number
  titulo: string
  data: string
  local: string
}

const isAdmin = ref(true)



const eventos = ref<Evento[]>([
  { id: 1, titulo: 'Dia do Professor de Geografia', data: '19/09', local: 'Biblioteca Central' },
  { id: 2, titulo: 'Arraiá Junino da Melhor Idade', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 3, titulo: 'Engenharia de Energia com a Solif', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 4, titulo: 'Dia do Professor de Geografia', data: '19/09', local: 'Biblioteca Central' },
  { id: 5, titulo: 'Arraiá Junino da Melhor Idade', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 6, titulo: 'Engenharia de Energia com a Solif', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 7, titulo: 'Dia do Professor de Geografia', data: '19/09', local: 'Biblioteca Central' },
  { id: 8, titulo: 'Arraiá Junino da Melhor Idade', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 9, titulo: 'Engenharia de Energia com a Solif', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 10, titulo: 'Dia do Professor de Geografia', data: '19/09', local: 'Biblioteca Central' },
  { id: 11, titulo: 'Arraiá Junino da Melhor Idade', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 12, titulo: 'Engenharia de Energia com a Solif', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 13, titulo: 'Engenharia de Energia com a Solif', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 14, titulo: 'Dia do Professor de Geografia', data: '19/09', local: 'Biblioteca Central' },
  { id: 15, titulo: 'Arraiá Junino da Melhor Idade', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 16, titulo: 'Engenharia de Energia com a Solif', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 17, titulo: 'Engenharia de Energia com a Solif', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 18, titulo: 'Dia do Professor de Geografia', data: '19/09', local: 'Biblioteca Central' },
  { id: 19, titulo: 'Arraiá Junino da Melhor Idade', data: '18/09 à 25/09', local: 'Miniauditório Central' },
  { id: 20, titulo: 'Engenharia de Energia com a Solif', data: '18/09 à 25/09', local: 'Miniauditório Central' }
])


// async function excluirEvento(id: number) {
//   const confirmar = confirm('Tem certeza que deseja excluir este evento?')
//   if (!confirmar) return

//   await fetch(`${API_URL}/${id}`, {
//     method: 'DELETE'
//   })

//   eventos.value = eventos.value.filter(e => e.id !== id)
// }

const modalAberto = ref(false)
const eventoEditando = ref<Evento | null>(null)

function abrirEdicao(evento: Evento) {
  eventoEditando.value = { ...evento } 
  modalAberto.value = true
}

// async function salvarEdicao() {
//   if (!eventoEditando.value) return

//   await fetch(`${API_URL}/${eventoEditando.value.id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(eventoEditando.value)
//   })

//   const index = eventos.value.findIndex(
//     e => e.id === eventoEditando.value!.id
//   )

//   if (index !== -1) {
//     eventos.value[index] = { ...eventoEditando.value }
//   }

//   modalAberto.value = false
// }

function salvarEdicao() {
  if (!eventoEditando.value) return

  const index = eventos.value.findIndex(
    e => e.id === eventoEditando.value!.id
  )

  if (index !== -1) {
    eventos.value[index] = { ...eventoEditando.value }
  }

     
  modalAberto.value = false
}
function excluirEvento(id: number) {
  const confirmar = confirm('Tem certeza que deseja excluir este evento?')
  if (!confirmar) return

  eventos.value = eventos.value.filter(evento => evento.id !== id)

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
                <RouterLink to="/admin/cadastrar-evento">
                Cadastrar eventos
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/admin/eventos">
                Editar eventos
                </RouterLink>
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

        <div class="eventos-list">
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
              {{ evento.data }}
            </div>

            <div class="evento-local">
              {{ evento.local }}
            </div>
            <button
                v-if="isAdmin"
                class="evento-acao"
                @click.stop="excluirEvento(evento.id)"                      >
                🗑
            </button>

          </div>

          <p v-if="eventos.length === 0">
            Nenhum evento encontrado.
          </p>
        </div>
      </section>
    </main>

    <div v-if="modalAberto" class="modal-backdrop">
      <div class="modal">
        <h3>Editar Evento</h3>

        <label>
          Título
          <input v-model="eventoEditando!.titulo" />
        </label>

        <label>
          Data
          <input v-model="eventoEditando!.data" />
        </label>

        <label>
          Local
          <input v-model="eventoEditando!.local" />
        </label>

        <div class="modal-actions">
          <button @click="modalAberto = false">Cancelar</button>
          <button class="btn-salvar" @click="salvarEdicao">Salvar</button>
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

/* BOTÃO */
.evento-acao {
  margin-left: auto;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: #c0392b;
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
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.modal label {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.modal input {
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-salvar {
  background: #4caf84;
  border: none;
  padding: 0.4rem 0.8rem;
  color: #fff;
  border-radius: 6px;
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
