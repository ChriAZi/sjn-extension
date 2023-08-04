import cssText from 'data-text:~style.css'
import Skeleton from 'react-loading-skeleton'
import { addClick, getSessionId } from '~util/firestore'

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
    let content = (
      <>
        <h2>Sourced from the&nbsp;
          <a className={'hover:underline decoration-2'}
             onClick={() => {
               (async () => {
                 const sessionId = await getSessionId()
                 await addClick(sessionId, 'storytracker--link', '', url)
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
                 const sessionId = await getSessionId()
                 await addClick(sessionId, 'placeholder--link', '', url)
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
