import Database from "./database.js";

// Создаем таблицу
const container = document.getElementById('cards-container');
const template = document.getElementById('card-template');

// Заполняем таблицу данными из словаря
for (const word in Database.data) {
  const clone = template.content.cloneNode(true);
  clone.querySelector('.word').textContent = word;
  clone.querySelector('.translation').textContent = Database.data[word];
  clone.querySelector('.progress').style.width = `${100 - Database.getModifier(word) * 10}%`;

  document.getElementById('cards-container').appendChild(clone);
}

// JavaScript для открытия и закрытия модального окна
const modal = document.getElementById("myModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const deleteBtn = document.getElementById("deleteBtn");
const modalTitle = document.getElementById("modalTitle");
const wordForm = document.getElementById("wordForm");
const newWordInput = document.getElementById("newWord");
const newTranslationInput = document.getElementById("newTranslation");

// Переменная для хранения редактируемой карточки (если null — режим добавления)
let currentCard = null;

// Открытие модального окна для добавления нового слова
openBtn.addEventListener("click", function(e) {
  e.preventDefault();
  currentCard = null;
  modalTitle.textContent = "Добавить слово";
  wordForm.reset();
  deleteBtn.style.display = "none"; // в режиме добавления кнопка "Удалить" не нужна
  modal.style.display = "block";
});

// Открытие модального окна при клике на карточку (режим редактирования)
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener("click", function() {
    currentCard = card;
    const wordText = card.querySelector(".word").textContent;
    const translationText = card.querySelector(".translation").textContent;
    newWordInput.value = wordText;
    newTranslationInput.value = translationText;
    modalTitle.textContent = "Редактировать слово";
    deleteBtn.style.display = "block"; // показываем кнопку удаления
    modal.style.display = "block";
  });
});

// Закрытие модального окна по клику на крестик или вне окна
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Обработка отправки формы (сохранение изменений)
wordForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const wordValue = newWordInput.value.trim();
  const translationValue = newTranslationInput.value.trim();
  if (!wordValue || !translationValue) return;
  if (currentCard) {
    // Режим редактирования: обновляем содержимое карточки
    currentCard.querySelector(".word").textContent = wordValue;
    currentCard.querySelector(".translation").textContent = translationValue;
  } else {
    // Режим добавления: создаём новую карточку
    const cardsContainer = document.querySelector(".cards-container");
    const newCard = template.content.cloneNode(true).querySelector('.card');
    newCard.querySelector('.word').textContent = wordValue;
    newCard.querySelector('.translation').textContent = translationValue;
    // Добавляем обработчик клика для новой карточки
    newCard.addEventListener("click", function() {
      currentCard = newCard;
      newWordInput.value = newCard.querySelector(".word").textContent;
      newTranslationInput.value = newCard.querySelector(".translation").textContent;
      modalTitle.textContent = "Редактировать слово";
      deleteBtn.style.display = "block";
      modal.style.display = "block";
    });
    cardsContainer.appendChild(newCard);
  }
  modal.style.display = "none";
});

// Обработка кнопки удаления
deleteBtn.addEventListener("click", function() {
  if (currentCard) {
    currentCard.remove();
    modal.style.display = "none";
  }
});