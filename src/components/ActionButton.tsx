import cssText from 'data-text:~style.css'
import { addClick } from '~util/firestore'

export default function ActionButton ({
  error,
  placeholder,
  title,
  traditionalTitle,
  url
}: ActionButtonProps): JSX.Element {
  if (error !== undefined && error) {
    const text = 'Browse SJ-Articles'
    const handleClick = async (): Promise<void> => {
      const sessionId = await getSessionId()
      await addClick(sessionId, 'error--button', traditionalTitle)
      window.open('https://www.solutionsjournalism.org/storytracker', '_blank')
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
        await addClick(sessionId, 'fullstory--button', traditionalTitle, title)
        window.open(url, '_blank')
      }
    }

    if (placeholder) {
      text = 'Browse SJ-Articles'
      handleClick = async (): Promise<void> => {
        const sessionId = await getSessionId()
        await addClick(sessionId, 'placeholder--button', traditionalTitle)
        window.open('https://www.solutionsjournalism.org/storytracker', '_blank')
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
  title: string | undefined
  traditionalTitle: string | undefined
  url: string | undefined
}

async function getSessionId (): Promise<string> {
  let sessionId
  if (process.env.PLASMO_PUBLIC_LAB_STUDY === 'true') {
    sessionId = localStorage.getItem('sessionId')
  } else {
    sessionId = await chrome.storage.local.get('sessionId')
    sessionId = sessionId.sessionId
  }
  return sessionId
}

export function getStyle (): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}
