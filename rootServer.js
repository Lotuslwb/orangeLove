const http = require('http');
const path = require('path');
const fs = require('fs');

const port = 8091;
const hostname = 'localhost';

var server = http.createServer(function (req, res) {
    const filePath = path.join(process.cwd(), req.url)
    console.log(filePath);
    fs.stat(filePath, (err, stats) => { //fs.stat(path,callback),读取文件的状态；
        if (err) { //说明这个文件不存在
            console.log(err)
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/javascript;charset=UTF-8'); //utf8编码，防止中文乱码
            res.end(`${filePath} is not a directory or file.`)
            return;
        }
        if (stats.isFile()) { //如果是文件
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
            fs.createReadStream(filePath).pipe(res); //以流的方式来读取文件
        } else if (stats.isDirectory()) { //如果是文件夹，拿到文件列表
            fs.readdir(filePath, (err, files) => { //files是个数组
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(files.join(',')); //返回所有的文件名
            })
        }
    })
});

server.listen(port, hostname, () => {
    var addr = `http://${hostname}:${port}`;
    console.info(`listenning in:${addr}`);
})