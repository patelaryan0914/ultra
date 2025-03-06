const logger = require("../utils/logger");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const opportunityToSearchableString = (opportunity) => {
  let searchableString = "";
  const addField = (field, prefix = "", postfix = "\n\n") => {
    if (field) {
      if (Array.isArray(field)) {
        searchableString += `${prefix}${field.join(", ")}${postfix}`;
      } else {
        searchableString += `${prefix}${field}${postfix}`;
      }
    }
  };
  const fields = opportunity.fields;
  addField(fields["Entity Name"], "Entity Name: ");
  addField(fields["Name of Program"], "Program Name: ");
  addField(fields["Description:"], "Description: ");
  addField(fields["Type of Opportunity:"], "Type: ");
  addField(fields["Interest Area:"], "Interest Areas: ");
  addField(fields["Age:"], "Eligible Ages: ");
  addField(fields["Grade:"], "Eligible Grades: ");
  addField(fields["Mode:"], "Mode: ");
  addField(fields["Location:"], "Location: ");
  addField(fields["Address:"], "Address: ");
  addField(fields["Season:"], "Season: ");
  addField(fields["Application Deadline:"], "Application Deadline: ");
  addField(fields["Program Fee/Tuition:"], "Fee: ");
  addField(fields["This Opportunity is Only Open To:"], "Eligibility: ");
  addField(fields["Link to Application Page/Website "], "Apply Here: ");

  return searchableString.trim();
};

exports.scrapeData = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the page so cookies and session data are generated
    await page.goto("https://standoutsearch.pory.app/", {
      waitUntil: "networkidle2",
    });

    // Now, make the API call from the same context
    const data = await page.evaluate(async () => {
      const getRecordsByOffset = async (offset = null) => {
        return await fetch(
          `https://standoutsearch.pory.app/api/data/63b6cfb34a0e5f00084f2802/records${
            offset ? `?offset=${offset}` : ""
          }`,
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "x-pory-host": "standoutsearch.pory.app",
            },
          }
        );
      };
      const scrapeData = { records: [], offset: [] };
      let offset = null;
      do {
        const response = await getRecordsByOffset(offset);
        let data = await response.json();
        offset = data.offset;
        scrapeData.records.push(...data.records);
        scrapeData.offset.push(data.offset);
      } while (offset);
      return scrapeData;
    });
    await browser.close();
    fs.writeFile("data.json", JSON.stringify(data.records), (err) => {
      if (err) throw err;
    });
    res.status(200).json({ message: "Data scraped successfully" });
  } catch (error) {
    logger.error("Error scraping data:", error);
    res.status(500).send({ error: "Failed to scrape data" });
  }
};

exports.uploadToTrieve = async (req, res) => {
  try {
    const data = await fs.readFile("data.json", "utf-8");
    const opportunities = JSON.parse(data);

    const createChunkData = opportunities.map((opportunity) => ({
      chunk_html: opportunityToSearchableString(opportunity),
      link: opportunity["Link to Application Page/Website "] ?? "",
      tracking_id: opportunity["id"] ?? "",
      tag_set: [
        ...(opportunity["Interest Area:"] ?? []),
        ...(opportunity["Location:"] ?? []),
        ...(opportunity["Season:"] ?? []),
      ],
      metadata: {
        "Entity Name": opportunity["Entity Name"] ?? "Unknown",
        Type: (opportunity["Type of Opportunity:"] ?? []).join(", "),
        Deadline: opportunity["Application Deadline:"] ?? "Unknown",
      },
      time_stamp: opportunity["createdTime"] ?? null,
      upsert_by_tracking_id: true,
    }));

    const chunkSize = 50;
    const chunkedItems = [];
    for (let i = 0; i < createChunkData.length; i += chunkSize) {
      chunkedItems.push(createChunkData.slice(i, i + chunkSize));
    }

    for (const chunk of chunkedItems) {
      try {
        console.log(`Uploading chunk of ${chunk.length} items...`);

        const options = {
          method: "POST",
          headers: {
            "TR-Dataset": "ac856092-5022-4c25-8b9c-588cbb4a4de5",
            Authorization: "tr-O3PoJ9n6c4KAW9jPN1yDGZYWF5dFxbhW",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chunk),
        };

        const response = await fetch(
          "https://api.trieve.ai/api/chunk",
          options
        );
        const result = await response.json();

        if (!response.ok) {
          console.error(`Error uploading chunk:`, result);
        } else {
          console.log(`Chunk uploaded successfully!`);
        }
      } catch (error) {
        console.error(`Failed to upload chunk`, error);
      }
    }
    fs.unlink("data.json", (err) => {
      if (err) throw err;
    });
    res.status(200).json({ message: "Data uploaded successfully" });
  } catch (error) {
    logger.error("Error uploading data:", error);
    res.status(500).send({ error: "Failed to upload data" });
  }
};
