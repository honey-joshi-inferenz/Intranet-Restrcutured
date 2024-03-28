require("dotenv").config();
const { API_PORT } = process.env;
const PORT = process.env.PORT || API_PORT;
const server = require("./src/server");

server.listen(PORT, (error) => {
  if (error) {
    console.log(`Error occured while configuring server on port: ${PORT}!!`);
    return;
  }
  console.log(`Server is listening on port: ${PORT}`);
});
