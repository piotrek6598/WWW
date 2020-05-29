var express = require('express');
var router = express.Router();

var limit = 3;

class Mem {
    constructor(id, name, price, url) {
        this.id = id;
        this.name = name;
        this.prices_history = [];
        this.url = url;

        this.change_price(price);
    }

    get price() {
        return this.prices_history[0].price;
    }

    change_price(price) {
        this.prices_history.reverse();
        this.prices_history.push({price: price, time: new Date()});
        this.prices_history.reverse();
    }
}

let memes_list = [
    new Mem(10, 'Gold', 1000, 'https://i.redd.it/h7rplf9jt8y21.png'),
    new Mem(9, 'Platinum', 1100, 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg'),
    new Mem(8, 'Elite', 1200, 'https://i.imgflip.com/30zz5g.jpg'),
    new Mem(7, 'Taki sobie', 450, 'https://upload.wikimedia.org/wikipedia/commons/3/35/Obrazkowy_Mem_Internetowy.jpg'),
    new Mem(6, 'Lepszy', 750, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSllwCVRaqXkcjBrtdUt8V7hvCi3yhCzlQAqOwsycTLTg4FAZyd&usqp=CAU'),
    new Mem(5, 'Jakiś mem', 643, 'https://cdn.medme.pl/zdjecie/9731,840,560,1/grumpy-cat.jpg'),
    new Mem(4, 'Inny mem', 326, 'https://www.semtec.pl/wp-content/uploads/2016/09/kot.png'),
    new Mem(3, 'Jeszcze inny mem', 452, 'https://filmdaily.co/wp-content/uploads/2020/05/cat-memes-lede.jpg'),
    new Mem(2, 'Dobry mem', 839, 'https://images7.memedroid.com/images/UPLOADED712/5d8927a959a58.jpeg'),
    new Mem(1, 'Słaby mem', 128, 'https://i.etsystatic.com/17214120/r/il/356dbf/1970150252/il_570xN.1970150252_h6s8.jpg')
]

function get_meme(memeId) {
    return memes_list.find((mem) => mem.id == memeId);
}

/* GET home page. */
router.get('/', function (req, res, next) {
    let most_expensive_limited = memes_list.sort((mem1, mem2) => mem2.prices_history[0].price - mem1.prices_history[0].price).slice(0, limit);
    res.render('index', {title: 'Meme market', message: 'Hello there!', best_memes: most_expensive_limited})
});

router.get('/meme/:memeId', function (req, res) {
    if (req.params.memeId >= 1 && req.params.memeId <= 10) {
        let meme = get_meme(req.params.memeId);
        res.render('meme', { meme: meme });
    } else {
        res.render('invalid_meme_id');
    }
});

router.post('/meme/:memeId', function (req, res) {
    let meme = get_meme(req.params.memeId);
    let price = req.body.price;
    meme.change_price(price);
    console.log(req.body.price);
    res.render('meme', { meme: meme });
});

module.exports = router;
