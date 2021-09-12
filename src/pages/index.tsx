import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { Header } from "@components/header";
import { SubHeader } from "@components/sub-header";
import { CoverPhoto } from "@components/shop_component/CoverPhoto";
import { AboutTerm } from "@components/shop_component/AboutTerm";
import { ListProducts } from "@components/shop_component/ListProducts";
import { ShopProfile } from "@components/shop-profile";

const Home: React.FC<{ homepageContent: any }> = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [selectedCate, setSelectedCate] = useState("all");

    return (
        <React.Fragment>
            <div
                style={{
                    minHeight: "100vh",
                    textAlign: "center",
                }}
            >
                <Header />
                <SubHeader selectedCate={selectedCate}
                    setSelectedCate={setSelectedCate} />
                <CoverPhoto coverImage={"https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/74459496-fb29-42fe-940e-0be06406850e-cover1.png"} />
                <ListProducts />
                <ShopProfile template={1} />
                <AboutTerm coverImage={"https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/74459496-fb29-42fe-940e-0be06406850e-cover1.png"} />
            </div>
        </React.Fragment>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default Home;
