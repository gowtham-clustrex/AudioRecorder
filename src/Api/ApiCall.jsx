import axios from 'axios';

const url = 'https://saej74ein0.execute-api.ap-south-1.amazonaws.com/prod';

export const get_presigned_url = data => {
  console.log(`${url}/get-s3-url?name=${data}`);
  return axios.get(`${url}/get-s3-url?name=${data}`).then(res => res.data);
};

export const uploadAudio = (url, data) => {
  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'audio/mpeg',
      // 'Content-Encoding': 'base64',
    },
    data: data,
  };
  return axios.request(config).then(res => res.data);
};
