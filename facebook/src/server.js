const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/page-stats', (req, res) => {
  const { pageId, since, until, period } = req.query;

  // Simulate data fetching from Facebook API
  const mockData = {
    total_followers: 1000,
    total_engagement: 2000,
    total_impressions: 3000,
    total_reactions: 4000
  };

  res.json(mockData); // Ensure JSON response
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
