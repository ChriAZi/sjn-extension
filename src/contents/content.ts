import type { PlasmoCSConfig } from 'plasmo'

let currentUrl = location.href
setInterval(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href
    // TODO
  }
}, 50)

function getGreatGrandParents (): HTMLElement[] {
  const articles = document.querySelectorAll('article')
  return Array.from(articles).map(article => {
    if (article?.children.length === 2) {
      return article?.parentElement?.parentElement as HTMLElement
    } else {
      return article?.parentElement?.parentElement?.parentElement as HTMLElement
    }
  })
}

function handleRoundedCorners (): void {
  const ggpElements: HTMLElement[] = getGreatGrandParents()
  ggpElements.forEach((ggp: HTMLElement) => {
    ggp.style.borderBottomLeftRadius = '0'
    ggp.style.borderBottomRightRadius = '0'
  })
}

function handleMargin (): void {
  if (window.location.href.includes('publication') || window.location.href.includes('search')) {
    const articles = Array.from(
      document.querySelectorAll('article'))
      .map(article => {
        return article?.parentElement?.parentElement as HTMLElement
      })

    articles.forEach((ggp: HTMLElement) => {
      ggp.style.marginBottom = '2rem'
    })
  }
}

'load scroll'.split(' ').forEach(function (e) {
  window.addEventListener(e, handleRoundedCorners, false)
  window.addEventListener(e, handleMargin, false)
})

export const config: PlasmoCSConfig = {
  matches: ['https://news.google.com/*en']
}
