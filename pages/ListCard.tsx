import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

const ListCard = ({ player }: any) => {
  if (!player) return null;

  return (
    <Paper
      key={player.summonerId}
      style={{
        padding: 10,
        marginBottom: 20,
        width: 600,
      }}
    >
      <Grid container alignItems="center">
        <Typography
          variant="h6"
          style={{ marginRight: 10, fontWeight: "bold", opacity: 0.75 }}
        >
          {player.place}.
        </Typography>
        {player.profilePic && (
          <Tooltip title={`Go to https://twitch.tv/${player.channelName}`}>
            <Grid style={{ padding: 0, margin: 0, maxHeight: 40 }}>
              <Image
                src={player.profilePic}
                alt="Profile Pic"
                height={40}
                width={40}
                className="profile-pic"
                onClick={() =>
                  window.open(
                    `https://twitch.tv/${player.channelName}`,
                    "_blank"
                  )
                }
              />
            </Grid>
          </Tooltip>
        )}

        <Grid
          container
          item
          xs
          style={{ marginLeft: 10 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={4} style={{ textAlign: "left" }}>
            <Typography variant="h6" className="text">
              {player.summonerName || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs style={{ textAlign: "center" }}>
            <Typography className="text">
              {player.tier ? `${player.tier} ${player.rank}` : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs style={{ textAlign: "center" }}>
            <Typography className="text">
              {player.leaguePoints ? `${player.leaguePoints} LP` : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs style={{ textAlign: "center" }}>
            <Typography className="text">
              {player.wins ? `${player.wins} Wins` : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ListCard;
