import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

const ListCardMobile = ({ player }: any) => {
  if (!player) return null;

  const gold = "#FFD700";
  const silver = "#C0C0C0";
  const bronze = "#cd7f32";

  let crown = null;
  let color = null;

  if (player.place === 1) {
    color = gold;
    crown = "/gold-crown.svg";
  }

  if (player.place === 2) {
    color = silver;
    crown = "/silver-crown.svg";
  }

  if (player.place === 3) {
    color = bronze;
    crown = "/bronze-crown.svg";
  }

  let baseUrl = "twitch.tv";
  if (player.platform !== "twitch") {
    baseUrl = `${player.platform}.com`;
  }

  const streamUrl = `https://${baseUrl}/${player.channelName}`;

  return (
    <Paper
      key={player.summonerId}
      style={{
        padding: 10,
        width: "100%",
        border: color ? `5px solid ${color}` : "none",
      }}
    >
      <Grid container>
        <Grid container item xs={4} alignItems="center">
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", opacity: 0.75, marginRight: 10 }}
          >
            {crown ? (
              <Image src={crown} alt="Crown" width={20} height={20} />
            ) : (
              `${player.place}.`
            )}
          </Typography>
          {player.profilePic && (
            <Tooltip title={`Go to ${streamUrl}`}>
              <Grid style={{ padding: 0, margin: 0, maxHeight: 60 }}>
                <Image
                  src={player.profilePic}
                  alt="Profile Pic"
                  height={60}
                  width={60}
                  className="profile-pic"
                  onClick={() => window.open(streamUrl, "_blank")}
                />
              </Grid>
            </Tooltip>
          )}
        </Grid>
        <Grid
          container
          item
          xs
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid
            container
            item
            xs={12}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" className="text">
              {player.summonerName || "N/A"}
            </Typography>
            <Typography className="text">
              {player.wins !== undefined ? (
                <>
                  {player.wins + player.losses} Games ({player.wins} Wins)
                </>
              ) : (
                "N/A"
              )}
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className="text">
              {player.tier !== undefined
                ? `${player.tier} ${player.rank}`
                : "N/A"}
            </Typography>
            <Typography className="text">
              {player.leaguePoints !== undefined
                ? `${player.leaguePoints} LP`
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ListCardMobile;
