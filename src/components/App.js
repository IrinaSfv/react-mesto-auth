import React from "react";
import { useEffect, useState } from 'react';
import api from "../utils/Api";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ConfirmPopup from "./ConfirmPopup";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deletedCard, setDeletedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [editSubmitTitle, setEditSubmitTitle] = useState("Сохранить");
  const [avatarSubmitTitle, setAvatarSubmitTitle] = useState("Обновить");
  const [addSubmitTitle, setAddSubmitTitle] = useState("Добавить");

  useEffect(() => {
    Promise.all([api.getUserData(), api.getInitialCards()])
      .then(([resUser, resCards]) => {
        setCurrentUser(resUser);
        setCards(resCards);
      })
      .catch(() => {
        console.log(`Ошибка при загрузке данных пользователя и карточек.`);
      });
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleDeleteCardClick(card) {
    setIsConfirmPopupOpen(true);
    setDeletedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmPopupOpen(false)
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    // Проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API
    if (isLiked) { //если лайк на карточке уже есть
      api.removeLike(card._id)
        .then((res) => { //получаем обновленный объект карточки
          setCards((state) =>
            state.map((c) => c._id === card._id ? res : c)
          );
        })
        .catch(() => {
          console.log(`Ошибка при удалении лайка.`)
        });
    } else { //если лайка на карточке нет
      api.setLike(card._id)
        .then((res) => { //получаем обновленный объект карточки
          setCards((state) =>
            state.map((c) => c._id === card._id ? res : c)
          );
        })
        .catch(() => {
          console.log(`Ошибка при постановке лайка.`)
        });
    }
  }

  function handleCardDelete() {
    api.deleteCard(deletedCard._id)
      .then(() => {
        setCards((state) =>
          state.filter((c) => c !== deletedCard)
        );
        closeAllPopups();
        console.log(`Карточка удалена.`)
      })
      .catch(() => {
        console.log(`Ошибка при удалении карточки.`)
      });
  }

  function handleUpdateUser(userData) {
    setEditSubmitTitle("Сохраняем...");
    const name = userData.name;
    const about = userData.about;
    api.editProfile(name, about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(() => {
        console.log(`Ошибка при обновлении данных.`)
      })
      .finally(() => {
        setEditSubmitTitle("Сохранить")
      });
  }

  function handleUpdateAvatar(avatarData) {
    setAvatarSubmitTitle("Обновляем...");
    api.changeAvatar(avatarData.avatar)
      .then((res) => { //получаем новый объект пользователя 
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(() => {
        console.log(`Ошибка при обновлении аватара.`)
      })
      .finally(() => {
        setAvatarSubmitTitle("Обновить")
      })
  }

  function handleAddPlaceSubmit(cardData) {
    setAddSubmitTitle("Добавляем...");
    const place = cardData.place;
    const pictureSrc = cardData.pictureSrc;
    api.addNewCard(place, pictureSrc)
      .then((newCard) => { //получаем объект новой карточки
        setCards([newCard, ...cards]);
        closeAllPopups();
        console.log(`Карточка добавлена.`)
      })
      .catch(() => {
        console.log(`Ошибка при добавлении карточки.`)
      })
      .finally(() => {
        setAddSubmitTitle("Добавить")
      })
  }

  function handleEscClose(e) {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  }

  function handleOverlay(e) {
    if (!e.target.closest('.popup__container')) {
      closeAllPopups();
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <>
        <Header />
        <Main
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleDeleteCardClick}
          cards={cards}
        />
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          submitTitle={editSubmitTitle}
          onEscClick={handleEscClose}
          onOverlayClick={handleOverlay}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          submitTitle={addSubmitTitle}
          onEscClick={handleEscClose}
          onOverlayClick={handleOverlay}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          submitTitle={avatarSubmitTitle}
          onEscClick={handleEscClose}
          onOverlayClick={handleOverlay}
        />
        <ImagePopup
          type="picture-popup"
          card={selectedCard}
          onClose={closeAllPopups}
          onEscClick={handleEscClose}
          onOverlayClick={handleOverlay}
        />
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onConfirm={handleCardDelete}
          onEscClick={handleEscClose}
          onOverlayClick={handleOverlay}
        />
      </>
    </CurrentUserContext.Provider>
  );
}

export default App;
