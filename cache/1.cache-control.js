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
            let conent = await fs.readFile(absPath, 'utf-8')
            res.setHeader('Cache-Control', 'no-cache') // 无缓存
            // res.setHeader('Cache-Control', 'max-age=300')
            res.end(conent);

        } catch (error) {
            res.end(error)
        }

    }).listen(8081);

    console.log('Server running at http://127.0.0.1:8081/');
} catch (error) {
    console.log('vvv', error);
}