const routerCards = require('express').Router(); // создали роутер
// const path = require("path");
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

routerCards.get('/', getCards); // GET / cards — возвращает все карточки
routerCards.post('/', createCard); // POST /cards — создаёт карточку
routerCards.delete('/:cardId', deleteCard); // DELETE /cards/:cardId — удаляет карточку по идентификатору
routerCards.put('/:cardId/likes', addLikeCard); // PUT /cards/:cardId/likes — поставить лайк карточке
routerCards.delete('/:cardId/likes', deleteLikeCard); // DELETE /cards/:cardId/likes — убрать лайк с карточки

module.exports = routerCards;
