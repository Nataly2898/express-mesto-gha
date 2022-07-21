const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    default: "Исследователь океана",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
});

// Экспортируем модель
module.exports = mongoose.model("user", userSchema);
