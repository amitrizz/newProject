import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import EmployeeRoutes from "./routes/EmployeeRoutes.js";
import {readEmployees} from "./controllers/EmployeeDataController.js";
import {dirname} from "path";
import {fileURLToPath} from "url";
import path from "path";

const PORT = process.env.PORT || 5000;
const app = express();
// cors policy
app.use(cors());



// JSON 
app.use(express.json());//sort data into json format

app.use("/api/Employee", EmployeeRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

console.log(buildPath);
app.get('/', async(req,res)=>{
    // res.send('<h1>Welcome to the backend</h1>');
    res.sendFile(path.join(buildPath, "index.html"));
})
readEmployees();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


