const express = require("express");
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
const PORT = 4000 || process.env.PORT;
const {notFound,errorHandler} =require('./middleware/error');

dotenv.config();
connectDB().then(()=>{

	app.listen(PORT, () => {
		console.log(`Server listening on ${PORT}`);
	});

});


//routes
const userRoutes=require('./routes/user');
const taskRoutes=require('./routes/task');

app.use(express.json()); // to accept JSON Data
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>res.send('Hosted!'))

app.use('/api/user',userRoutes)
app.use('/api/tasks',taskRoutes)

//error handling for invalid routes
app.use(notFound);
app.use(errorHandler);