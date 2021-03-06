import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
  getSerieQuery: ({ userInfo, limit, page, isDaily, category, firstIndex = -1, isPublished = null, pattern = null }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'get',
      url: `${baseURL}/serie`,
      params: {
        limit,
        page,
        isDaily,
        categoryId: !['all', ''].includes(category) ? category : null,
        firstIndex,
        guest: !userInfo,
        isCreator: userInfo?.role === "creator",
        isPublished: isPublished,
        pattern: pattern ?? ""
      },
    }).then((data) => {
      return data;
    });
  },
};


