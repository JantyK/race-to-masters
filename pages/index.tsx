import type { NextPage } from 'next'
import environment from '../utilities/environment'
import { getSummonerByName, getSummonerLeagueEntryBySummonerId, LeagueEntry } from '../utilities/riot'

export async function getStaticProps() {
  const p1 = environment.leaderboardEntries.map((entry) => {
    return getSummonerByName(entry.summonerName)
  })

  const summoners = await Promise.all(p1)
  
  const p2 = summoners.map((summoner) => {
    return getSummonerLeagueEntryBySummonerId(summoner.id)
  })

  const leagueEntries = await Promise.all(p2)

  return {
    props: {
      leagueEntries,
    },
    revalidate: 60,
  }
}

interface Props {
  leagueEntries: LeagueEntry[]
}

const Home: NextPage<Props> = ({ leagueEntries }) => {
  return (
    <div>
      {
        leagueEntries.map((entry: LeagueEntry) => (
          <p key={entry.summonerId}>{entry.summonerId} - {entry.summonerName}</p>
          )
        )
      }
    </div>
  )
}

export default Home
