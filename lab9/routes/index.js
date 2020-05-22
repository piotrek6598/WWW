var express = require('express');
var router = express.Router();

var limit = 3;

class Mem {
    id;
    name;
    price;
    url;
    prices_history;
    constructor(id, name, price, url) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.prices_history = [];
        this.url = url;

        this.change_price(price);
    }

    get price() {
        return this.price;
    }

    change_price(price) {
        this.price = price;
        this.prices_history.reverse();
        this.prices_history.push({price: price, time: new Date()});
        this.prices_history.reverse();
    }
}

let memes_list = [
    new Mem(10, 'Gold', 1000, 'https://i.redd.it/h7rplf9jt8y21.png'),
    new Mem(9, 'Platinum', 1100, 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg'),
    new Mem(8, 'Elite', 1200, 'https://i.imgflip.com/30zz5g.jpg'),
    new Mem(7, "Taki sobie", 450, 'https://upload.wikimedia.org/wikipedia/commons/3/35/Obrazkowy_Mem_Internetowy.jpg'),
    new Mem(6, "Lepszy", 750, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSllwCVRaqXkcjBrtdUt8V7hvCi3yhCzlQAqOwsycTLTg4FAZyd&usqp=CAU')
]

function get_meme(memeId) {
    return memes_list.find((mem) => mem.id == memeId);
}

/* GET home page. */
router.get('/', function (req, res, next) {
    let most_expensive_limited = memes_list.sort((mem1, mem2) => mem2.price - mem1.price).slice(0, limit);
    res.render('index', {title: 'Meme market', message: 'Hello there!', best_memes: most_expensive_limited})
});

router.get('/meme/:memeId', function (req, res) {
    let meme = get_meme(req.params.memeId);
    res.render('meme', { meme: meme })
});

router.post('/meme/:memeId', function (req, res) {
    let meme = get_meme(req.params.memeId);
    let price = req.body.price;
    meme.change_price(price);
    console.log(req.body.price);
    res.render('meme', { meme: meme })
});

module.exports = router;
