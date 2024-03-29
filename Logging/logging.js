// use to decoreate Logging to make it interactive
import chalk from "chalk";

export default class Logging {
  static log = (args) => {
    this.info(args);
  };
  static info = (args) => {
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.blueBright(args) : args
    );
  };
  static warn = (args) => {
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );
  };
  static error = (args) => {
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.redBright(args) : args
    );
  };
}
