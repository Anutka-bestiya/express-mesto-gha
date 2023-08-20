// const path = require("path");
const Card = require('../models/card'); // данные
const {
  OK_STATUS_CODE,
  HTTP_CREATED_STATUS_CODE,
  HTTP_BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_PAGE_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');

// Получение cards
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_STATUS_CODE).send(cards))
    .catch(() => {
      res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Произошла ошибка на сервере при запросе карточек' });
    });
};

// создание card
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // _id станет доступен
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_CREATED_STATUS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message: 'При создании карточки переданы некорректные данные',
        });
      } else {
        res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: 'Произошла ошибка создания карты на сервере' });
      }
    });
};

// удаление card
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Не найдена карточка с таким id' });
        return;
      }
      res.status(OK_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message: 'При попытке удаления карточки переданы некорректные данные',
        });
      } else {
        res.status(SERVER_ERROR_STATUS_CODE).send({
          message: 'Произошла ошибка на сервере при удалении карточки',
        });
      }
    });
};

// Поставить лайк на card
const addLikeCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id; // _id станет доступен
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Не найдена карточка с таким id' });
        return;
      }
      res.status(OK_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Не найдена карточка с таким id' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message:
            'При попытке поставить лайк карточке переданы некорректные данные',
        });
      }
      return res.status(SERVER_ERROR_STATUS_CODE).send({
        message:
          'Произошла ошибка на сервере при постановке лайка этой карточки',
      });
    });
};

// убрать лайк с card
const deleteLikeCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id; // _id станет доступен
  Card.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Не найдена карточка с таким id' });
        return;
      }
      res.status(OK_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res
          .status(NOT_FOUND_PAGE_STATUS_CODE)
          .send({ message: 'Не найдена карточка с таким id' });
      }
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
          message:
            'При попытке убрать лайк карточки переданы некорректные данные',
        });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: 'Произошла ошибка при удалении лайка этой карточки' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};