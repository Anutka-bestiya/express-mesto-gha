const routerCards = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');
const { LINK_REGEX } = require('../utils/regex');

routerCards.get('/', getCards); // GET / cards — возвращает все карточки
routerCards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(LINK_REGEX),
  }),
}), createCard); // POST /cards — создаёт карточку
routerCards.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard); // DELETE /cards/:cardId — удаляет карточку по идентификатору
routerCards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), addLikeCard); // PUT /cards/:cardId/likes — поставить лайк карточке
routerCards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteLikeCard); // DELETE /cards/:cardId/likes — убрать лайк с карточки

module.exports = routerCards;
