import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { convertLongString } from "src/utils/common-function";
import { GetUserInfo } from "../../api/user";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
// import { RequireLoginModal } from "@components/modal/RequireLoginModal";
// import EpisodeManagementAPI from "../../api/episode-management/episode-management";
import style from "./product-item.module.scss";

export const EpisodeProduct = ({ serieId, episode }) => {
  const { t } = useTranslation();

  const {
    isNewRelease,
    remainEdition,
    name,
    price,
    isLocked,
    thumbnail,
    // currency,
    // totalLikes,
    // isFavoriting,
  } = episode;

  const router = useRouter();

  // const [favorite, setFavorite] = useState(isFavoriting);

  const [modalVisible, setModalVisible] = useState(false);

  const userInfo = GetUserInfo();

  const [isLogged, setIsLogged] = useState(false);

  const [clientType, setClientType] = useState("");

  // const [episodeTotalLikes, setTotalLikes] = useState(totalLikes);

  // const onClickFavorite = () => {
  //   if (!isLogged) setModalVisible(true);
  //   else {
  //     EpisodeManagementAPI.toggleLikedSerie({ userInfo: GetUserInfo(), episode: episode._id }).then((res) => {
  //       if (res.success) {
  //         setFavorite(res.isLiked);
  //         setTotalLikes(
  //           res.totalLikes,
  //         );
  //       }
  //     })
  //   }
  // };


  useEffect(() => {
    if (typeof window !== "undefined") {
      if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
        setIsLogged(true);

        setClientType(userInfo.role["role"]);
      } else {
        setIsLogged(false);

        setClientType("");
      }
    }
  }, [userInfo]);

  return (
    <div className={`${style["episode-component"]}`}>
      <div
        onClick={() => router.push(`/nft?serieId=${serieId}&episodeId=${episode._id}`)}
        className={`${style["cursor_pointer"]}`}>
        <img
          src={thumbnail}
          className={`${style["episode-image"]}`} />
        <Tooltip title={name}>
          <div className={`${style["episode-name"]}`}>
            {convertLongString(name, 22)}
          </div>
        </Tooltip>
      </div>

      <div className={`${style["cursor_pointer"]} ${style["bottom-detail"]}`}>
        <span className={`${style["episode-price"]}`}>
          {price}
          {/*<span>{t(`common:${currency}`)}</span>*/}
        </span>
        <span className={`${style["float-right"]} ${style["episode-heart"]}`}>
          {/*{favorite ? (*/}
          {/*  <HeartFilled*/}
          {/*    className={`${style["favorite-icon"]} ${style["color-red"]}`}*/}
          {/*    // onClick={onClickFavorite}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  <HeartOutlined*/}
          {/*    className={`${style["favorite-icon"]}`}*/}
          {/*    // onClick={onClickFavorite}*/}
          {/*  />*/}
          {/*)}*/}
          <HeartOutlined
              className={`${style["favorite-icon"]}`}
              // onClick={onClickFavorite}
          />
          {/*<span className={`${style["episode-like"]}`}>{episodeTotalLikes}</span>*/}
        </span>
      </div>
      {/*{modalVisible && (*/}
      {/*  <RequireLoginModal updateModalVisible={() => setModalVisible(false)} />*/}
      {/*)}*/}
    </div>
  );
};
