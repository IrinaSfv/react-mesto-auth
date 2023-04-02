import React from "react";
import headerLogo from '../images/Header_Logo.svg';
import { Link, useLocation } from "react-router-dom";

function Header({onSignOut, userEmail}) {
  const currentLocation = useLocation().pathname;

  return (
    <header className="header">
      <div className="header__container">
        <img className="header__logo" src={headerLogo} alt="Логотип" />
        {currentLocation == "/sign-up" && (
          <Link to="/sign-in" className="header__link">
            Войти
          </Link>
        )}
        {currentLocation == "/sign-in" && (
          <Link to="/sign-up" className="header__link">
            Регистрация
          </Link>
        )}
        {currentLocation == "/" && (
          <div className="header__info">
            <p className="header__email">{userEmail}</p>
            <Link to="/sign-in" className="header__exit" onClick={onSignOut}>
              Выйти
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;