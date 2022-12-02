/* 
该方法存在一定的bug，客户端时间与服务器时间不一致导致的

*/

try {
    
    const http = require('http')
    const path = require('path')
    const fs = require('fs').promises
    const url = require('url')
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
            let ctime = statObj.ctime.toGMTString()
            let conent = await fs.readFile(absPath, 'utf-8')
            if (req.url.match(/css/)) {
                res.setHeader('Last-Modified', ctime)
                let ifModifiedSince = req.headers['if-modified-since']
                if (ifModifiedSince === ctime) {
                    res.statusCode = 304
                    return res.end()
                }
            }
            res.end(conent);

        } catch (error) {
            res.end(error)
        }

    }).listen(8082);

    console.log('Server running at http://127.0.0.1:8082/');
} catch (error) {
    console.log('vvv', error);
}