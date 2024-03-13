const express = require('express');
const app = express();
const port = 3001; // Utilisez un port différent de celui du frontend

app.get('/api', (req, res) => {
	res.send('API is working');
});

app.listen(port, () => {
	console.log(`Backend running on http://localhost:${port}`);
});
