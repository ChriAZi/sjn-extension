import cssText from 'data-text:~style.css'
import { Analytics } from '~util/google-analytics'

export default function ActionButton ({
  error,
  placeholder,
  url
}: ActionButtonProps): JSX.Element {
  if (error !== undefined && error) {
    const text = 'Browse SJ-Articles'
    const handleClick = async (): Promise<void> => {
      await Analytics.fireEvent('button_clicked', { id: 'error--story-tracker' })
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
      if (url !== undefined) {
        await Analytics.fireEvent('button_clicked', { id: 'full-story' })
        window.open(url, '_blank')
      }
    }

    if (placeholder) {
      text = 'Browse SJ-Articles'
      handleClick = async (): Promise<void> => {
        await Analytics.fireEvent('button_clicked', { id: 'placeholder--story-tracker' })
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
  url: string | undefined
}

export function getStyle (): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}
