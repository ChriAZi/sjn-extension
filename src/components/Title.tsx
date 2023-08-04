import cssText from 'data-text:~style.css'
import Skeleton from 'react-loading-skeleton'
import sjnLogo from 'data-base64:~assets/sjn-logo.png'
import { addClick, getSessionId } from '~util/firestore'

export default function Title ({
  error,
  placeholder,
  traditionalTitle,
  title,
  url
}: TitleProps): JSX.Element {
  if (error !== undefined && error) {
    return (
      <div className={'flex min-w-0 gap-1 w-full items-center'}>
        <div className={'flex flex-wrap gap-1.5 items-center min-w-fit'}>
          <img className={'h-4'} src={sjnLogo} alt={'Solution Journalism Network logo'}/>
          <h1>An error occurred - </h1>
          <h1>Please try again later.</h1>
        </div>
      </div>
    )
  } else if (placeholder !== undefined && title !== undefined && url !== undefined && traditionalTitle !== undefined) {
    let content = (
      <div className={'flex flex-wrap min-w-0 gap-1 w-full items-center'}>
        <div className={'flex gap-1.5 items-center min-w-fit text-black'}>
          <img className={'h-4'} src={sjnLogo} alt={'Solution Journalism Network logo'}/>
          <h1>Relevant solution story:</h1>
        </div>
        <a className={'min-w-0 text-dark-blue'}
           onClick={() => {
             (async () => {
               const sessionId = await getSessionId()
               await addClick(sessionId, 'sj--link', traditionalTitle, url, title)
             })().catch(e => {
               console.error('error adding sj link click', e)
             })
           }}
           href={url}
           target={'_blank'}
           rel={'noopener noreferrer'}>
          <h1 className={'hover:underline decoration-2'}>
            {title}
          </h1>
        </a>
      </div>
    )

    if (placeholder) {
      content = (
        <div className={'flex min-w-0 gap-1 w-full items-center'}>
          <div className={'flex gap-1.5 items-center min-w-fit text-black'}>
            <img className={'h-4'} src={sjnLogo} alt={'Solution Journalism Network logo'}/>
            <h1>No relevant solution story found</h1>
          </div>
        </div>
      )
    }
    return content
  } else {
    return <Skeleton containerClassName={'w-[85%]'}/>
  }
}

interface TitleProps {
  error: boolean | undefined
  placeholder: boolean | undefined
  traditionalTitle: string | undefined
  title: string | undefined
  url: string | undefined
}

export function getStyle (): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}
