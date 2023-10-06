import cssText from 'data-text:~style.css'
import Skeleton from 'react-loading-skeleton'

/**
 * Renders the short description below the headline in the recommendation UI
 * @param error - shows a different UI if theres an error
 * @param placeholder - shows a placeholder if the recommendation is below the treshold
 * @param description - the descriptin to be shown
 * @constructor
 */
export default function Description ({
  error,
  placeholder,
  description
}: DescriptionProps): JSX.Element {
  if (error !== undefined && error) {
    const text = 'Seems like we ran into a problem. While we are fixing the issue, head over to the Solution Story Tracker® to browse the latest SJ-stories.'
    return <p className={'line-clamp-3 text-light-grey mt-4'}>{text}</p>
  } else if (placeholder !== undefined && description !== undefined) {
    let content = <p className={'line-clamp-3 text-light-grey'}>{description}</p>

    if (placeholder) {
      const text = 'We could not find a relevant Solutions Journalism story for this article. Head over to the Solution Story Tracker® to browse the latest SJ-stories.'
      content = <p className={'line-clamp-3 text-light-grey'}>{text}</p>
    }

    return content
  } else {
    return (
      <Skeleton count={3} containerClassName={'w-[85%]'} />
    )
  }
}

interface DescriptionProps {
  error: boolean | undefined
  placeholder: boolean | undefined
  description: string | undefined
}

export function getStyle (): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}
