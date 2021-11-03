import Environment from './environment'

export interface Summoner {
  accountId: string
  profileIconId: number
  revisionDate: number
  name: string
  id: string
  puuid: string
  summonerLevel: number
}

export interface LeagueEntry {
  leagueId: string
  summonerId: string
  summonerName: string
  queueType: string
  ratedTier: string
  ratedRating: number
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number
  hotStreak: boolean
  veteran: boolean
  freshBlood: boolean
  inactive: boolean
}

const RIOT_ORIGIN = "https://na1.api.riotgames.com";

export const getSummonerByName = async (name: string): Promise<Summoner>  => {
  console.log(`Attempting to fetch summoner data for summer ${name}.`)
  const response = await fetch(`${RIOT_ORIGIN}/tft/summoner/v1/summoners/by-name/${name}`, {
    headers: { 'X-Riot-Token': Environment.riotToken }
  })

  if (response.status === 200) {
    return response.json() as unknown as Summoner
  }

  throw new Error(`Error getting summoner data. Riot returned a ${response.status} code.`)
}

export const getSummonerLeagueEntryBySummonerId = async (summonerId: string): Promise<LeagueEntry> => {
  console.log(`Attempting to fetch league entry for summoner ${summonerId}.`)
  const response = await fetch(`${RIOT_ORIGIN}/tft/league/v1/entries/by-summoner/${summonerId}`, {
    headers: { 'X-Riot-Token': Environment.riotToken }
  })

  if (response.status === 200) {
    const entries = await response.json() as unknown as LeagueEntry[]
    return entries[0]
  }

  throw new Error(`Error getting league entry data. Riot returned a ${response.status} code.`)
}