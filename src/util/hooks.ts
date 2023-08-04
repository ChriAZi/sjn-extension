import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { getViewportTime, updateViewportTime } from '~util/firestore'

function useComponentInViewport (componentId: string | undefined, ref: React.RefObject<HTMLElement>): void {
  const [viewportTime, setViewportTime] = useState<number>(0)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (ref.current == null || componentId === undefined) return

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Component is in the viewport
            setViewportTime((prevState) => {
              return prevState + entry.time
            })
          }
        })
      },
      {
        threshold: 0.75
      }
    )

    observer.current.observe(ref.current)

    return () => {
      if (observer.current != null) {
        observer.current.disconnect()
        observer.current = null
      }
    }
  }, [ref, componentId])

  useEffect(() => {
    (async () => {
      if (componentId !== undefined) {
        await updateViewportTime(componentId, viewportTime)
      }
    })().catch(e => {
      console.error('error updating viewport data ', e)
    })
  }, [viewportTime])

  useEffect(() => {
    (async () => {
      if (componentId !== undefined) {
        const prevViewportTime = await getViewportTime(componentId)
        if (prevViewportTime !== undefined) {
          setViewportTime(prevViewportTime)
        }
      }
    })().catch(e => {
      console.error('Error getting previous viewport time', e)
    })
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (): void => {
      (async () => {
        if (observer.current !== null && ref.current !== null && componentId !== undefined) {
          const entries = observer.current.takeRecords()
          const lastEntry = entries.find((entry) => entry.target === ref.current)
          if ((lastEntry?.isIntersecting) ?? false) {
            if (lastEntry !== undefined) {
              setViewportTime((prevState) => prevState + lastEntry.time)
              await updateViewportTime(componentId, viewportTime + lastEntry.time)
            }
          }
        }
      })().catch(e => {
        console.error('Error storing last state of viewportime', e)
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [ref, componentId, viewportTime])
}

export default useComponentInViewport
