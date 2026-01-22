# Atualização dos Carrosséis - Índice em Pontos e Viewport Segura

## ✅ Mudanças Implementadas

### 1. **Sistema de Índice em Pontos (Pagination Dots)**
   - ✅ Implementado para **ambos** carrosséis (Destaque e Inscrição)
   - ✅ Substitui completamente a scrollbar do Swiper
   - ✅ Pontos são clicáveis para navegação direta
   - ✅ Sincronização automática com slide ativo

### 2. **Viewport Segura (Overflow Hidden)**
   - ✅ Novo container `.viewport-container` com `overflow: hidden`
   - ✅ Cards nunca ultrapassam a diagramação
   - ✅ Padding responsivo (clamp) para margens laterais
   - ✅ Evita cortes inesperados de conteúdo

### 3. **Lógica de Navegação**
   - ✅ `onSlideChange(swiper)` - Atualiza índice quando slide muda
   - ✅ `goToSlide(index)` - Permite click nos dots para ir a slide específico
   - ✅ `totalPages` - Calcula número dinâmico de "páginas" baseado em slides visíveis

### 4. **Estilos dos Pagination Dots**
   - ✅ Círculos com 10px (desktop) / 8px (mobile)
   - ✅ Borda cinza (#ddd) por padrão
   - ✅ Ativo: preenchimento verde (#0b513f) com sombra
   - ✅ Hover: escala 1.2 + borda #999
   - ✅ Transições suaves (0.3s ease)

### 5. **Responsividade Mantida**
   - ✅ Desktop (≥1440px): 4/3 cards
   - ✅ Tablet (768-1439px): 3/3 cards  
   - ✅ Mobile (<768px): 2/1.5 cards
   - ✅ Viewport padding reduzido em mobile

## 📋 Estrutura HTML Atualizada

```html
<div class="carrossel-wrapper">
  <!-- Viewport que contém o Swiper - overflow hidden -->
  <div class="viewport-container">
    <swiper ...>
      <swiper-slide v-for="...">
        <component ... />
      </swiper-slide>
    </swiper>
  </div>

  <!-- Índice em pontos (novo) -->
  <div class="carousel-pagination">
    <button v-for="i in totalPages" 
            class="pagination-dot"
            :class="{ active: currentIndex === i - 1 }"
            @click="goToSlide(i - 1)">
    </button>
  </div>
</div>
```

## 🎯 Comportamentos Implementados

| Feature | Destaque | Inscrição |
|---------|----------|-----------|
| **Pagination Dots** | ✅ Sim | ✅ Sim |
| **Overflow Hidden** | ✅ Sim | ✅ Sim |
| **Cards Centralizados** | ✅ Sim | ✅ Sim (com scale) |
| **Click Navegação** | ✅ Dots | ✅ Dots |
| **Scroll Sync** | ✅ Automático | ✅ Automático |
| **Mousewheel** | ✅ Ativo | ✅ Ativo |

## 🔧 Script Updates

**Variáveis de Estado:**
```javascript
const currentIndex = ref(0)  // Índice do slide ativo
const totalPages = computed(() => { ... })  // Total de páginas
```

**Eventos:**
```javascript
function onSlideChange(swiper) {
  currentIndex.value = swiper.activeIndex
}

function goToSlide(index) {
  const swiperInstance = document.querySelector(`.swiper-${variant.value}`).__swiper__
  if (swiperInstance) {
    swiperInstance.slideTo(index, 500)
  }
}
```

## 📁 Arquivos Modificados

1. [frontend/src/componentes/Carrossel.vue](../frontend/src/componentes/Carrossel.vue)
   - ✅ Script: Adicionada lógica de índice e navegação
   - ✅ Template: Novo container viewport e pagination dots
   - ✅ Styles: Viewport hidden + estilos dos dots

2. [frontend/src/assets/styles/swiper-custom.css](../frontend/src/assets/styles/swiper-custom.css)
   - ✅ Removida toda referência à scrollbar do Swiper
   - ✅ Mantidas transições e efeitos de slide

3. [frontend/src/componentes/CardInscricao.vue](../frontend/src/componentes/CardInscricao.vue)
   - ✅ Removida regra CSS vazia `.cardfooter p`

## ✨ Benefícios

- ✅ **Controle Visual Claro** - Pontos indicam posição no carrossel
- ✅ **Navegação Intuitiva** - Clique no ponto vai direto ao slide
- ✅ **Sem Overflow** - Cards nunca saem da diagramação
- ✅ **Responsivo** - Adapta a pontos menores em mobile
- ✅ **Sincronizado** - Índice sempre atualizado com slide

---

**Status:** ✅ Atualização Completa
**Data:** 22/01/2026
