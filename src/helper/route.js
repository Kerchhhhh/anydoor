const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars')
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// const config =require('../config/defaultConfig')
const mime = require('./mime')
const compress = require('./compress')
const range = require('./range')
const isFresh = require('./cache')

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());


module.exports = async function(req, res, filePath, config) {
	try {
		const stats = await stat(filePath)
		// 判断是否是文件，是则显示内容，并进行压缩
		if(stats.isFile()) {
			const contentype = mime(filePath);
			res.statusCode = 200;
			res.setHeader('Content-Type', contentype);
			// 如果缓存有效，不返回内容
			if (isFresh(stats, req, res)) {
				res.statusCode = 304;
				res.end();
				return;
			}

			// range范围请求
			let rs;
			const {code, start, end} = range(stats.size, req, res);
			if (code === 200) {
				res.statusCode = 200;
				rs = fs.createReadStream(filePath);
			}
			else {
				res.statusCode = 206;
				rs = fs.createReadStream(filePath, {start, end})
			}

			// 创建可读流

			if (filePath.match(config.compress)) {
				rs = compress(rs, req, res);
			}
			// 实现转换
			rs.pipe(res);

		}
		else if(stats.isDirectory()) {
			const files = await readdir(filePath);
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/html');
			const dir = path.relative(config.root, filePath);
			const data = {
				title: path.basename(filePath),
				dir: dir ? `/${dir}` : '',
				// dir: `/${dir}`,
				files: files.map(file => {
					return {
						file,
						icon: mime(file)
					}
				})
			};
			res.end(template(data));
		}
	} catch(ex) {
		console.error(ex)
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end(`${filePath} is not a diretory or file\n ${ex.toString()} `);			
	}
}