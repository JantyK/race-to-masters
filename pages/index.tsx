import type { NextPage } from "next";

import React, { useState } from "react";

import Image from "next/image";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {
  getSummonerByName,
  getSummonerLeagueEntryBySummonerId,
  LeagueEntry,
  sortLeagueEntriesByRank,
} from "../utilities/riot";
import Card from "../components/Card";
import ListCard from "../components/ListCard";
import ListCardMobile from "../components/ListCardMobile";
import {
  getLastRefreshTime,
  getLeaderboardEntries,
  updateLastLeagueEntryForLeaderboardEntry,
  updateLastRefreshTimeToNow,
  updateSummonerIdForLeaderboardEntry,
} from "../utilities/firebase-admin";

const shouldRefresh = async () => {
  const lastRefreshTime = await getLastRefreshTime();
  const now = new Date();

  const MILLISECONDS_IN_MINUTE = 60000;
  return lastRefreshTime.getTime() + MILLISECONDS_IN_MINUTE < now.getTime();
};

export async function getServerSideProps() {
  const refresh = await shouldRefresh();

  let leagueEntries: any[] = [];
  const leaderboardEntries = await getLeaderboardEntries();

  const p1: Promise<{
    documentId: string;
    summonerId: string;
  }>[] = leaderboardEntries.map((entry) => {
    if (entry.summonerId) {
      return Promise.resolve({
        documentId: entry.id,
        summonerId: entry.summonerId,
      });
    }

    return new Promise(async (resolve) => {
      console.log(
        `Don't have ${entry.summonerName}'s summonerId. Fetching it...'`
      );
      const summoner = await getSummonerByName(entry.summonerName);
      await updateSummonerIdForLeaderboardEntry(entry.id, summoner.id);
      entry.summonerId = summoner.id;
      resolve({ documentId: entry.id, summonerId: summoner.id });
    });
  });

  const summoners = await Promise.all(p1);

  if (refresh) {
    console.log("It's been past a minute. Time to refresh...");
    const p2: Promise<LeagueEntry>[] = summoners.map((summoner) => {
      return new Promise(async (resolve) => {
        const leagueEntry = await getSummonerLeagueEntryBySummonerId(
          summoner.summonerId
        );
        await updateLastLeagueEntryForLeaderboardEntry(
          summoner.documentId,
          leagueEntry
        );
        resolve({ ...leagueEntry, summonerId: summoner.summonerId });
      });
    });

    leagueEntries = await Promise.all(p2);
    await updateLastRefreshTimeToNow();
  } else {
    leagueEntries = leaderboardEntries.map((entry) => ({
      ...entry.lastLeagueEntry,
      summonerId: entry.summonerId,
    }));
  }

  leagueEntries = sortLeagueEntriesByRank(leagueEntries);
  return {
    props: {
      leagueEntries: leagueEntries.map((entry, i) => {
        return {
          ...entry,
          place: i + 1,
          ...leaderboardEntries.find(
            (e) => e?.summonerId === entry?.summonerId
          ),
        };
      }),
    },
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

        <div
          style={{ overflow: "auto", padding: 10, width: "100%" }}
          className="hide-scrollbar"
        >
          {players.map((player) =>
            player.place <= 3 ? null : (
              <Grid item container justifyContent="center">
                <ListCard player={player} key={player.place} />
              </Grid>
            )
          )}
        </div>
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
