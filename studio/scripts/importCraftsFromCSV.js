// Usage: SANITY_API_TOKEN=your_token npx sanity exec scripts/importCraftsFromCSV.js --with-user-token
// This script reads crafts.csv and creates 'craft' documents in Sanity.

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { getCliClient } = require('sanity/cli');

const client = getCliClient();
const csvPath = path.join(__dirname, 'crafts.csv');

const csvContent = fs.readFileSync(csvPath, 'utf8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

async function importCrafts() {
  if (records.length === 0) {
    console.log('No crafts found in CSV.');
    return;
  }
  for (const row of records) {
    const doc = {
      _type: 'craft',
      title: row['Craft Name'],
      briefDescription: row['Brief Description'],
      description: row['Description'],
      // Add more fields if needed
    };
    try {
      // Try to find an existing craft by title
      const existing = await client.fetch(
        '*[_type == "craft" && title == $title][0]',
        { title: doc.title }
      );
      if (existing) {
        // Update the existing document
        const res = await client.patch(existing._id).set(doc).commit();
        console.log(`Updated craft: ${res.title}`);
      } else {
        // Create a new document
        const res = await client.create(doc);
        console.log(`Created craft: ${res.title}`);
      }
    } catch (err) {
      console.error(`Failed to upsert craft "${doc.title}":`, err.message);
    }
  }
}

importCrafts();
