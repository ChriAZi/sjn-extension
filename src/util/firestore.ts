import { initializeApp } from 'firebase/app'
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
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
      await updateDoc(participantRef, {
        sessions: arrayUnion(sessionRef.id)
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

export async function addClick (sessionId: string, clickType: string, traditionalTitle: string = '', sjTitle: string = ''): Promise<void> {
  try {
    const sessionRef = doc(firestore, 'sessions', sessionId)
    const sessionSnap = await getDoc(sessionRef)
    if (sessionSnap.exists()) {
      const clicks = sessionSnap.get('clicks') ?? []
      await updateDoc(sessionRef, {
        clicks: [...clicks, {
          type: clickType,
          sjTitle,
          traditionalTitle
        }]
      })
    } else {
      console.error('No such session')
    }
  } catch (e) {
    console.error('Error adding click: ', e)
  }
}