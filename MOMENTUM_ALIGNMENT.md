# Alinhamento de Diagramação e Momentum Scrolling

## ✅ Mudanças Implementadas

### 1. **Alinhamento à Diagramação da Página**
   - ✅ Viewport container usa `width: 100vw` com `margin-left: calc(-50vw + 50%)`
   - ✅ Cards agora se alinham com a largura total da página, não limitados à seção pai
   - ✅ Permite que o carrossel se estenda para as margens da página
   - ✅ Mantém o Swiper centralizado e sincronizado com o layout

### 2. **Momentum Scrolling (Inércia)**
   - ✅ **Carrossel Destaque:**
     - `freeMode.momentum: true` - Movimento contínuo ao soltar
     - `momentumRatio: 1` - Velocidade de inércia
     - `momentumVelocityRatio: 1` - Proporção da velocidade
     - `momentumBounce: true` - Rebote ao final
     - `momentumBounceRatio: 1` - Intensidade do rebote
   
   - ✅ **Carrossel Inscrição:**
     - `freeMode.momentum: true` - Movimento contínuo
     - Mantém o comportamento centrado com inércia

### 3. **Comportamento ao Soltar o Mouse**
   - ✅ O carrossel continua se movendo após soltar o mouse
   - ✅ A velocidade diminui gradualmente até parar
   - ✅ Momentum proporcional à força do arraste
   - ✅ Suave e natural, sem "snap" abrupto

## 🔧 Configuração Swiper Atualizada

```javascript
// Destaque - Com momentum
freeMode: {
  enabled: true,
  momentum: true,
  momentumRatio: 1,
  momentumVelocityRatio: 1,
  momentumBounce: true,
  momentumBounceRatio: 1,
}

// Inscrição - Com momentum centralizado
freeMode: {
  enabled: true,
  momentum: true,
  momentumRatio: 1,
  momentumVelocityRatio: 1,
}
```

## 📐 CSS Viewport Update

```css
.viewport-container {
  width: 100vw;                          /* Largura total da viewport */
  margin-left: calc(-50vw + 50%);        /* Alinha com a página */
  overflow: hidden;                      /* Garante overflow seguro */
  display: flex;
  justify-content: center;
}
```

## ✨ Benefícios Implementados

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Alinhamento** | Limitado ao container | Alinhado com a página |
| **Movimento** | Snap rígido | Inércia suave |
| **Experiência** | Mecânico | Natural e fluido |
| **Diagramação** | Restritivo | Amplo e limpo |

## 🎯 Fluxo de Interação

1. **Usuário clica e arrasta** → Movimento responsivo
2. **Usuário solta o mouse** → Momentum leva o carrossel para frente
3. **Velocidade diminui** → Desaceleração natural
4. **Parada suave** → Slide se posiciona naturalmente
5. **Index atualiza** → Pagination dots sincronizam

## 📁 Arquivos Modificados

1. [frontend/src/componentes/Carrossel.vue](../frontend/src/componentes/Carrossel.vue)
   - ✅ Configuração Swiper com momentum
   - ✅ CSS viewport com 100vw + margin-left
   - ✅ Padding responsivo mantido

## 🚀 Resultado Final

- ✅ Cards alinhados com a diagramação da página
- ✅ Movimento fluido e natural com inércia
- ✅ Experiência de usuário premium
- ✅ Responsivo em todos os breakpoints
- ✅ Sincronização perfeita com pagination dots

---

**Status:** ✅ Implementação Completa
**Data:** 22/01/2026
