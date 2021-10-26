const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const path = require('path');

const route = require('./helper/route')


const server = http.createServer((req, res) => {
	// res.statusCode = 200;
	// res.setHeader('Content-Type', 'text/html');
	// res.write('<html>');
	// res.write('<body>');
	// res.write('http hhh!');
	// res.write('</body>');
	// res.end('</html>');

	// 获取路径
	// res.statusCode = 200;
	// res.setHeader('Content-Type', 'text/html');
	// res.end(filePath);

	// 获取当前路径
	const filePath = path.join(conf.root, req.url);
	route(req, res, filePath);
});

server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}`;
	console.log(`Server started at ${chalk.green(addr)}`)
});
