import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

const Card = ({ player }: any) => {
  const gold = "#FFD700";
  const silver = "#C0C0C0";
  const bronze = "#cd7f32";
  let crown = "/gold-crown.svg";

  let color = gold;

  if (player.place === 2) {
    color = silver;
    crown = "/silver-crown.svg";
  }

  if (player.place === 3) {
    color = bronze;
    crown = "/bronze-crown.svg";
  }

  return (
    <Grid item style={{ marginTop: player.place > 1 ? 20 : 0 }}>
      <Image src={crown} alt="Poggers" width={60} height={60} />
      <Paper
        style={{
          width: 200,
          padding: 10,
          border: `5px solid ${color}`,
        }}
      >
        {player.profilePic && (
          <Tooltip title={`Go to https://twitch.tv/${player.channelName}`}>
            <Grid>
              <Image
                src={player.profilePic}
                alt="Profile Pic"
                height={50}
                width={50}
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
          direction="column"
          item
          xs
          alignItems="center"
          justifyContent="center"
        >
          <Grid container justifyContent="center">
            <Typography variant="h5" className="text">
              {player.summonerName}
            </Typography>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            style={{ marginTop: 10 }}
          >
            <Typography className="text">Rank:</Typography>
            <Typography className="text">
              {`${player.tier} ${player.rank}`}
            </Typography>
          </Grid>
          <Grid container justifyContent="space-between">
            <Typography className="text">LP:</Typography>
            <Typography className="text">{player.leaguePoints} LP</Typography>
          </Grid>
          <Grid container justifyContent="space-between">
            <Typography className="text">Wins:</Typography>
            <Typography className="text">{player.wins}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Card;
