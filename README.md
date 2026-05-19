# 🗣️ Stroke Speech

<p align="center">
  <img src="public/pwa-icon.svg" alt="Stroke Speech Logo" width="140" height="140" />
</p>

<p align="center">
  <a href="https://macarthuror.github.io/stroke-speach/"><img src="https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square" alt="Status Live"></a>
  <img src="https://img.shields.io/badge/PWA-Ready-blue?style=flat-square&logo=pwa" alt="PWA Ready">
  <img src="https://img.shields.io/badge/Framework-Nuxt_4-00DC82?style=flat-square&logo=nuxt.js" alt="Nuxt 4">
  <img src="https://img.shields.io/badge/i18n-ES_%7C_EN-blue?style=flat-square" alt="i18n ES | EN">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License MIT">
</p>

> **Aplicación web AAC (Augmentative and Alternative Communication)** enfocada en personas con dificultades del habla, especialmente diseñada para facilitar el proceso de recuperación post-ictus (derrame cerebral).

---

## 🌍 Abstract (English)

**Stroke Speech** is an accessible, Progressive Web App (PWA) designed to provide Augmentative and Alternative Communication (AAC) for stroke survivors and individuals with speech impairments. By utilizing the Web Speech API (Text-to-Speech), it allows users to quickly select customizable word and phrase cards to communicate their daily needs. The app is fully internationalized (Spanish & English UI) and lets users configure the speech voice language, pitch, and rate. With a simple, high-contrast UI and full offline support, Stroke Speech aims to bridge the communication gap during rehabilitation, ensuring users have a voice anywhere, anytime.

---

## 🎯 Descripción y Objetivos

**Stroke Speech** permite crear, personalizar y reproducir tarjetas de comunicación por voz para necesidades rápidas de uso diario.

**Objetivos clave:**

- **Comunicación inmediata:** Facilitar la expresión mediante tarjetas de palabras y frases preconfiguradas.
- **Accesibilidad máxima:** Interfaz simple, clara, de alto contraste y con áreas táctiles grandes.
- **Disponibilidad total:** Funcionar como PWA instalable con soporte 100% offline.
- **Personalización de voz:** Control completo del idioma, tono (pitch) y velocidad (rate) de la síntesis de voz.

---

## ✨ Características Principales

- 🗂️ **Tarjetas Personalizables:** Crea y organiza tarjetas de palabras y frases.
- 🔊 **Síntesis de Voz (TTS):** Reproducción mediante `SpeechSynthesis` con soporte para 13 idiomas/variantes.
- 🎛️ **Ajustes de Voz:** Elige idioma de voz, tono (pitch) y velocidad (rate) persistidos en `localStorage`.
- 🌐 **Interfaz Bilingüe (i18n):** UI completa en Español e Inglés, con selector de idioma en el header.
- 🎨 **Identificación Visual:** Selector de color y soporte de emojis por tarjeta.
- 🗑️ **Gestión Segura:** Modo "eliminar" controlado desde el header para evitar toques accidentales.
- 📱 **Experiencia Nativa (PWA):** Instalable en escritorio (Chrome/Edge) y móvil (Android/iOS mediante A2HS).
- 📶 **Modo Offline:** Soporte sin conexión a internet garantizado por Service Workers.
- 🔄 **Auto-Update:** Actualización automática de la PWA tras nuevos despliegues.

---

## 🏗️ Arquitectura y Rutas

La aplicación está diseñada con una navegación plana para evitar que el usuario se pierda:

| Ruta        | Descripción                                              |
| ----------- | -------------------------------------------------------- |
| `/`         | Tarjetas de palabras (Inicio)                            |
| `/phrases`  | Tarjetas de frases complejas                             |
| `/settings` | Ajustes de voz: idioma, pitch, rate y botón de restaurar |
| `/about`    | Información del proyecto                                 |

---

## 🗣️ Idiomas de Voz Soportados

La configuración de voz admite las siguientes voces TTS (dependiendo del navegador/SO):

`es-MX` · `es-ES` · `en-US` · `en-GB` · `zh-CN` · `hi-IN` · `fr-FR` · `ar-SA` · `pt-BR` · `ru-RU` · `de-DE` · `ja-JP` · `id-ID`

---

## 💻 Tecnologías Usadas

Este proyecto está construido con un stack moderno y enfocado en el máximo rendimiento:

**Framework y UI:**

- [Nuxt 4](https://nuxt.com/) & [Vue 3](https://vuejs.org/)
- [Nuxt UI](https://ui.nuxt.com/) & [Tailwind CSS 4](https://tailwindcss.com/)

**Internacionalización:**

- [`@nuxtjs/i18n`](https://i18n.nuxtjs.org/) — Español (`es`) e Inglés (`en`)

**PWA y Rendimiento:**

- `@vite-pwa/nuxt` & [Workbox](https://developer.chrome.com/docs/workbox/)

**Utilidades:**

- [VueUse](https://vueuse.org/) (`@vueuse/core`, `@vueuse/nuxt`) — `useLocalStorage` para persistencia de ajustes
- `vue3-emoji-picker`

**Calidad y Testing:**

- TypeScript, ESLint, Vitest, Vue Test Utils

---

## 🚀 Instalación y Desarrollo Local

**Requisitos previos:**

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 10+

**Pasos de instalación:**

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev
```
