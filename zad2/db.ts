let sqlite3 = require('sqlite3').verbose();
let sha256 = require('js-sha256').sha256

function hashCode(str: String) {
    let hash = sha256.hmac.create(str + "5hyz3");
    return hash.hex();
}

function get_db() {
    return new sqlite3.Database('quiz.db');
}

function add_user(user: String, passwd: String, cookieval: Number) {
    let db =  get_db();
    passwd = hashCode(passwd);
    db.serialize(function () {
        db.run('INSERT INTO users(username, passwd, loginCookie) VALUES (?, ? ,?)', [user, passwd, cookieval]);
    });
    db.close();
}

function create_database() {
    let db = get_db();
    db.serialize(function () {
        db.run('DROP TABLE IF EXISTS quiz');
        db.run('DROP TABLE IF EXISTS quiz_questions');
        db.run('DROP TABLE IF EXISTS quiz_scoring');
        db.run('DROP TABLE IF EXISTS users');
    });
    db.serialize(function () {
        db.run('CREATE TABLE quiz(' +
            'id INT,' +
            'title VARCHAR(255),' +
            'introduction VARCHAR(1023),' +
            'description VARCHAR(1023),' +
            'questions INT,' +
            'penalty INT)');
        db.run('CREATE TABLE quiz_questions(' +
            'quiz_id INT,' +
            'question_id INT,' +
            'question VARCHAR(1023),' +
            'answer INT)');
        db.run('CREATE TABLE quiz_scoring(' +
            'quiz_id INT,' +
            'user_id INT,' +
            'score INT)');
        db.run('CREATE TABLE users(' +
            'username VARCHAR(255), ' +
            'passwd VARCHAR(255), ' +
            'loginCookie INT)');
    });

    db.serialize(function () {
        db.run('INSERT INTO quiz(id, title, introduction, description,' +
            'questions, penalty) VALUES' +
            '(1, "Quiz łatwy", "Liczyć każdy może, ten quiz nauczy cię wykonywać podstawowe działania arytmetyczne",' +
            '" Quiz zawiera 4 zadania algebraiczne do rozwiązania. <br>' +
            '                Każde z nich dotyczy obliczeń na liczbach całkowitych nie' +
            '                większych' +
            '                niż 100.", 4, 15)');
        db.run('INSERT INTO quiz_questions(quiz_id, question_id, question, answer) VALUES ' +
            '(1, 1, "17 + 32 - 10 = ?", 39),' +
            '(1, 2, "43 - (19 + 21) + 26 = ?", 29),' +
            '(1, 3, "8 * 7 + 42 / 3 = ?", 70),' +
            '(1, 4, "13 * 2 - 6 + 12 / 6 + 25 * (12 + 4) / 8 = ?", 72)');
        db.run('INSERT INTO quiz(id, title, introduction, description,' +
            'questions, penalty) VALUES' +
            '(2, "Quiz średni", "Liczyć każdy może, ten quiz sprawdzi jak radzisz sobie z trudniejszymi przykładami",' +
            '"Quiz zawiera 6 zadań algebraicznych do rozwiązania. <br>' +
            '                Każde z nich dotyczy obliczeń na liczbach całkowitych nie' +
            '                większych' +
            '                niż 10 000.", 6, 30)');
        db.run('INSERT INTO quiz_questions(quiz_id, question_id, question, answer) VALUES' +
            '(2, 1, "476 + 524 - 321 = ?", 679),' +
            '(2, 2, "(1236 + 432) / 139 + 27 * 3 = ?", 93),' +
            '(2, 3, "124 + 31 * 17 - 234 / 3 = ?", 573),' +
            '(2, 4, "(74 + 29) * 35 + (28 - 16) * 167 = ?", 5609),' +
            '(2, 5, "129 + 345 / 15 + (3486 / 6) * 12 = ?", 7124),' +
            '(2, 6, "826 * 12 - (741 / 39 + 128 * (21 - 72 / 9)) = ?", 8229)');
        db.run('INSERT INTO quiz(id, title, introduction, description,' +
            'questions, penalty) VALUES' +
            '(3, "Quiz trudny", "Ten quiz sprawdzi czy naprawdę potrafisz liczyć",' +
            '"Quiz zawiera 8 zadań algebraicznych do rozwiązania. <br>' +
            '                Każde z nich dotyczy obliczeń na liczbach całkowitych.", 8, 35)');
        db.run('INSERT INTO quiz_questions(quiz_id, question_id, question, answer) VALUES' +
            '(3, 1, "13178 + 56482 - 3491 = ?", 66169),' +
            '(3, 2, "158946 - (12745 + 38645) * 2 = ?", 56166),' +
            '(3, 3, "268543 - 45263 + 17185 * 27 = ?", 687275),' +
            '(3, 4, "1287 * 265 - 4924 * 31 = ?", 188411),' +
            '(3, 5, "564 * (1542 - 932) / 6 = ?", 57340),' +
            '(3, 6, "1777620 / 2756 + 24 = ?", 669),' +
            '(3, 7, "275 / 16 * 123 * 368 = ?", 777975),' +
            '(3, 8, "65810128 / 42568 + 2789 * 681 = ?", 1900855)');
        db.run('INSERT INTO users(username, passwd, loginCookie) VALUES' +
            '("user1", ?, -1),' +
            '("user2", ?, -1)', [hashCode("user1"), hashCode("user2")]);
    });

    db.close();
}

let get_quiz_list = resolve => {
    let db = get_db();
    db.serialize(function () {
        db.all('SELECT id, title, description, penalty FROM quiz', (err, rows) => {
            if (err) console.error(err.message)
            else resolve(rows)
        });
    });
    db.close();
};

function check_login(user, passwd) {
    passwd = hashCode(passwd);
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.get('SELECT count(*) as find FROM users WHERE username = ? AND passwd = ?', [user, passwd], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    });
    db.close();
    return result;
}

function login(user, passwd, cookieVal) {
    passwd = hashCode(passwd);
    let db = get_db();
    db.serialize(function () {
        db.run('UPDATE users SET loginCookie = ? WHERE username = ? AND passwd = ? AND loginCookie = -1', [cookieVal, user, passwd]);
    });
    let result = new Promise((resolve, reject) => {
        db.get('SELECT loginCookie as cookie FROM users WHERE username = ? AND passwd = ?', [user, passwd], (err, row) => {
            if (err) resolve({cookie: -1});
            else resolve(row);
        });
    });
    db.close();
    return result;
}

function find_user(user) {
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.get('SELECT count(*) as find FROM users WHERE username = ?', [user], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    });
    db.close();
    return result;
}

function logout(user) {
    let db = get_db();
    db.serialize(function () {
        db.run('UPDATE users SET loginCookie = -1 WHERE username = ?', [user]);
    });
    db.close();
}

function check_login_cookie(user, cookie) {
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.get('SELECT count(*) as find FROM users WHERE username = ? AND loginCookie = ?', [user, cookie], (err, row) =>{
            if (err) reject(err);
            else resolve(row);
        });
    });
    db.close();
    return result;
}

function cmp_passwd(passwd1, passwd2) {
    passwd1 = hashCode(passwd1);
    passwd2 = hashCode(passwd2);
    return passwd1 == passwd2;
}

function change_passwd(user, passwd) {
    passwd = hashCode(passwd);
    let db = get_db();
    db.serialize(function () {
        db.run('UPDATE users SET passwd = ? WHERE username = ?', [passwd, user]);
    });
    db.close();
}

create_database();

module.exports = {
    get_quiz_list: get_quiz_list,
    check_login: check_login,
    login: login,
    logout: logout,
    check_login_cookie: check_login_cookie,
    cmp_passwd: cmp_passwd,
    add_user: add_user,
    find_user: find_user,
    change_passwd: change_passwd,
};