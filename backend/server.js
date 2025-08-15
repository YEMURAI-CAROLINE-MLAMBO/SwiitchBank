const express = require('express');
const { initDatabase, seedDatabase } = require('./src/config/setup');
const app = require('./src/app');

// Initialize in-memory database
initDatabase();
seedDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SwiitchBank API running on port ${PORT}`);
  console.log('Using in-memory database');
  console.log('Data will reset on server restart');
});