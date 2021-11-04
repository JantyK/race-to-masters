import type { NextPage } from "next";

import React, { useState } from "react";

import Image from "next/image";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import environment from "../utilities/environment";
import {
  getSummonerByName,
  getSummonerLeagueEntryBySummonerId,
  LeagueEntry,
  sortLeagueEntriesByRank,
} from "../utilities/riot";
import Card from "../components/Card";
import ListCard from "../components/ListCard";
import ListCardMobile from "../components/ListCardMobile";

export async function getStaticProps() {
  const p1 = environment.leaderboardEntries.map((entry) => {
    return getSummonerByName(entry.summonerName);
  });

  const summoners = await Promise.all(p1);

  const p2 = summoners.map((summoner) => {
    return getSummonerLeagueEntryBySummonerId(summoner.id, summoner.name);
  });

  let leagueEntries = await Promise.all(p2);
  leagueEntries = sortLeagueEntriesByRank(leagueEntries);

  return {
    props: {
      leagueEntries: leagueEntries.map((entry, i) => {
        return {
          ...entry,
          place: i + 1,
          ...environment.leaderboardEntries.find(
            (e) => e?.summonerName === entry?.summonerName
          ),
        };
      }),
    },
    revalidate: 60,
  };
}

interface Props {
  leagueEntries: (LeagueEntry & {
    place: number;
    profilePic?: string;
    channelName: string;
  })[];
}


const Home: NextPage<Props> = ({ leagueEntries }) => {
  const [players] = useState(leagueEntries || []);

  return (
    <div className="App">
      <header className="App-header-desktop">
        <Grid container justifyContent="center" alignItems="center">
          <Image
            src={"/poggers.png"}
            alt="Poggers"
            width={40}
            height={40}
            className="poggers-left"
          />
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", margin: "10px 10px 0px 10px" }}
          >
            RACE TO MASTERS
          </Typography>
          <Image src={"/poggers.png"} alt="Poggers" width={40} height={40} />
        </Grid>
        {players && (
          <Grid
            container
            justifyContent="center"
            spacing={2}
            style={{ marginBottom: 20, marginTop: 10 }}
          >
            <Card player={players[1]} />
            <Card player={players[0]} />
            <Card player={players[2]} />
          </Grid>
        )}

        <Grid
          container
          style={{ overflow: "auto", padding: 10 }}
          direction="column"
          alignItems="center"
        >
          {players.map((player) =>
            player.place <= 3 ? null : (
              <Grid item xs={3} key={player.place}>
                <ListCard player={player} />
              </Grid>
            )
          )}
        </Grid>
      </header>
      <header className="App-header-mobile">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ marginBottom: 10 }}
        >
          <Image
            src={"/poggers.png"}
            alt="Poggers"
            width={40}
            height={40}
            className="poggers-left"
          />
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", margin: "10px 10px 0px 10px" }}
          >
            RACE TO MASTERS
          </Typography>
          <Image src={"/poggers.png"} alt="Poggers" width={40} height={40} />
        </Grid>
        {players.map((player) => (
          <Grid container style={{ padding: 10 }} key={player.place}>
            <ListCardMobile player={player} />
          </Grid>
        ))}
      </header>
    </div>
  );
};

export default Home;
