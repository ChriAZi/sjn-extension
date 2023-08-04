import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  increment,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.PLASMO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID
}

const firebase = initializeApp(firebaseConfig)
const firestore = getFirestore(firebase)

export async function addParticipant (): Promise<string | undefined> {
  try {
    const participantRef = await addDoc(collection(firestore, 'participants'), {
      sessions: []
    })
    return participantRef.id
  } catch (e) {
    console.error('Error adding participant: ', e)
  }
}

export async function startSession (participantId: string, condition: string): Promise<string | undefined> {
  try {
    const participantRef = doc(firestore, 'participants', participantId)
    const sessionRef = await addDoc(collection(firestore, 'sessions'),
      {
        participantId,
        condition,
        sessionStart: serverTimestamp()
      })
    const participantSnap = await getDoc(participantRef)
    if (participantSnap.exists()) {
      const sessions = participantSnap.get('sessions') ?? []
      await updateDoc(participantRef, {
        sessions: [...sessions, sessionRef.id]
      })
    } else {
      console.error('No such participant')
    }
    return sessionRef.id
  } catch (e) {
    console.error('Error starting session')
  }
}

export async function endSession (sessionId: string): Promise<void> {
  try {
    const sessionRef = doc(firestore, 'sessions', sessionId)
    await updateDoc(sessionRef, {
      sessionEnd: serverTimestamp()
    })
  } catch (e) {
    console.error('Error ending session: ', e)
  }
}

export async function updateViewportTime (componentId: string, time: number): Promise<void> {
  try {
    const componentRef = doc(firestore, 'components', componentId)
    const componentSnap = await getDoc(componentRef)
    if (componentSnap.exists()) {
      await updateDoc(componentRef, {
        viewportTime: increment(time)
      })
    } else {
      console.error('No such component')
    }
  } catch (e) {
    console.error('Error updating viewport time', e)
  }
}

export async function getViewportTime (componentId: string): Promise<number | undefined> {
  try {
    const componentRef = doc(firestore, 'components', componentId)
    const componentSnap = await getDoc(componentRef)
    if (componentSnap.exists()) {
      return componentSnap.get('viewportTime')
    } else {
      console.error('No such component')
    }
  } catch (e) {
    console.error('error getting viewport data', e)
  }
}

export async function getSessionId (): Promise<string> {
  let sessionId
  if (process.env.PLASMO_PUBLIC_LAB_STUDY === 'true') {
    sessionId = localStorage.getItem('sessionId')
  } else {
    sessionId = await chrome.storage.local.get('sessionId')
    sessionId = sessionId.sessionId
  }
  return sessionId
}

export async function addComponent (sessionId: string, type: string, traditionalTitle: string, url: string = '', sjTitle: string = ''): Promise<string | undefined> {
  try {
    const sessionRef = doc(firestore, 'sessions', sessionId)
    const componentRef = await addDoc(collection(firestore, 'components'), {
      type,
      sjTitle,
      traditionalTitle,
      url
    })
    const sessionSnap = await getDoc(sessionRef)
    if (sessionSnap.exists()) {
      const components = sessionSnap.get('components') ?? []
      await updateDoc(sessionRef, {
        components: [...components, componentRef.id]
      })
      return componentRef.id
    } else {
      console.error('No such session')
    }
  } catch (e) {
    console.error('Error getting component: ', e)
  }
}

export async function addClick (componentId: string, clickType: string): Promise<void> {
  try {
    const componentRef = doc(firestore, 'components', componentId)
    const componentSnap = await getDoc(componentRef)
    if (componentSnap.exists()) {
      const clicks = componentSnap.get('clicks') ?? []
      await updateDoc(componentRef, {
        clicks: [...clicks, clickType]
      })
    } else {
      console.error('No such component')
    }
  } catch (e) {
    console.error('Error adding click: ', e)
  }
}
