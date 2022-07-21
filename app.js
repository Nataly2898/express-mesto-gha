const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// Подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/", router); // запускаем

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

// Временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: "62d83205cfe30588eaf8c4ea",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
