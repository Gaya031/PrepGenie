require("dotenv").config()
const app = require("./src/app");
const connectToDB = require("./src/config/db");

app.listen(3000, async () => {
    await connectToDB();
    console.log("server is listening on port 3000");
})