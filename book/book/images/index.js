var http=require('http'),
    url=require('url'),
    fs=require('fs'),
    mime=require('mime');
http.createServer(function(req,res){
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8')
        fs.createReadStream('./index.html').pipe(res);
    }else{
        fs.exists('.'+pathname,function(exists){
            if(exists){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res)
            }else{
                res.statusCode=404;
                res.end('')
            }
        })
    }
}).listen(8080)