const express = require('express');
const appController = require('./controllers/appController');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine' , 'ejs');

app.use(express.static('./public'));

appController(app);
const port = 3000;
app.listen(port , () => console.log(`Server running at port ${port}...`));