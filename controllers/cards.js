// const path = require("path");
const Card = require('../models/card'); // данные
const {
  OK_STATUS_CODE,
  HTTP_CREATED_STATUS_CODE,
} = require('../utils/status_code');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

// Получение cards
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK_STATUS_CODE).send(cards))
    .catch(next);
};

// создание card
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id; // используем req.user
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_CREATED_STATUS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('При создании карточки переданы некорректные данные');
        // res.status(HTTP_BAD_REQUEST_STATUS_CODE).send({
      }
      next(err);
    });
};

// удаление card
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const someOwner = req.user._id; // используем req.user

  Card
    .findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Не найдена карточка с таким id');
      }
      const { owner: cardOwner } = card;

      if (cardOwner.valueOf() !== someOwner) {
        next(new UnauthorizedError('Карточку может удалить только ее автор'));
      }
      Card.findByIdAndRemove(cardId)
        .then((cardDel) => {
          res.status(OK_STATUS_CODE).send(cardDel);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('При попытке удаления карточки переданы некорректные данные'));
          } else { next(err); }
        });
    })
    .catch(next);
};

// Поставить лайк на card
const addLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id; // _id станет доступен
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Не найдена карточка с таким id');
      }
      res.status(OK_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('При попытке поставить лайк карточке переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// убрать лайк с card
const deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id; // _id станет доступен
  Card.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Не найдена карточка с таким id');
      }
      res.status(OK_STATUS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('При попытке убрать лайк карточки переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
