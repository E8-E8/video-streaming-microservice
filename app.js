const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.get("/video", (req, res) => {
  const range =   req.headers.range;
  const videoPath = "./video.mp4";
  const videoSize = fs.statSync(videoPath).size;
  const chunkSize = 1e+6;
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + chunkSize, videoSize - 1);

  const contentLength = end - start + 1;
  console.log(contentLength)

  const headers = {
    'Content-Range' : `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges' : "bytes",
    'Content-Length' : contentLength,
    'Content-Type' : "video/mp4"
  }
  res.writeHead(206, headers);
  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
  console.log("ok")
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
