import cssText from 'data-text:~style.css'

export default function ActionButton ({
  error,
  placeholder,
  url
}: ActionButtonProps): JSX.Element {
  if (error !== undefined && error) {
    const text = 'Browse SJ-Articles'
    const handleClick = (): void => {
      window.open('https://www.solutionsjournalism.org/storytracker', '_blank')
    }

    return (
      <>
        <button
          className={'flex-grow-0 mt-auto mt-4'}
          onClick={handleClick}>
          <div className={'flex items-center h-10 bg-dark-grey px-3 py-4 rounded-full'}>
            <p
              className={'whitespace-nowrap text-white font-medium'}>
              {text}
            </p>
          </div>
        </button>
      </>
    )
  } else if (placeholder !== undefined && url !== undefined) {
    let text = 'Read Full Story'
    let handleClick = (): void => {
      if (url !== undefined) {
        window.open(url, '_blank')
      }
    }

    if (placeholder) {
      text = 'Browse SJ-Articles'
      handleClick = (): void => {
        window.open('https://www.solutionsjournalism.org/storytracker', '_blank')
      }
    }
    return (
      <>
        <button
          className={'flex-grow-0 mt-auto'}
          onClick={handleClick}>
          <div className={'flex items-center h-10 bg-dark-grey px-3 py-4 rounded-full'}>
            <p
              className={'whitespace-nowrap text-white font-medium'}>
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
