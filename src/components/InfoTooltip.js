import React from "react";
import SuccessImgSrc from "../images/Info_Success.svg";
import FailImgSrc from "../images/Info_Fail.svg";

function InfoTooltip({ isOpen, onClose, isSuccessReg, onEscClick, onOverlayClick }) {
    return (
        <div className={`popup info-tooltip-popup ${isOpen && "popup_opened"}`} onKeyDown={onEscClick} onClick={onOverlayClick}>
            <div className={`popup__container info-tooltip-popup__container`}>
                <button className={`popup__close-button info-tooltip-popup__close-button`} type="button" aria-label="Кнопка закрытия данного попапа" onClick={onClose}></button>
                <img 
                    className="info-tooltip-popup__image"
                    src={isSuccessReg ? SuccessImgSrc : FailImgSrc}
                    alt={
                        isSuccessReg
                            ? "Успешная регистрация"
                            : "Регистрация не удалась"
                    }
                />
                <h2 className={`popup__title info-tooltip-popup__title`}>
                    {
                        isSuccessReg
                            ? "Вы успешно зарегестрировались!"
                            : "Что-то пошло не так! Попробуйте ещё раз."
                    }
                </h2>
            </div>
        </div>
    );
}

export default InfoTooltip;