import React, { useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import CustomerSerieAPI from "../../api/customer/serie";
import { Col, Row, Skeleton, Tooltip } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import style from "./serie.module.scss";
import { BASE_URL } from "../../api/const";
import { SeeMoreNoResult } from "@components/no-result/SeeMoreNoResult";
import { PageNavigation } from "@components/pagination";
import { GetUserInfo } from "src/api/auth";
import { EpisodeProduct } from "@components/product-item/EpisodeProduct";
import EpisodeManagementAPI from "../../api/episode-management/episode-management";
import Share from "@components/share-component/share";
import Head from "next/head";
import {useRouter} from "next/router";

const SerieTemplate = ({ serieId }) => {
    const router = useRouter();
    const { t } = useTranslation();
    const [serieData, setSerieData] = useState(null);
    const [episodeListComponent, setEpisodeList] = useState(null);
    const [serieInfoHeight, setSerieInfoHeight] = useState(0);
    const [serieInfoHeight2, setSerieInfoHeight2] = useState(0);
    const serieInfoRef = useRef(null);
    const contentRef = useRef(null);
    const [seeAll, setSeeAll] = useState(false);
    const [clickSeeAll, setClickSeeAll] = useState(false);
    const [lines, setLines] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1);
    const [likes, setLikes] = useState(0);
    const [favorite, setFavorite] = useState(false);
    const [pattern, setPattern] = useState(router.query["pattern"])

    useEffect(() => {
        setPattern(router.query.pattern)
    }, [router])

    const onClickFavorite = () => {

        favorite ?
            EpisodeManagementAPI.unlike({
                userInfo: GetUserInfo(),
                serieId: serieId,
            }).then((res) => {
                
                if (res.data == "success") {
                    setFavorite(false);
                    setLikes(likes - 1);
                }
            }) : EpisodeManagementAPI.like({
                userInfo: GetUserInfo(),
                serieId: serieId,
            }).then((res) => {
                
                if (res.data == "success") {
                    setFavorite(true);
                    setLikes(likes + 1);
                }
            })
    };

    useEffect(() => {
        CustomerSerieAPI.getSerieData({ serieId: serieId, userInfo: GetUserInfo(), page, limit: itemPerPage, pattern: pattern })
            .then((data) => {
                setSerieData(data);
                setLikes(data?.likes);
                setFavorite(data?.alreadyLiked);
                setSerieInfoHeight(serieInfoRef.current.clientHeight);
                setSerieInfoHeight2(contentRef.current.clientHeight);
                setLines(Math.trunc(serieInfoRef.current.clientHeight / 21));

                if (
                    serieInfoRef.current.clientHeight -
                    (serieInfoRef.current.clientHeight % 21) >
                    contentRef.current.clientHeight
                ) {
                    setSeeAll(false);
                    setClickSeeAll(true);
                } else {
                    setSeeAll(true);
                }
            })
            .catch((err) => {
                console.log({ err });
            });
    }, [page, pattern]);

    useMemo(() => {
        serieData &&
            setEpisodeList(
                serieData.episodes.map((episode) => {
                    return <EpisodeProduct serieId={serieId} episode={episode} />;
                })
            );
    }, [serieData]);

    const [width, setWidth] = useState(window.innerWidth);

    const dynamicHeight = {
        height:
            serieInfoHeight - (serieInfoHeight % 21) < serieInfoHeight2
                ? serieInfoHeight - (serieInfoHeight % 21)
                : serieInfoHeight2,
        WebkitLineClamp: lines,
    };

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }

        setSerieInfoHeight(serieInfoRef.current.clientHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

    return (
        <div className={`${style["serie-content"]}`}>
            <Head>
                <title>WebtoonZ | {serieData?.serieName}</title>
            </Head>
            <section
                className={`${style["image-cover-hidden"]} ${style["image-place"]}`}
            >
                <img src={serieData?.cover} width="100%" height="auto" />
            </section>
            <section className={`${style["serie-info"]}`}>
                <div className={`${style["about"]}`} ref={serieInfoRef}>
                    <Skeleton loading={!serieData?.serieName && serieData?.serieName != ""}>
                        <div className={`${style["name"]}`}>{serieData?.serieName}</div>
                    </Skeleton>
                    <Skeleton
                        loading={
                            !serieData?.episodes?.length && serieData?.episodes?.length != 0
                        }
                    >
                        <div className={`${style["small-detail"]}`}>
                            <div className={`${style["number"]}`}>
                                {`${serieData?.episodes?.length}
                                ${serieData?.episodes?.length > 1
                                        ? t(`common:cartItem.items`)
                                        : t(`common:cartItem.item`)
                                    }`}
                            </div>
                            <div className={`${style["vertical-line"]}`} />
                            <div
                                className={`${style["heart"]}`}
                                onClick={() => onClickFavorite()}
                            >
                                {favorite ? (
                                    <HeartFilled
                                        className={`${style["favorite-icon"]} ${style["color-red"]}`}
                                    />
                                ) : (
                                    <HeartOutlined className={`${style["favorite-icon"]}`} />
                                )}
                                <span className={`${style["like-count"]}`}>{likes}</span>
                            </div>
                        </div>
                        <div className={`${style["category-info"]}`}>
                            <span className={`${style["cate-item"]}`}>
                                {t(`common:category.${serieData?.category.categoryName}`)}
                            </span>
                        </div>
                    </Skeleton>
                    <div className={` ${style["bottom-detail"]}`}>
                        <Row>
                            <Share episodeId={serieId} thumbnail={serieData?.thumbnail} />
                        </Row>
                    </div>
                </div>

                <Skeleton loading={!serieData?.description && serieData?.description != ""}>
                    <div
                        className={`${style["long-description-container"]} ${seeAll && style["see-all"]
                            }`}
                    >
                        <div
                            style={dynamicHeight}
                            className={`${style["long-description"]} ${style["detail"]} ${seeAll && style["see-all"]
                                }`}
                        >
                            <p ref={contentRef}>{`${serieData?.description}`}</p>
                        </div>
                        {!clickSeeAll && (
                            <span
                                className={`${style["see-all-btn"]} ${style["cursor_pointer"]}`}
                                onClick={() => {
                                    setSeeAll(true);
                                    setClickSeeAll(true);
                                    setLines(1000);
                                }}
                            >
                                See all
                            </span>
                        )}
                    </div>
                </Skeleton>
            </section>

            {serieData?.episodes.length === 0 ? (
                <SeeMoreNoResult />
            ) : (
                <div>
                    <section className={style["serie-info"]}>
                        <div className={style["episode-list-container"]}>
                            {episodeListComponent}
                        </div>
                    </section>
                    {serieData?.totalEpisodes > itemPerPage ? (
                        <PageNavigation
                        totalItem={serieData?.totalEpisodes}
                        itemsPerPage={itemPerPage}
                        page={page}
                        setPage={setPage}
                    />
                    ) : <div style={{height: 100}}></div>}
                </div>
            )}
        </div>
    );
};

export default SerieTemplate;
