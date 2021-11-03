import type { NextPage } from "next";

import React, { useState } from "react";

import Image from "next/image";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import environment from "../utilities/environment";
import {
  getSummonerByName,
  getSummonerLeagueEntryBySummonerId,
  LeagueEntry,
  sortLeagueEntriesByRank,
} from "../utilities/riot";
import Card from "./Card";
import ListCard from "./ListCard";

export async function getStaticProps() {
  const p1 = environment.leaderboardEntries.map((entry) => {
    return getSummonerByName(entry.summonerName);
  });

  const summoners = await Promise.all(p1);

  const p2 = summoners.map((summoner) => {
    return getSummonerLeagueEntryBySummonerId(summoner.id);
  });

  let leagueEntries = await Promise.all(p2);
  leagueEntries = sortLeagueEntriesByRank(leagueEntries);

  // TODO: Add twitch usernames to response.
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
      <header className="App-header">
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

        <div style={{ overflow: "auto", padding: 10 }}>
          {players.map((player) =>
            player.place <= 3 ? null : <ListCard player={player} />
          )}
        </div>
      </header>
    </div>
  );
};

export default Home;
