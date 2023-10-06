import cssText from 'data-text:~style.css'
import { addClick } from '~util/firestore'
import { useContext } from 'react'
import { ComponentIdContext } from '~util/ComponentIdContext'

/**
 * Renders the ActionButton component in the bottom right corner of the recommenation UI
 * @param error - shows a different UI if theres an error
 * @param placeholder - shows a placeholder if the recommendation is below the treshold
 * @param url - the url to navigate to when clicking the button
 * @constructor
 */
export default function ActionButton ({
  error,
  placeholder,
  url
}: ActionButtonProps): JSX.Element {
  const componentId = useContext(ComponentIdContext)

  if (error !== undefined && error) {
    const text = 'Browse SJ-Articles'
    const handleClick = async (): Promise<void> => {
      if (componentId !== undefined) {
        await addClick(componentId, 'error--button')
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
  } else if (placeholder !== undefined && url !== undefined) {
    let text = 'Read Full Story'
    let handleClick = async (): Promise<void> => {
      if (url !== undefined) {
        if (componentId !== undefined) {
          await addClick(componentId, 'sj--button')
          window.open(url, '_blank')
        }
      }
    }

    if (placeholder) {
      text = 'Browse SJ-Articles'
      handleClick = async (): Promise<void> => {
        if (componentId !== undefined) {
          await addClick(componentId, 'placeholder--button')
          window.open('https://www.solutionsjournalism.org/storytracker', '_blank')
        }
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
  url: string | undefined
}

export function getStyle (): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}
