import cssText from 'data-text:~style.css'
import { addClick, getSessionId } from '~util/firestore'

export default function ActionButton ({
  error,
  placeholder,
  traditionalTitle,
  title,
  url
}: ActionButtonProps): JSX.Element {
  if (error !== undefined && error) {
    const text = 'Browse SJ-Articles'
    const handleClick = async (): Promise<void> => {
      const sessionId = await getSessionId()
      const url = 'https://www.solutionsjournalism.org/storytracker'
      await addClick(sessionId, 'error--button', traditionalTitle, url)
      window.open(url, '_blank')
    }

    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button className={'flex-grow-0 mt-auto'} onClick={handleClick}>
          <div className={'flex items-center h-10 bg-dark-grey px-3 py-4 rounded-full'}>
            <p className={'whitespace-nowrap text-white font-medium hover:underline decoration-2'}>
              {text}
            </p>
          </div>
        </button>
      </>
    )
  } else if (placeholder !== undefined && url !== undefined) {
    let text = 'Read Full Story'
    let handleClick = async (): Promise<void> => {
      if (url !== undefined && title !== undefined && traditionalTitle !== undefined) {
        const sessionId = await getSessionId()
        await addClick(sessionId, 'sj--button', traditionalTitle, url, title)
        window.open(url, '_blank')
      }
    }

    if (placeholder) {
      text = 'Browse SJ-Articles'
      handleClick = async (): Promise<void> => {
        const sessionId = await getSessionId()
        const url = 'https://www.solutionsjournalism.org/storytracker'
        await addClick(sessionId, 'placeholder--button', traditionalTitle, url)
        window.open(url, '_blank')
      }
    }
    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button className={'flex-grow-0 mt-auto'} onClick={handleClick}>
          <div className={'flex items-center h-10 bg-dark-grey px-3 py-4 rounded-full'}>
            <p className={'whitespace-nowrap text-white font-medium hover:underline decoration-2'}>
              {text}
            </p>
          </div>
        </button>
      </>
    )
  } else {
    return <></>
  }
}

interface ActionButtonProps {
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
