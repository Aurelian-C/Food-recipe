import { TIMEOUT } from './config';

const timeout = function (seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Request took to long! Faild to fetch after ${seconds} seconds!`
        )
      );
    }, seconds * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`Status Text: ${response.statusText}`);

    return data;
  } catch (err) {
    throw err;
  }
};
