import type { PlasmoCSConfig, PlasmoCSUIAnchor, PlasmoCSUIProps, PlasmoGetInlineAnchorList } from 'plasmo'
import { sendToBackground } from '@plasmohq/messaging'
import cssText from 'data-text:~style.css'

import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import Title from '~components/Title'
import Source from '~components/Source'
import Description from '~components/Description'
import ActionButton from '~components/ActionButton'

import { SkeletonTheme } from 'react-loading-skeleton'
import { addClick } from '~util/firestore'

const Container: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [article, setArticle] = useState<Article | null>(null)
  const traditionalTitle: string | undefined = getTitle(anchor)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const width = (anchor?.element.offsetWidth === 0) ? anchor?.element?.parentNode.parentNode.offsetWidth : anchor?.element.offsetWidth
  const margin = process.env.PLASMO_PUBLIC_LAB_STUDY === 'true' && localStorage.getItem('condition') === 'prototype' ? '0 0 2rem 0' : '0'

  useEffect(() => {
    async function getRecommendationFromTitle (title: string | undefined): Promise<any> {
      const res = await sendToBackground({
        name: 'recommender',
        body: {
          title
        }
      })
      if (res === 'error') {
        throw new Error()
      } else {
        setArticle({
          title: res.article.title,
          description: res.article.description,
          newsOutlet: res.article.newsOutlet,
          publicationDate: new Date(Date.parse(res.article.publicationDate)),
          url: res.article.url,
          show: res.article.show,
          error: false
        })
      }
    }

    getRecommendationFromTitle(traditionalTitle).catch(() => {
      setArticle({
        title: undefined,
        description: undefined,
        newsOutlet: undefined,
        publicationDate: undefined,
        url: undefined,
        show: undefined,
        error: true
      })
    })

    return () => {
      setArticle({
        title: undefined,
        description: undefined,
        newsOutlet: undefined,
        publicationDate: undefined,
        url: undefined,
        show: undefined,
        error: false
      })
    }
  }, [])

  useEffect(() => {
    const handler = (): void => {
      (async (): Promise<void> => {
        await handleTraditionalTitleClick(traditionalTitle as string, article?.title as string)
      })().catch(e => {
        console.error('error adding click for traditional news', e)
      })
    }
    anchor?.element.addEventListener('click', () => {
      handler()
    })

    return () => {
      anchor?.element.removeEventListener('click', () => {
        handler()
      })
    }
  }, [])

  let containerClasses = 'w-full p-4 flex flex-col gap-1 text-sm'

  if (window.location.href.includes('home')) {
    containerClasses += ' !mt-4 rounded-2xl'
  } else if (window.location.href.includes('publication') || window.location.href.includes('search')) {
    containerClasses += ' !mt-12 rounded-b-lg'
  } else {
    containerClasses += ' rounded-b-2xl'
  }

  /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
  if (article?.error) {
    containerClasses += ' bg-error-red'
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
  } else if (article?.show) {
    containerClasses += ' bg-light-blue'
  } else {
    containerClasses += ' bg-lighter-grey'
  }

  return (
    <SkeletonTheme baseColor="#A9A9A9" highlightColor="#C8C8C8">
      <div style={{
        width,
        margin
      }} className={containerClasses}>
        <div className={'flex min-w-0 text-base font-medium'}>
          {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
          <Title error={article?.error} placeholder={!article?.show} traditionalTitle={traditionalTitle}
                 title={article?.title} url={article?.url}/>
        </div>
        {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
        <hr className={`${article?.show ? 'border-very-light-blue' : 'border-loading-grey'}`}/>
        {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
        <Source error={article?.error} placeholder={!article?.show}
                publicationDate={article?.publicationDate}
                newsOutlet={article?.newsOutlet}/>
        <div className={`flex ${width < 720 ? 'flex-wrap gap-3' : 'gap-3'}`}>
          {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
          <Description error={article?.error} placeholder={!article?.show} description={article?.description}/>
          {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
          <ActionButton error={article?.error} placeholder={!article?.show} traditionalTitle={traditionalTitle}
                        title={article?.title}
                        url={article?.url}/>
        </div>
      </div>
    </SkeletonTheme>
  )
}

export default Container

async function handleTraditionalTitleClick (traditionalTitle: string, title: string): Promise<void> {
  let sessionId
  if (process.env.PLASMO_PUBLIC_LAB_STUDY === 'true') {
    sessionId = localStorage.getItem('sessionId')
  } else {
    sessionId = await chrome.storage.local.get('sessionId')
    sessionId = sessionId.sessionId
  }
  await addClick(sessionId, 'traditional--link', traditionalTitle, '', title)
}

async function getAnchor (): Promise<PlasmoGetInlineAnchorList> {
  const articleNodes = document.querySelectorAll('article')
  const articles: HTMLElement[] = []
  articleNodes.forEach((article: HTMLElement) => {
    // ignore components with stacked articles e.g. "Sources" on for you or "news showcase"
    if (article?.nextElementSibling?.tagName !== 'ARTICLE' && article?.previousElementSibling?.tagName !== 'ARTICLE') {
      articles.push(article)
    }
  })
  const anchors: HTMLElement[] = []

  articles.forEach((article) => {
    if (article?.children.length === 2) {
      const heading = article?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.firstElementChild?.textContent
      if (heading !== 'Fact check') {
        if (heading !== 'Beyond the front page') {
          const anchor = article.parentElement?.parentElement as HTMLElement

          if (anchor.tagName === 'C-WIZ') {
            // single story anchor
            if (!anchors.includes(anchor)) {
              anchors.push(anchor)
            }
          }
        }
      }
    } else {
      if (!window.location.href.includes('home')) {
        if (window.location.href.includes('publication') || window.location.href.includes('search')) {
          const anchor = article.parentElement as HTMLElement
          if (!anchors.includes(anchor)) {
            anchors.push(anchor)
          }
        } else {
          const anchor = article.parentElement?.parentElement?.parentElement as HTMLElement
          // multi story anchor
          if (!anchors.includes(anchor)) {
            anchors.push(anchor)
          }
        }
      } else {
        // home page anchors
        const anchor = article.parentElement?.parentElement?.parentElement?.parentElement as HTMLElement
        if (!anchors.includes(anchor)) {
          anchors.push(anchor)
        }
      }
    }
  })
  if (process.env.PLASMO_PUBLIC_LAB_STUDY === 'true') {
    if (localStorage.getItem('condition') === 'prototype') {
      return document.querySelectorAll('.article') as unknown as PlasmoGetInlineAnchorList
    } else {
      return null as unknown as PlasmoGetInlineAnchorList
    }
  }
  return anchors as unknown as PlasmoGetInlineAnchorList
}

function getTitle (anchor: PlasmoCSUIAnchor | undefined): string | undefined {
  return process.env.PLASMO_PUBLIC_LAB_STUDY === 'true' && localStorage.getItem('condition') === 'prototype'
    ? anchor?.element.querySelector('h2 > a')?.innerHTML
    : anchor?.element.querySelector('h4')?.innerHTML
}

export const config: PlasmoCSConfig = {
  matches: ['https://news.google.com/*en', 'http://localhost:*/*']
}

export async function getInlineAnchorList (): Promise<PlasmoGetInlineAnchorList> {
  return await getAnchor()
}

export function getStyle (): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

interface Article {
  title: string | undefined
  description: string | undefined
  newsOutlet: string | undefined
  publicationDate: Date | undefined
  url: string | undefined
  show: boolean | undefined
  error: boolean | undefined
}
