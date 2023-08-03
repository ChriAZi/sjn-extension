import { addParticipant, endSession, startSession } from '~util/firestore'

chrome.runtime.onInstalled.addListener(() => {
  (async () => {
    if (process.env.PLASMO_PUBLIC_LAB_STUDY === 'false') {
      const participantId = await addParticipant()
      await chrome.storage.local.set({ participantId })
    }
  })().catch(e => {
    console.error('error adding participant', e)
  })
})

chrome.runtime.onStartup.addListener(() => {
  (async () => {
    if (process.env.PLASMO_PUBLIC_LAB_STUDY === 'false') {
      const participantId = await chrome.storage.local.get('participantId')
      const sessionId = await chrome.storage.local.get('sessionId')
      if (sessionId.sessionId !== undefined) {
        await endSession(sessionId.sessionId)
      }
      const newSessionId = await startSession(participantId.participantId, 'prototype--field')
      await chrome.storage.local.set({ sessionId: newSessionId })
    }
  })().catch(e => {
    console.error('error starting session', e)
  })
})
