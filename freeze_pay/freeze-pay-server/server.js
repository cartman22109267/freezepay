require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

app.use('/auth',    require('./src/routes/auth'));
app.use('/payment', require('./src/routes/payment'));
app.use('/user',    require('./src/routes/user'));
app.use('/ai',      require('./src/routes/ai'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
