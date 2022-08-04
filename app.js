const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { validateSignup, validateSignIn } = require('./middlewares/validators');
const { createUser, login } = require('./controllers/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', router); // запускаем

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cors());

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);

// Роуты, которым нужна авторизация
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

// Обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// Централизованный обработчик
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

/* eslint-disable no-console */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
