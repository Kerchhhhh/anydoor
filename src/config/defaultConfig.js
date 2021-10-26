module.exports = {
	// 通过当前路径获取结果
	root: process.cwd(),
	hostname: '192.168.1.114',
	port: 8000,
	compress: /\.(html|js|css|md)/,
	cache: {
		maxAge: 600,
		// 判断本地有没有失效
		expires: true,
		cacheControl: true,
		// 上次修改时间
		lastModified: true,
		// 文件一改变就变化
		etag: true
	}
};