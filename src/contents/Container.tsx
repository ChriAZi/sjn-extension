import type { PlasmoCSConfig, PlasmoCSUIAnchor, PlasmoCSUIProps, PlasmoGetInlineAnchorList } from 'plasmo'
import { sendToBackground } from '@plasmohq/messaging'
import cssText from 'data-text:~style.css'

import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import Title from '~components/Title'
import Source from '~components/Source'
import Description from '~components/Description'
import ActionButton from '~components/ActionButton'

import { SkeletonTheme } from 'react-loading-skeleton'
import { addClick, addComponent, getSessionId } from '~util/firestore'
import { ComponentIdContext } from '~util/ComponentIdContext'

const Container: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [article, setArticle] = useState<Article | null>(null)
  const [componentId, setComponentId] = useState<string | undefined>(undefined)

  const traditionalTitle: string | undefined = getTitle(anchor)
  const anchorDatasetValues: Record<string, string | number> | undefined = process.env.PLASMO_PUBLIC_LAB_STUDY === 'true' && localStorage.getItem('condition') === 'prototype' ? getDatasetValues(anchor) : undefined
  const width = getWidth(anchor)
  const margin = process.env.PLASMO_PUBLIC_LAB_STUDY === 'true' && localStorage.getItem('condition') === 'prototype' ? '0 0 2rem 0' : '0'

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function getRecommendationFromTitle (title: string | undefined, anchorDatasetValues: Record<string, string | number> | undefined): Promise<any> {
      if (process.env.PLASMO_PUBLIC_LAB_STUDY === 'true' && localStorage.getItem('condition') === 'prototype') {
        if (anchorDatasetValues !== undefined) {
          const res = await sendToBackground({
            name: 'recommender',
            body: {
              title,
              embedding: anchorDatasetValues.embedding
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
      } else {
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
    }

    getRecommendationFromTitle(traditionalTitle, anchorDatasetValues).catch(() => {
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
  }, [])

  useEffect(() => {
    anchor?.element.addEventListener('click', () => {
      traditionalLinkClickHandler(componentId)
    })

    return () => {
      anchor?.element.removeEventListener('click', () => {
        traditionalLinkClickHandler(componentId)
      })
    }
  }, [componentId])

  useEffect(() => {
    (async () => {
      if (componentId === undefined) {
        const sessionId = await getSessionId()
        if (process.env.PLASMO_PUBLIC_LAB_STUDY !== 'true') {
          if (traditionalTitle !== undefined) {
            let newComponentId
            if (article?.error !== undefined && article.error) {
              newComponentId = await addComponent(sessionId, 'error', traditionalTitle)
            } else {
              if (article?.title !== undefined && article?.url !== undefined && article?.show !== undefined && article?.error !== undefined) {
                if (!article.show) {
                  newComponentId = await addComponent(sessionId, 'placeholder', traditionalTitle)
                } else {
                  newComponentId = await addComponent(sessionId, 'recommendation', traditionalTitle, article.url, article.title)
                }
              }
            }
            setComponentId(newComponentId)
          }
        } else {
          if (anchorDatasetValues?.componentId !== undefined) {
            setComponentId(anchorDatasetValues.componentId as string)
          }
        }
      }
    })().catch(e => {
      console.error('error updating component', e)
    })
  }, [article])

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
        <ComponentIdContext.Provider value={componentId}>
          <div ref={containerRef} className={'flex min-w-0 text-base font-medium'}>
            {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
            <Title error={article?.error} placeholder={!article?.show} title={article?.title} url={article?.url}/>
          </div>
          {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
          <hr className={`${article?.show ? 'border-very-light-blue' : 'border-loading-grey'}`}/>
          {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
          <Source error={article?.error} placeholder={!article?.show} publicationDate={article?.publicationDate}
                  newsOutlet={article?.newsOutlet}/>
          <div className={`flex ${width < 720 ? 'flex-wrap gap-3' : 'gap-3'}`}>
            {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
            <Description error={article?.error} placeholder={!article?.show} description={article?.description}/>
            {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
            <ActionButton error={article?.error} placeholder={!article?.show} url={article?.url}/>
          </div>
        </ComponentIdContext.Provider>
      </div>
    </SkeletonTheme>
  )
}

export default Container

const traditionalLinkClickHandler = (componentId: string | undefined): void => {
  (async (): Promise<void> => {
    if (componentId !== undefined) {
      await addClick(componentId, 'traditional--link')
    }
  })().catch(e => {
    console.error('error adding click for traditional news', e)
  })
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

function getDatasetValues (anchor: PlasmoCSUIAnchor | undefined): Record<string, string | number> | undefined {
  if (anchor !== undefined) {
    const element = anchor.element as HTMLElement
    if (element.dataset?.embedding !== undefined && element.dataset?.componentId !== undefined) {
      return {
        embedding: JSON.parse(element.dataset.embedding),
        componentId: element.dataset.componentId
      }
    }
  } else {
    return undefined
  }
}

function getWidth (anchor: PlasmoCSUIAnchor | undefined): number {
  if (anchor !== undefined) {
    const element = anchor.element as HTMLElement
    if (element.offsetWidth === 0) {
      const greatParent = element?.parentElement?.parentElement
      if (greatParent !== null && greatParent !== undefined) {
        return greatParent.offsetWidth
      }
    }
    return element.offsetWidth
  } else {
    return 840
  }
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
