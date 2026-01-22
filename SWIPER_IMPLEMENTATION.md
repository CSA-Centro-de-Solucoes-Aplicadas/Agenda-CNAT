# Implementação dos Carrosséis com Swiper para Vue

## ✅ Resumo das Alterações Realizadas

### 1. **Instalação da Biblioteca**
   - `npm install swiper` - Adicionado ao projeto frontend

### 2. **Refatoração do Componente Carrossel.vue** 
   - ✅ Importados módulos Swiper: `Scrollbar`, `Mousewheel`, `FreeMode`, `Navigation`
   - ✅ Substituído sistema manual de scroll por componentes `<swiper>` e `<swiper-slide>`
   - ✅ Removidos handlers de drag/touch manuais (agora nativos do Swiper)
   - ✅ Mantida a lógica responsiva de detecção de device (desktop/tablet/mobile)

### 3. **Carrossel de Destaques (Stories Style)**
   **Configuração:**
   - `slidesPerView`: 4 (desktop) → 3 (tablet) → 2 (mobile)
   - `grabCursor: true` - Cursor muda para "grab" ao passar
   - `mousewheel: { forceToAxis: true }` - Scroll com mousewheel
   - `freeMode: true` - Rolagem livre sem snap obrigatório
   - `scrollbar: { draggable: true, hide: false }` - Scrollbar visível e arrastável

   **Estilização Scrollbar:**
   - Linha fina horizontal (5px altura em desktop, 4px em mobile)
   - Cor de fundo: #e0e0e0
   - Cor do drag: #0b513f com gradiente e sombra
   - Sincronizada com movimento do carrossel

### 4. **Carrossel de Inscrições (Cards com Foco Central)**
   **Configuração:**
   - `slidesPerView`: 1.5 (mobile) → 3 (desktop)
   - `centeredSlides: true` - Card central sempre alinhado
   - `freeMode: true` - Rolagem suave
   - `spaceBetween: 24px` - Espaçamento entre cards

   **Transições CSS (Swiper Classes):**
   - `.swiper-slide` - Opacidade 0.7, escala 0.95
   - `.swiper-slide-active` - Opacidade 1, escala 1.05, brightness 1.1 (destaque central)
   - `.swiper-slide-next/.swiper-slide-prev` - Opacidade 0.85, escala 0.98

### 5. **Atualizações nos Cards**

   **CardDestaque.vue:**
   - Adicionado `:hover` com `scale(1.05)` e `box-shadow`
   - Transições suaves (0.3s cubic-bezier)
   - `cursor: grab / grabbing` para feedback do usuário

   **CardInscricao.vue:**
   - Cursor grab/grabbing
   - Transições de sombra e transform

### 6. **Arquivo CSS Global** (`swiper-custom.css`)
   - Estilos centralizados para scrollbars Swiper
   - Efeitos de transition globais
   - Responsividade para mobile
   - Prevenção de text-selection durante drag

### 7. **Integração no main.ts**
   - Importado `swiper-custom.css` para aplicação global

## 🎯 Comportamentos Implementados

| Feature | Destaque | Inscrição |
|---------|----------|-----------|
| **Clique e Arraste** | ✅ Em toda área | ✅ Em toda área |
| **Mousewheel** | ✅ Forçado ao eixo X | ✅ Forçado ao eixo X |
| **Scroll Snap** | ✅ Free Mode | ✅ Centrado |
| **Scrollbar** | ✅ Visível e arrastável | ❌ Não exibida |
| **Cursor Feedback** | ✅ Grab/Grabbing | ✅ Grab/Grabbing |
| **Foco Central** | ❌ Não aplicável | ✅ Scale 1.05 + brightness |
| **Transições** | ✅ Hover scale(1.05) | ✅ Slide-active effects |

## 📱 Responsividade

```
Desktop (≥1440px):
  - Destaque: 4 cards/página
  - Inscrição: 3 cards/página
  - Scrollbar: 5px height

Tablet (768px-1439px):
  - Destaque: 3 cards/página
  - Inscrição: 3 cards/página
  - Scrollbar: 5px height

Mobile (<768px):
  - Destaque: 2 cards/página
  - Inscrição: 1.5 cards/página
  - Scrollbar: 4px height
```

## 🔧 Configurações Técnicas Aplicadas

✅ **FreeMode Ativo** - Permite rolagem livre e suave
✅ **Grab Cursor** - Feedback visual ao usuário
✅ **Mousewheel Integration** - Compatível com scroll de mouse
✅ **Dynamic Slides Per View** - Ajusta conforme breakpoint
✅ **Centered Slides (Inscrição)** - Card sempre centralizado
✅ **Scrollbar Draggable (Destaque)** - Permite controle via scrollbar
✅ **Smooth Transitions** - cubic-bezier(0.25, 0.46, 0.45, 0.94)

## 📚 Arquivos Modificados

1. [frontend/src/componentes/Carrossel.vue](../frontend/src/componentes/Carrossel.vue)
2. [frontend/src/componentes/CardDestaque.vue](../frontend/src/componentes/CardDestaque.vue)
3. [frontend/src/componentes/CardInscricao.vue](../frontend/src/componentes/CardInscricao.vue)
4. [frontend/src/assets/styles/swiper-custom.css](../frontend/src/assets/styles/swiper-custom.css) *(novo)*
5. [frontend/src/main.ts](../frontend/src/main.ts)

---

**Status:** ✅ Implementação Completa
**Data:** 22/01/2026
