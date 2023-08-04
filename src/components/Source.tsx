import cssText from 'data-text:~style.css'
import Skeleton from 'react-loading-skeleton'
import { addClick } from '~util/firestore'
import { useContext } from 'react'
import { ComponentIdContext } from '~util/ComponentIdContext'

export default function Source ({
  error,
  placeholder,
  publicationDate,
  newsOutlet
}: SourceProps): JSX.Element {
  if (error !== undefined && error) {
    return <></>
  } else if (placeholder !== undefined && publicationDate !== undefined && newsOutlet !== undefined) {
    const url = 'https://www.solutionsjournalism.org/storytracker'
    const componentId = useContext(ComponentIdContext)
    let content = (
      <>
        <h2>Sourced from the&nbsp;
          <a className={'hover:underline decoration-2'}
             onClick={() => {
               (async () => {
                 if (componentId !== undefined) {
                   await addClick(componentId, 'storytracker--link')
                 }
               })().catch(e => {
                 console.error('error adding sj link click', e)
               })
             }}
             href={url}
             target="_blank"
             rel="noopener noreferrer">
            <b>Solution Story Tracker®</b>
          </a>
        </h2>
        <div className={'flex gap-1 text-light-grey'}>
          <h2>published {(publicationDate.getUTCMonth() + 1).toString() + '/' + publicationDate.getUTCDate().toString() + '/' + publicationDate.getFullYear().toString()} by {newsOutlet}</h2>
        </div>
      </>
    )

    if (placeholder) {
      content = <>
        <h2>Discover more SJ-stories from the&nbsp;
          <a className={'hover:underline decoration-2'}
             onClick={() => {
               (async () => {
                 if (componentId !== undefined) {
                   await addClick(componentId, 'placeholder--link')
                 }
               })().catch(e => {
                 console.error('error adding sj link click', e)
               })
             }}
             href={url}
             target="_blank"
             rel="noopener noreferrer">
            <b>Solution Story Tracker®</b>
          </a>
        </h2>
      </>
    }

    return (
      <div className={'flex flex-wrap gap-0.5 text-black'}>
        {content}
      </div>
    )
  } else {
    return <Skeleton containerClassName={'w-[50%]'}/>
  }
}

interface SourceProps {
  error: boolean | undefined
  placeholder: boolean | undefined
  publicationDate: Date | undefined
  newsOutlet: string | undefined
}

export function getStyle (): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}
