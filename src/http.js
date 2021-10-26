const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const path = require('path');

const route = require('./helper/route')

class Server {
	constructor (config) {
		// 合并默认conf和输入进的config
		this.conf = Object.assign({}, conf, config);
	}

	start() {
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
			const filePath = path.join(this.conf.root, req.url);
			// 传入输入值
			route(req, res, filePath, this.conf);
		});
		
		server.listen(this.conf.port, this.conf.hostname, () => {
			const addr = `http://${this.conf.hostname}:${this.conf.port}`;
			console.log(`Server started at ${chalk.green(addr)}`)
		});
	}
}


module.exports = Server;