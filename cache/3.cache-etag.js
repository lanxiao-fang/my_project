// 目前是这种最为常用


try {
    const http = require('http') // 白那些服务
    const path = require('path') // 链接路径
    const fs = require('fs').promises // node的文件系统模块
    const url = require('url')
    const crypto = require('crypto') // node中的加密模块


    http.createServer(async (req, res) => {
        let {
            pathname
        } = url.parse(req.url)
        let absPath = path.join(__dirname, '/public', pathname)
        try {
            let statObj = await fs.stat(absPath)
            if (statObj.isDirectory()) {
                absPath = path.join(absPath, 'index.html')
                await fs.access(absPath)
            }
            let conent = await fs.readFile(absPath, 'utf-8')
            if (req.url.match(/css/)) {
                // 利用文件内容 content 生成
                let hash = crypto.createHash('md5').update(content).digest('base64')
                let ifNoneMatch = req.headers['if-none-match']
                res.setHeader('ETag', hash)
                if (ifNoneMatch === hash) {
                    res.statusCode = 304
                    return res.end()
                }
            }
            res.end(conent);

        } catch (error) {
            res.end(error)
        }

    }).listen(8083);

    console.log('Server running at http://127.0.0.1:8083/');
} catch (error) {
    console.log('vvv', error);
}