const express = require('express');
const app = require('./app'); // Import the app configuration

const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});