var fs=require('fs');
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
var book={'bookName':'react',id:10,bookCover:'www.baidu.com',bookPrice:40};
getBooks(function(data){
    data.push(book);
    setBooks(data,function(){
        console.log(data)
    })
})
getBooks(function(data){
    data=data.filter(function(item){
        if(item.id===10){
            return false
        }
        return true
    })
    setBooks(data,function(){
        console.log('chenggong')
    })
})