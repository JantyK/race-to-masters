import type { NextPage } from 'next'

import React, { useState } from 'react'

import Image from 'next/image'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

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

  // TODO: Sort the league entries.

  return {
    props: {
      leagueEntries: leagueEntries.map((entry, i) => {
        return {
          ...entry,
          place: i + 1,
        }
      }),
    },
    revalidate: 60,
  }
}

interface Props {
  leagueEntries: (LeagueEntry & { place: number })[]
}

const Home: NextPage<Props> = ({ leagueEntries }) => {
  const [players] = useState(leagueEntries);

  const getTrophy = (place: number) => {
    if(place === 1) {
      return '/gold-trophy.svg'
    }

    if(place === 2) {
      return '/silver-trophy.svg'
    }
    
    if(place === 3) {
      return '/bronze-trophy.svg'
    }

    return '/sadge.png'
  }

  return (
    <div className="App">
      <header className="App-header">
        <Grid container justifyContent="center" alignItems="center">
          <Image src={'/poggers.png'} alt="Poggers" width={40} height={40} />
          <Typography variant="h4" style={{ marginBottom: 20, fontWeight: "bold" }}>
            RACE TO MASTERS
          </Typography>
          <Image src={'/poggers.png'} alt="Poggers" width={40} height={40} />
        </Grid>

        {players && (
          players.map(player => (
            <Paper key={player.summonerId} style={{ padding: 10, marginBottom: 20 }}>
              <Grid container style={{ width: 600 }} alignItems="center">
                {player.place < 4 && <Image src={getTrophy(player.place)} alt="Trophy Icon" height={40} width={40} /> }
                {player.place >= 4 && <Image src={getTrophy(player.place)} alt="Trophy Icon" height={35} width={35} /> }
                <Grid container item xs style={{ marginLeft: 10 }} alignItems="center" justifyContent="space-between">
                  <Grid item xs style={{ textAlign: "left" }}>
                    <Typography variant="h6" style={{ fontWeight: "bold" }}>
                      {player.summonerName}
                    </Typography>
                  </Grid>
                    <Grid item xs>
                    <Typography style={{ fontWeight: "bold" }}>
                    {`${player.tier} ${player.rank}`}
                  </Typography> 
                    </Grid>
                    <Grid item xs>
                      <Typography style={{ fontWeight: "bold" }}>
                        {player.leaguePoints} LP
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography style={{ fontWeight: "bold" }}>
                        {player.wins} Wins
                      </Typography>
                    </Grid>
                </Grid>
              </Grid>
            </Paper>
          ))
        )}
      </header>
    </div>
  );
}

export default Home
