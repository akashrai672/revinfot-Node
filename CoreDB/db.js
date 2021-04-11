const mongoose = require("mongoose");
class abc {
  constructor() {
    this.db();
  }
  db() {
    mongoose.connect(
      "mongodb://localhost:27017/revinfotech",
      { useNewUrlParser: true },
      () => {
        console.log("Database Connected.");
      }
    );
  }
}
module.exports = new abc();
