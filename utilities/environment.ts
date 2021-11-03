interface LeaderboardEntry {
  channelName: string;
  summonerName: string;
  platform: "facebook" | "twitch";
  profilePic?: string;
}

const getValue = (key: string): string => {
  console.log(process.env);
  const value = process.env[key];
  if (!value)
    throw new Error(
      `Environment variable ${key} is not defined. Did you setup your environment variables correctly?`
    );
  return value;
};

const leaderboardEntriesString = getValue("LEADERBOARD_ENTRIES");
let leaderboardEntries: LeaderboardEntry[] = [];

try {
  leaderboardEntries = JSON.parse(
    leaderboardEntriesString
  ) as LeaderboardEntry[];
} catch (error) {
  console.error(error);
}

const environment = {
  riotToken: getValue("RIOT_TOKEN"),
  leaderboardEntries,
};

export default environment;
