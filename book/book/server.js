var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    mime = require('mime');
function getBooks(callback) {
    fs.readFile('./book.json', 'utf8', function (err, data) {
        if (err) {
            data = '[]';
        }
        callback(JSON.parse(data))
    })
}
function setBooks(data, callback) {
    fs.writeFile('./book.json', JSON.stringify(data), callback)
}

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    if (pathname == '/') {
        res.setHeader('Content-Type', 'text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/^\/books(\/\d+)?$/.test(pathname)){
        var id=/^\/books(\/\d+)?$/.exec(pathname)[1];
        switch (req.method){
            case 'GET':
                if(id){
                    var id=id.slice(1);
                    getBooks(function(data){
                        var book=data.find(function(item){
                            return item.id==id;
                        });
                        res.end(JSON.stringify(book))
                    })
                }else{
                    getBooks(function(data){
                        res.end(JSON.stringify(data))
                    })
                }
                break;
            case 'POST':
                var str='';
                req.on('data',function(data){
                    str+=data;
                })
                req.on('end',function(){
                    var book=JSON.parse(str);
                    getBooks(function(data){
                        data.sort(function(a,b){
                            return a.id- b.id
                        })
                        book.id=data.length?parseInt(data[data.length-1].id+1):1;
                        data.push(book)
                        setBooks(data,function(){
                            res.end(JSON.stringify(book))
                        })
                    })
                })
                break;
            case  'PUT':
                if(id){
                    id=id.slice(1);
                    var str='';
                    req.on('data',function(data){
                        str+=data
                    })
                    req.on('end',function(){
                        var book=JSON.parse(str)
                        getBooks(function(data){
                            data=data.map(function(item){
                                if (item.id==id){
                                    return book
                                }
                                return item
                            })
                            setBooks(data,function(){
                                res.end(JSON.stringify(book))
                            })
                        })
                    })
                }
                break;
            case 'DELETE':
                if(id){
                    id=id.slice(1);
                    getBooks(function(data){
                        data=data.filter(function(item){
                            return item.id!=id
                        })
                        setBooks(data,function(){
                            res.end(JSON.stringify({}))
                        })
                    })
                }
                break;
        }
    } else {
        fs.exists('.' + pathname, function (exists) {
            if (exists) {
                res.setHeader('Content-Type', mime.lookup(pathname) + ';charset=utf8');
                fs.createReadStream('.' + pathname).pipe(res)
            } else {
                res.statusCode = 404;
                res.end('')
            }
        })
    }
}).listen(8080);