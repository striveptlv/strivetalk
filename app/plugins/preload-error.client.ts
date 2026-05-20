const reloadFlag = 'strive-talk-preload-reload'

export default defineNuxtPlugin(() => {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()

    if (sessionStorage.getItem(reloadFlag) === 'true') {
      return
    }

    sessionStorage.setItem(reloadFlag, 'true')
    window.location.reload()
  })

  window.addEventListener('load', () => {
    sessionStorage.removeItem(reloadFlag)
  })
})
