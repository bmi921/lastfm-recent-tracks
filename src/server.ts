import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

app.use(cors());

type track = {
  artist: any;
  name: any;
  album: any;
  image: any;
  url: any;
  date: any;
};

app.get("/api/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { limit = "10" } = req.query;

    const response = await axios.get("https://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "user.getrecenttracks",
        user: username,
        api_key: LASTFM_API_KEY,
        format: "json",
        limit,
      },
    });

    const tracks = response.data.recenttracks.track.map((track: track) => ({
      artist: track.artist["#text"],
      name: track.name,
      album: track.album?.["#text"],
      image: track.image.find(
        (img: { size: string }) => img.size === "extralarge"
      )?.["#text"],
      url: track.url,
      date: track.date?.["#text"],
    }));

    res.send(`
<!DOCTYPE html>
<html>
  <head>
    <title>Recently Played Tracks</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue.css"
    />
    <script src="https://cdn.tailwindcss.com"></script>
    <style></style>
  </head>
  <body class="font-sans m-0 p-0">
            ${tracks
              .map(
                (track: track) => `
              <div class="flex gap-2 mt-2">
        <img
          src=${track.image}
          class="w-16 h-16 rounded object-cover"
          alt="album cover"
        />
        <div class="flex flex-col justify-evenly">
          <div class="font-semibold truncate truncate w-[300px]">
            ${track.name}
          </div>
          <div class="flex gap-2  truncate w-[300px]">
            <div class="text-gray-900 text-sm truncate">
              ${track.artist}
            </div>
            <div class="text-gray-500 text-sm truncate">
              /
            </div>
            <div class="text-gray-500 text-sm truncate">
              ${track.album}
            </div>
          </div>
        </div>
      </div>
            `
              )
              .join("")}
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.log(error);
    res.status(500).send(`
      <div>
        Failed to load recent tracks. Please try again later.
      </div>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api/bmi921`);
});
