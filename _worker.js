export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.host;
    const pathSegments = url.pathname.split('/').filter(Boolean); // 分割路径并移除空字符串

    let targetHost;
    let newPath;

    // 判断路径是否为 '/chatlink.html'
    if (url.pathname === '/chatlink.html') {
      targetHost = 'i.q-chats.com';
      newPath = `/chatlink-dynamic.html`;
    }
    else if (url.pathname === '/starter.js') {
      targetHost = 'vip.assets-qiabot.com';
      newPath = url.pathname;
    }
    // 判断路径的第一段是否为 'static'
    else if (pathSegments[0] === 'static') {
      targetHost = 'vip.assets-qiabot.com';
      newPath = '/' + pathSegments.slice(1).join('/'); // 去掉 'static'
    }
    else {
      targetHost = 'api-a.assets-qiabot.com';
      newPath = url.pathname;
    }

    const newUrl = new URL(newPath + url.search, `https://${targetHost}`);
    // console.log(`Rewriting to: ${newUrl}`);

    // copy 请求头，避免直接修改原请求的 headers
    const newHeaders = new Headers(request.headers);

    // 确保传递原始 IP 信息
    if (request.headers.get('CF-Connecting-IP')) {
      newHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP'));
    }

    const newRequest = new Request(newUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body
    });

    return fetch(newRequest);
  }
};
