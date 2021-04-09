const { get } = require('../common/axios/index');

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await get(url);
      resolve(data);
    } catch (error) {
      const e = new Error(error);
      reject(e.message);
    }
  });
};
