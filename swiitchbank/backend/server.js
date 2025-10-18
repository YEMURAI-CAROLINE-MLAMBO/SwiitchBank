import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({status: 'OK'}));
app.listen(3000, () => console.log('Server running'));