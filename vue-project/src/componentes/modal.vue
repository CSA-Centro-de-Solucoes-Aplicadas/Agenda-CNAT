<script setup lang="ts">
// Props vindas do banco de dados
defineProps({
  evento: {
    type: Object,
    required: true,
    default: () => ({
      local: "Biblioteca Central",
      nome: "Cinebiblio",
      descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus condimentum metus mi, sed tempus sapien elementum vitae.",
      datas: "23 a 27/06",
      horarios: ["11h", "16h", "19h"],
      contatos: ["email1@ifrn.edu.br", "email2@ifrn.edu.br", "email3@ifrn.edu.br"],
      imagem: null
    })
  }
})

const emit = defineEmits(["next"])
</script>

<template>
  <div class="story-wrapper">
    <!-- BARRA DE PROGRESSO -->
    <div class="progress-wrapper">
      <div class="bar active"></div>
      <div class="bar"></div>
    </div>

    <div class="story-card">

      <!-- LEFT CONTENT -->
      <div class="left">

        <div class="local">
         <!-- <img src="@/assets/pin.svg" class="pin-icon" />-->
          {{ evento.local }}
        </div>

        <div class="title-row">
          <button class="arrow-btn">‹</button>
          <h1>{{ evento.nome }}</h1>
          <button class="arrow-btn" @click="emit('next')">›</button>
        </div>

        <p class="descricao">
          {{ evento.descricao }}
        </p>

        <div class="info-row">
          <div class="date">
            <!-- <img src="@/assets/calendar.svg" /> -->
            {{ evento.datas }}
          </div>

          <div class="horarios">
            horários:
            <span v-for="h in evento.horarios" :key="h">{{ h }}; </span>
          </div>
        </div>

        <!-- CONTATOS -->
        <div class="contatos-box">
          <h2>Contatos</h2>

          <div class="contatos-grid">
            <div 
              class="contato-item"
              v-for="(c, i) in evento.contatos" 
              :key="i"
            >
              <img src="@/assets/contato.png" class="user-icon" /> 
              <span>{{ c }}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <span>link para mais informações:</span>
          <strong>Palestras</strong>
        </div>
      </div>

      <!-- RIGHT IMAGE -->
      <div class="right">
        <img :src="evento.imagem" alt="" v-if="evento.imagem" />
      </div>

    </div>
  </div>
</template>

<style scoped>
/* WRAPPER CENTRALIZADO */


/* BARRA DE PROGRESSO */
.progress-wrapper {
  position: absolute;
  top: 30px;
  left: 110px;
  display: flex;
  gap: 8px;
}

.bar {
  width: 100px;
  height: 6px;
  background: #e5e5e5;
  border-radius: 999px;
}

.bar.active {
  background: linear-gradient(90deg, #5ea4ef, #6fe0a5);
}

/* CARD PRINCIPAL */
.story-card {
  width: 800px;
  height: 500px;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
}

/* LEFT CONTENT */
.left {
  width: 55%;
  padding: 50px 45px 40px 45px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.local {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
  font-size: 18px;
}

.pin-icon {
  width: 18px;
  opacity: 0.8;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-row h1 {
  font-size: 28px;
  font-weight: 700;
}

.arrow-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #555;
  cursor: pointer;
}

/* TEXTO */
.descricao {
  color: #6e6e6e;
  font-size: 14px;
  line-height: 1.4;
  width: 90%;
}

/* INFOS */
.info-row {
  display: flex;
  gap: 30px;
  font-size: 15px;
}

.date, .horarios {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #2f2f2f;
}

/* CONTATOS */
.contatos-box {
  background: #e4f3ea;
  padding: 18px;
  border-radius: 16px;
  width: 100%;
}

.contatos-box h2 {
  font-size: 10px;
  margin-bottom: 12px;
  color: #124d3b;
}

.contatos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.contato-item {
  display: flex;
  gap: 8px;
  align-items: center;
  background: #fff;
  padding: 10px 14px;
  border-radius: 10px;
}
.contato-item span {
  overflow-wrap: anywhere;
}


.user-icon {
  width: 20px;
  opacity: 0.7;
}

/* FOOTER */
.footer {
  margin-top: auto;
  font-size: 14px;
  color: #555;
  display: flex;
  gap: 6px;
}

/* RIGHT IMAGE */
.right {
  width: 45%;
  background: #003f7b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
