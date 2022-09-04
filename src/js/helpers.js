import { TIMEOUT_SEC } from './config.js'

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};


export const AJAX = async function(url, uploadData = undefined) {
  try {
  const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // 告诉api用json格式发送数据
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // 为了能在 model.js 提示、处理本错误，我们需要在此重新抛出错误
    // 这就是把错误向下传播而已，跟之前一样
    throw err;
  }
}

/* // 包含几个在项目中多次重复使用的功能
export const getJSON = async function(url) {
  try {
    const fetchPro = fetch(url)
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // 为了能在 model.js 提示、处理本错误，我们需要在此重新抛出错误
    // 这就是把错误向下传播而已，跟之前一样
    throw err;
  }
}

export const sendJSON = async function(url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // 告诉api用json格式发送数据
      },
      body: JSON.stringify(uploadData)
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // 为了能在 model.js 提示、处理本错误，我们需要在此重新抛出错误
    // 这就是把错误向下传播而已，跟之前一样
    throw err;
  }
} */