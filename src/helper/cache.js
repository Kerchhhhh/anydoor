// cache.js
const {cache} = require('../config/defaultConfig');

function refreshRes(stats, res) {
    const {maxAge, expires, cacheControl, lastModified, etag} = cache;

    if (expires) {          
			// 如果支持expires
       res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
       // 获取现在的时间 + 缓存有效期时间 (*1000 转为毫秒)，最后转成 UTC 时间
    }

    if (cacheControl) {     
			// 如果支持 cacheControl
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
       // public 表示静态资源是共用的，再告诉你 max-age 缓存有效期是多少
    }

    if (lastModified) {
       res.setHeader('Last-Modified', stats.mtime.toUTCString());
       // 文件的上次修改时间，在 stats.mtime 可以取得。然后转 UTC 时间字符串
    }

    if (etag) {
       res.setHeader('ETag',  Math.ceil(+stats.mtime / 1000).toString(16) + '-' + Number(stats.size).toString(16));
      // 大小 - 修改时间
    }
}

module.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res);


    // 下面来读一下浏览器发来的信息
    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    // 如果客户端 这两个信息都没有给我们，就说明 很有可能是第一次请求
    if (!lastModified && !etag) {
        return false;
    }

    // 如果客户端给了我们 lastModified，并且跟我们 refreshRes() 设置的 lastModified 不一样，那就说明了 缓存失效了
    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false;
    }
    
    // 如果 客户端给我们的 etag 也跟我们设置 etag 的不一样，说明 缓存失效了
    if (etag && etag !== res.getHeader('ETag')) {
        return false;
    }

    return true;    // 如果上面的 if 都不满足，则说明 缓存还是ok的，还在缓存有效期内
}
