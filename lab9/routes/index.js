var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var session = require('express-session');

var limit = 3;

let selected_meme;

function create_database() {
    let db = new sqlite3.Database('meme.db');
    db.serialize(function () {
        db.run('CREATE TABLE meme (id INT, name VARCHAR (255), price INT, url VARCHAR (1023))');
        db.run('CREATE TABLE meme_price (id INT, price INT, day VARCHAR (255), hr VARCHAR (255))');
    });

    db.serialize(function () {
        db.run('INSERT INTO meme (id, name, price, url) VALUES' +
            '(10, "Gold", 1000, "https://i.redd.it/h7rplf9jt8y21.png"), ' +
            '(9, "Platinum", 1100, "http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg"), ' +
            '(8, "Elite", 1200, "https://i.imgflip.com/30zz5g.jpg"), ' +
            '(7, "Taki sobie", 450, "https://upload.wikimedia.org/wikipedia/commons/3/35/Obrazkowy_Mem_Internetowy.jpg"), ' +
            '(6, "Lepszy", 750, "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSllwCVRaqXkcjBrtdUt8V7hvCi3yhCzlQAqOwsycTLTg4FAZyd&usqp=CAU"), ' +
            '(5, "Jakiś mem", 643, "https://cdn.medme.pl/zdjecie/9731,840,560,1/grumpy-cat.jpg"), ' +
            '(4, "Inny mem", 326, "https://www.semtec.pl/wp-content/uploads/2016/09/kot.png"), ' +
            '(3, "Jeszcze inny mem", 452, "https://filmdaily.co/wp-content/uploads/2020/05/cat-memes-lede.jpg"), ' +
            '(2, "Dobry mem", 839, "https://images7.memedroid.com/images/UPLOADED712/5d8927a959a58.jpeg"), ' +
            '(1, "Słaby mem", 128, "https://i.etsystatic.com/17214120/r/il/356dbf/1970150252/il_570xN.1970150252_h6s8.jpg");'
        );
        let date = new Date();
        let params = new Array(20);
        for (let i = 0; i < 20; i += 2) {
            params[i] = date.toDateString();
            params[i + 1] = date.toLocaleTimeString();
        }
        db.run('INSERT INTO meme_price(id, price, day, hr) VALUES ' +
            '(10, 1000, ?, ?), (9, 1100, ?, ?), (8, 1200, ?, ?), (7, 450, ?, ?), (6, 750, ?, ?), (5, 643, ?, ?), (4, 326, ?, ?), (3, 452, ?, ?), (2, 839, ?, ?), (1, 128, ?, ?);',
            params);
    });

    db.close();
}

create_database();

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
    /*let result = await get_meme_with_promise(memeId).then(function (value) {
        return value;
    });*/
    let db = new sqlite3.Database('meme.db');
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {

            db.get('SELECT id, name, price, url FROM meme WHERE id = ?;', [memeId], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    });
    db.close();
    return result;
    //return memes_list.find((mem) => mem.id == memeId);
}

function get_top_memes() {
    let db = new sqlite3.Database('meme.db');
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.all('SELECT * FROM meme ORDER BY price DESC LIMIT ?', [3], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    });
    db.close();
    return result;
}

function get_meme_price_history(memeId) {
    let db = new sqlite3.Database('meme.db');
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.all('SELECT price, day, hr FROM meme_price WHERE id = ?;', [memeId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    });
    db.close();
    return result;
}

function change_meme_price(memeId, price) {
    let db = new sqlite3.Database('meme.db');
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            let date = new Date();
            db.run('INSERT INTO meme_price (id, price, day, hr) VALUES (?, ?, ?, ?);',
                [memeId, price, date.toDateString(), date.toLocaleTimeString()]);
            db.run('UPDATE meme SET price = ? WHERE id = ?', [price, memeId]);
            resolve();
        });
    });
    db.close();
    return result;
}

function hr_to_ms(val) {
    let tmp = val.split(':');
    return (tmp[0] * 60 * 60 + tmp[1] * 60 + tmp[2]) * 1000;
}

function compare_price_history_record(record1, record2) {
    let day1 = Date.parse(record1.day) + hr_to_ms(record1.hr);
    let day2 = Date.parse(record2.day) + hr_to_ms(record2.hr);
    return day2 - day1;
}


/* GET home page. */
router.get('/', async function (req, res, next) {
    let most_expensive_limited = await get_top_memes();
    if (req.session.page_views) {
        req.session.page_views++;
    } else {
        req.session.page_views = 1;
    }
    //console.log(most_expensive_limited);
    //let most_expensive_limited = memes_list.sort((mem1, mem2) => mem2.prices_history[0].price - mem1.prices_history[0].price).slice(0, limit);
    res.render('index', {title: 'Meme market', message: 'Hello there!', best_memes: most_expensive_limited, views: req.session.page_views})
});

router.get('/meme/:memeId', async function (req, res, next) {
    let memeId = req.params.memeId;
    let meme = await get_meme(memeId);
    if (meme === undefined) {
        next(createError(404, "Invalid meme id"));
    } else {
        if (req.session.page_views) {
            req.session.page_views++;
        } else {
            req.session.page_views = 1;
        }
        meme.prices_history = await get_meme_price_history(memeId);
        meme.prices_history.sort(compare_price_history_record);
        res.render('meme', {meme: meme, views: req.session.page_views});
    }
});

router.post('/meme/:memeId', async function (req, res, next) {
    let memeId = req.params.memeId;
    let meme = await get_meme(memeId);
    let price = req.body.price;
    if (meme === undefined) {
        next(createError(404, "Invalid meme id"));
    } else {
        await change_meme_price(memeId, price);
        let meme1 = await get_meme(memeId);
        meme1.prices_history = await get_meme_price_history(memeId);
        meme1.prices_history.sort(compare_price_history_record);
        meme1.price = req.body.price;
        if (req.session.page_views) {
            req.session.page_views++;
        } else {
            req.session.page_views = 1;
        }
        res.render('meme', {meme: meme1, views: req.session.page_views});
    }
});

module.exports = router;
