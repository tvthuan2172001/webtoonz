import style from "./noresult.module.scss";
import { useTranslation } from "next-i18next";

export const SeeMoreNoResult = ({ message = ""}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={`${style["see-more-no-result"]}`}>
        <img src="assets/NoResult.svg" className={`${style["img"]}`} />
        {message === "" ? (
          <div className={`${style["text"]}`}>{t("common:noResult")}</div>
        ) : (
          <div className={`${style["text"]}`}>{message}</div>
        )}
      </div>
    </>
  );
};
