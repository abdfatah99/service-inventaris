import app from "./app.js";
import config from "./config/config.js";
import Logging from "./Logging/logging.js";

const port = config.server.port;

app.listen(port, () => {
  Logging.info(`Server is running on http://localhost:${port}`);
});
