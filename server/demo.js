const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

const BASE_URL =
  "https://standoutsearch.pory.app/api/data/63b6cfb34a0e5f00084f2802/records";

const HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
  Cookie:
    "__Host-next-auth.csrf-token=efe63b32280c0cd93f87ee6f6373ee177eb0b69896c11c6db7badad1658c9b1e%7Cd17ddec1f5625afb75b25011a5bba758f5d8e74946c65d19cd6a475c2e6b8611; __Secure-next-auth.callback-url=https%3A%2F%2Fstandoutsearch.pory.app; _gcl_au=1.1.523763814.1741239082; _ga=GA1.1.136061459.1741239082; _hjSessionUser_3332247=eyJpZCI6ImE4MDRiYTNhLTIyNjktNThiMy1iY2NhLTRkMjhhOGJhNjg3YSIsImNyZWF0ZWQiOjE3NDEyMzkwODM3MjIsImV4aXN0aW5nIjp0cnVlfQ==; _hjSession_3332247=eyJpZCI6IjQ3MDJkODljLTdiYTctNDEwMC05OTBmLTRmMjJiNzY1ZjQ5ZiIsImMiOjE3NDEyNDIwNjI2MzMsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=; _ga_2PLH6NK4ZK=GS1.1.1741242061.2.1.1741242750.0.0.0",
  Referer: "https://standoutsearch.pory.app/",
  "Sec-Ch-Ua": `"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"`,
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": "Windows",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
  "x-pory-host": "standoutsearch.pory.app",
};
const getRecordsByOffset = async (offset) => {
  return await axios.get(`${BASE_URL}?offset=${offset}`, { headers: HEADERS });
};
const data = [];
var offset = "";
app.get("/scrape", async (req, res) => {
  try {
    let response = await axios.get(BASE_URL, { headers: HEADERS });
    data.push(response.data.records);
    offset = response.data.offset;
    while (offset) {
      response = await getRecordsByOffset(response.data.offset);
      offset = response.data.offset;
      data.push(response.data.records);
      console.log(response.data.offset);
      if (response.data.offset === null) {
        break;
      }
    }
    console.log(data);

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: error.response?.data || "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
