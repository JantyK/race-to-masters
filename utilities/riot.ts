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

export const sortLeagueEntriesByRank = (entries: LeagueEntry[]): LeagueEntry[] => { 
  return entries.sort((e1, e2) => {
    return convertTierAndRankToNumber(e2.tier, e2.rank, e2.leaguePoints) - convertTierAndRankToNumber(e1.tier, e1.rank, e1.leaguePoints)
  })
}

export const convertTierAndRankToNumber = (tier: string, rank: string, leaguePoints: number): number => {
  let tierNumber = 0
  switch (tier) {
    case "IRON": 
      tierNumber = 0
      break
    case "BRONZE": 
      tierNumber = 1
      break
    case "SILVER": 
      tierNumber = 2
      break
    case "GOLD": 
      tierNumber = 3
      break
    case "PLATINUM": 
      tierNumber = 4
      break
    case "DIAMOND": 
      tierNumber = 5
      break
    case "MASTER": 
      tierNumber = 6
      break
    case "GRANDMASTER": 
      tierNumber = 7
      break             
  }

  let rankNumber = 0

  switch (rank) {
    case "I": 
      rankNumber = 4
      break
    case "II": 
      rankNumber = 3
      break
    case "III": 
      rankNumber = 2
      break
    case "IV": 
      rankNumber = 1
      break
  }

  return tierNumber * 10000 + rankNumber * 1000 + leaguePoints
}