import axios from 'axios';

export const BASE_URL = 'https://api.yinlin.wiki';

export const getMusicFilter = async (album: Array<string>, solo: Array<string>, platform: Array<string>, language: Array<string>, page: number) => {
  let params: any = {};
  if (album.length > 0) {
    params.album = album.join(',');
  }
  if (solo.length > 0) {
    params.solo = solo.join(',');
  }
  if (platform.length > 0) {
    params.platform = platform.join(',');
  }
  if (language.length > 0) {
    params.language = language.join(',');
  }
  params.page = page;
  params.size = 20;
  const res = await axios.get(`${BASE_URL}/music/filter`, { params });
  return res.data;
};

export const getMusicType = async () => {
  const res = await axios.get(`${BASE_URL}/music/attr`);
  return res.data.data;
};

export const getMusicDetail = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/music/detail`, { params: { id } });
  return res.data.data;
};
