import admin, { firestore } from 'firebase-admin'
import environment from './environment'
import { LeagueEntry } from './riot'

if (admin.apps.length === 0) {
  admin.initializeApp(
    {
      credential: admin.credential.cert({
        clientEmail: environment.firebase.clientEmail,
        privateKey: environment.firebase.privateKey,
        projectId: environment.firebase.projectId,
      })
    }
  )
}

const db = admin.firestore()

interface LeaderboardEntry {
  id: string
  channelName: string
  summonerId?: string
  summonerName: string
  platform: "facebook" | "twitch"
  profilePic?: string
  lastLeagueEntry: LeagueEntry
}

export const getLeaderboardEntries = async (): Promise<LeaderboardEntry[]> => {
  const snapshot = await db.collection('leaderboard_entries').get()
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as LeaderboardEntry))
}

export const getLastRefreshTime = async (): Promise<Date> => {
  const snapshot = await db.collection('configuration').get()
  const timestamp = snapshot.docs[0].data().lastRefreshTime as firestore.Timestamp
  return timestamp.toDate()
}

export const updateLastRefreshTimeToNow = async (): Promise<void> => {
  const snapshot = await db.collection('configuration').get()
  await db.collection('configuration').doc(snapshot.docs[0].id).set({ lastRefreshTime: firestore.Timestamp.now() })
}

export const updateSummonerIdForLeaderboardEntry = async (id: string, summonerId: string): Promise<void> => {
  db.collection('leaderboard_entries').doc(id).update({
    summonerId
  })
}

export const updateLastLeagueEntryForLeaderboardEntry = async (id: string, lastLeagueEntry: any): Promise<void> => {
  db.collection('leaderboard_entries').doc(id).update({
    lastLeagueEntry
  })  
}