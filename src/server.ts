import express from 'express';
import routes from './routes/index.js';
import db from './config/connection.js';

//connect to the db
await db();

const PORT = process.env.PORT || 3001;
const app = express();
 
//routes
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//import all the routes
app.use(routes);

//connect to the port
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
