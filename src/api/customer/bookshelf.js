import { createCustomAxios } from "../../utils/custom-axios";
import { API_BASE_URL, CREATOR } from "../const";

const baseURL = API_BASE_URL;
const creator = CREATOR;

export default {
  getBookShelf: ({ userInfo, page, limit, pattern = null, selectedCate }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: "get",
      url: `${baseURL}/user/bookshelf-data`,
      params: {
        page,
        limit,
        pattern,
        category: selectedCate,
      },
    }).then((data) => {
      return data;
    });
  },

  addFreeEpToBookshelf: ({ episodeId, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: "put",
      url: `${baseURL}/user/bookshelf`,
      data: { episodeId },
    }).then((data) => {
      return data;
    });
  },

  getLikedBook: ({ userInfo, page, limit, pattern = null, selectedCate }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: "get",
      url: `${baseURL}/user/favor-data`,
      params: {
        page,
        limit,
        pattern,
        category: selectedCate
      },
    }).then((data) => {
      return data;
    });
  },
};
