import app from "../app.js";
import config from "../config/config.js";
import Logging from "../Logging/logging.js";
import serverless from "serverless-http"

const port = config.server.port;

export default serverless(app)

// app.listen(port, () => {
//   Logging.info(`Server is running on http://localhost:${port}`);
// });
