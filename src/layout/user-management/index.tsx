import { useState, useEffect, useMemo } from "react";
import style from "./user-management.module.scss";
import { PageNavigation } from "@components/pagination";
import { GetUserInfo } from "src/api/auth";
import CreatorManageAPI from "../../api/creator/usermanagement";
import { UserManagementModal } from "./user-modal";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { NoResult } from "../creator/create_serie/preview/NoResult";

export const UsersManagementTemplate = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [userPerPage, setUserPerPage] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalType, setModalType] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserStatus, setCurrentUserStatus] = useState("");
  const { t } = useTranslation();

  const fetchData = (page, limit) => {
    let body = {
      page: page,
      limit: limit,
    };
    CreatorManageAPI.getAllUser({ body: body, userInfo: GetUserInfo() }).then(
      (response) => {

        setTotalUser(response.total);
        setUserPerPage(response.data);
      }
    );
  };

  useEffect(() => {
    let userInfo = GetUserInfo();
    if (userInfo?.role === "creator") {
      fetchData(page, limit);
    }
  }, [page, limit]);

  return (
    <div className={style["container"]}>
      <Head>
        <title>WebtoonZ | {t("common:manageUsers.title")}</title>
      </Head>
      <div className={style["header"]}>{t("common:manageUsers.title")}</div>
      {userPerPage && userPerPage?.length > 0 ?
        <table className={style["table"]}>
          <thead>
            <tr style={{ fontWeight: "bold" }}>
              <th>{t("common:manageUsers.username")}</th>
              <th>{t("common:manageUsers.fullName")}</th>
              <th>{t("common:manageUsers.age")}</th>
              <th>{t("common:manageUsers.email")}</th>
              <th>{t("common:manageUsers.phoneNum")}</th>
              <th>{t("common:manageUsers.status")}</th>
              <th>{t("common:manageUsers.action")}</th>
            </tr>
          </thead>
          <tbody className={style["body"]}>
            {userPerPage?.map((el, index) => (
              <tr key={index}>
                <td>{el.username}</td>
                <td>{el.fullName}</td>
                <td>{el.age}</td>
                <td>{el.email}</td>
                <td>{el.phoneNumber}</td>
                <td>{el.isBanned ? `${t("common:manageUsers.inactive")}` : `${t("common:manageUsers.active")}`}</td>
                <td>
                  <button
                    className={style["primary-btn"]}
                    onClick={() => {
                      setCurrentUserId(el._id);
                      setCurrentUserStatus(el.isBanned ? `${t("common:manageUsers.inactive")}` : `${t("common:manageUsers.active")}`);
                      setModalType("updateStatus");
                    }}
                  >
                    {t("common:manageUsers.update")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> : <NoResult />}

      {totalUser > 10 && (
        <PageNavigation
          totalItem={totalUser}
          itemsPerPage={10}
          page={page}
          setPage={setPage}
        />
      )}
      {modalType === "updateStatus" && (
        <UserManagementModal
          visble={modalType === "updateStatus"}
          userId={currentUserId}
          setModalType={setModalType}
          userStatus={currentUserStatus}
          setUserStatus={setCurrentUserStatus}
          refetchData={() => fetchData(page, 10)}
        />
      )}
    </div>
  );
};
