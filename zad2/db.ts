let sqlite3 = require('sqlite3').verbose();
let sha256 = require('js-sha256').sha256

let quiz_solution_next_id = 1;

function hashCode(str: String) {
    let hash = sha256.hmac.create(str + "5hyz3");
    return hash.hex();
}

function get_db() {
    return new sqlite3.Database('quiz.db');
}

function add_user(user: String, passwd: String, cookieval: Number) {
    let db = get_db();
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
        db.run('DROP TABLE IF EXISTS solutions');
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
            'answer INT,' +
            'corrected INT,' +
            'attempts INT,' +
            'corrected_total_time INT)');
        db.run('CREATE TABLE quiz_scoring(' +
            'quiz_id INT,' +
            'user_id VARCHAR(255),' +
            'solution_id INT,' +
            'score INT,' +
            'start_time VARCHAR(255),' +
            'end_time VARCHAR(255))');
        db.run('CREATE TABLE users(' +
            'username VARCHAR(255), ' +
            'passwd VARCHAR(255), ' +
            'loginCookie INT)');
        db.run('CREATE TABLE solutions(' +
            'solution_id INT,' +
            'question_id INT,' +
            'answer)');
    });

    db.serialize(function () {
        db.run('INSERT INTO quiz(id, title, introduction, description,' +
            'questions, penalty) VALUES' +
            '(1, "Quiz łatwy", "Liczyć każdy może, ten quiz nauczy cię wykonywać podstawowe działania arytmetyczne",' +
            '" Quiz zawiera 4 zadania algebraiczne do rozwiązania. <br>' +
            '                Każde z nich dotyczy obliczeń na liczbach całkowitych nie' +
            '                większych' +
            '                niż 100.", 4, 15)');
        db.run('INSERT INTO quiz_questions(quiz_id, question_id, question, answer, corrected, attempts, corrected_total_time) VALUES ' +
            '(1, 1, "17 + 32 - 10 = ?", 39, 0, 0, 0),' +
            '(1, 2, "43 - (19 + 21) + 26 = ?", 29, 0, 0, 0),' +
            '(1, 3, "8 * 7 + 42 / 3 = ?", 70, 0, 0, 0),' +
            '(1, 4, "13 * 2 - 6 + 12 / 6 + 25 * (12 + 4) / 8 = ?", 72, 0, 0, 0)');
        db.run('INSERT INTO quiz(id, title, introduction, description,' +
            'questions, penalty) VALUES' +
            '(2, "Quiz średni", "Liczyć każdy może, ten quiz sprawdzi jak radzisz sobie z trudniejszymi przykładami",' +
            '"Quiz zawiera 6 zadań algebraicznych do rozwiązania. <br>' +
            '                Każde z nich dotyczy obliczeń na liczbach całkowitych nie' +
            '                większych' +
            '                niż 10 000.", 6, 30)');
        db.run('INSERT INTO quiz_questions(quiz_id, question_id, question, answer, corrected, attempts, corrected_total_time) VALUES' +
            '(2, 1, "476 + 524 - 321 = ?", 679, 0, 0, 0),' +
            '(2, 2, "(1236 + 432) / 139 + 27 * 3 = ?", 93, 0, 0, 0),' +
            '(2, 3, "124 + 31 * 17 - 234 / 3 = ?", 573, 0, 0, 0),' +
            '(2, 4, "(74 + 29) * 35 + (28 - 16) * 167 = ?", 5609, 0, 0, 0),' +
            '(2, 5, "129 + 345 / 15 + (3486 / 6) * 12 = ?", 7124, 0, 0, 0),' +
            '(2, 6, "826 * 12 - (741 / 39 + 128 * (21 - 72 / 9)) = ?", 8229, 0, 0, 0)');
        db.run('INSERT INTO quiz(id, title, introduction, description,' +
            'questions, penalty) VALUES' +
            '(3, "Quiz trudny", "Ten quiz sprawdzi czy naprawdę potrafisz liczyć",' +
            '"Quiz zawiera 8 zadań algebraicznych do rozwiązania. <br>' +
            '                Każde z nich dotyczy obliczeń na liczbach całkowitych.", 8, 35)');
        db.run('INSERT INTO quiz_questions(quiz_id, question_id, question, answer, corrected, attempts, corrected_total_time) VALUES' +
            '(3, 1, "13178 + 56482 - 3491 = ?", 66169, 0, 0, 0),' +
            '(3, 2, "158946 - (12745 + 38645) * 2 = ?", 56166, 0, 0, 0),' +
            '(3, 3, "268543 - 45263 + 17185 * 27 = ?", 687275, 0, 0, 0),' +
            '(3, 4, "1287 * 265 - 4924 * 31 = ?", 188411, 0, 0, 0),' +
            '(3, 5, "564 * (1542 - 932) / 6 = ?", 57340, 0, 0, 0),' +
            '(3, 6, "1777620 / 2756 + 24 = ?", 669, 0, 0, 0),' +
            '(3, 7, "275 / 16 * 123 * 368 = ?", 777975, 0, 0, 0),' +
            '(3, 8, "65810128 / 42568 + 2789 * 681 = ?", 1900855, 0, 0, 0)');
        db.run('INSERT INTO users(username, passwd, loginCookie) VALUES' +
            '("user1", ?, -1),' +
            '("user2", ?, -1)', [hashCode("user1"), hashCode("user2")]);
    });

    db.close();
}

let get_quiz_list = resolve => {
    let db = get_db();
    db.serialize(function () {
        db.all('SELECT id, title, description, introduction, penalty FROM quiz', (err, rows) => {
            if (err) console.error(err.message)
            else resolve(rows)
        });
    });
    db.close();
};

function get_quiz_questions(quiz_id) {
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.all('SELECT question_id, question as questionText FROM quiz_questions WHERE quiz_id = ? ORDER BY question_id ASC ',
                [quiz_id], (err, rows) => {
                    if (err) console.error(err.message);
                    else resolve(rows);
                });
        });
    });
    db.close();
    return result;
}

function get_quiz_answers(quiz_id) {
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.all('SELECT question_id, answer FROM quiz_questions WHERE quiz_id = ? ORDER BY question_id ASC',
                [quiz_id], (err, rows) => {
                    if (err) console.error(err.message);
                    else resolve(rows);
                });
        });
    });
    db.close();
    return result;
}

function get_quiz_start_time(solution_id) {
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.get('SELECT start_time FROM quiz_scoring WHERE solution_id = ?', [solution_id], (err, row) => {
                if (err) console.error(err.message);
                else resolve(row);
            });
        });
    });
    db.close();
    return result;
}

function convert_string_to_seconds(hr) {
    let tab = hr.split(':');
    let minutes = parseInt(tab[0], 10) * 60 + parseInt(tab[1], 10);
    return minutes * 60 + parseInt(tab[2], 10);
}

function get_time_difference(data_string1, data_string2) {
    let date1 = data_string1.split("&&&time&&&=");
    let date2 = data_string2.split("&&&time&&&=");
    let diff = new Date(date2[0]).getSeconds() - new Date(date1[0]).getSeconds();
    diff += convert_string_to_seconds(date2[1]);
    diff -= convert_string_to_seconds(date1[1]);
    return diff;
}

function get_quiz_penalty(quiz_id) {
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.get('SELECT penalty FROM quiz WHERE id = ?', [quiz_id], (err, row) => {
                if (err) console.error(err.message);
                else resolve(row);
            });
        });
    });
    db.close();
    return result;
}

async function get_solution_summary(quiz_id, solution_id, penalty = -1, db = undefined) {
    let str;
    if (penalty == -1) {
        penalty = (await get_quiz_penalty(quiz_id))['penalty'];
    }
    if (db == undefined) {
        db = get_db();
        str = true;
    } else {
        str = false;
    }
    let questions_with_answers = await new Promise((resolve, reject) => {
        db.serialize(function () {
            db.all('SELECT question, answer, corrected, attempts, corrected_total_time FROM quiz_questions WHERE quiz_id = ? ORDER BY question_id ASC',
                [quiz_id], (err, rows) => {
                    if (err) console.error(err.message);
                    else resolve(rows);
                });
        });
    }) as Array<any>;
    let solution_answers = await new Promise((resolve, reject) => {
        db.serialize(function () {
            db.all('SELECT answer FROM solutions WHERE solution_id = ? ORDER BY question_id ASC', [solution_id], (err, rows) => {
                if (err) console.error(err.message);
                else resolve(rows);
            });
        });
    }) as Array<any>;
    let ranking = await new Promise((resolve, reject) => {
        db.serialize(function () {
            db.all('SELECT user_id as username, score FROM quiz_scoring WHERE quiz_id = ? AND score > -1 ORDER BY score ASC LIMIT 5', [quiz_id], (err, rows) => {
                if (err) console.error(err.message);
                else resolve(rows);
            });
        });
    }) as Array<any>;
    let solution_score = await new Promise((resolve, reject) => {
        db.serialize(function () {
            db.get('SELECT score FROM quiz_scoring WHERE solution_id = ?', [solution_id], (err, row) => {
                if (err) console.error(err.message);
                else resolve(row);
            });
        });
    });
    if (str) {
        db.close();
    }
    let answers = [];
    let totalPenalty = 0;
    for (let i = 0; i < questions_with_answers.length; i++) {
        let answerBox = {
            question: questions_with_answers[i].question,
            user_answer: solution_answers[i].answer,
            correct_answer: questions_with_answers[i].answer,
            correct: solution_answers[i].answer == questions_with_answers[i].answer,
            avg_score: Math.floor(questions_with_answers[i].corrected * 100 / questions_with_answers[i].attempts),
            avg_time: questions_with_answers[i].corrected == 0 ? NaN : Math.ceil(questions_with_answers[i].corrected_total_time / questions_with_answers[i].corrected)
        }
        if (questions_with_answers[i].answer != solution_answers[i].answer)
            totalPenalty += penalty;
        answers.push(answerBox);
    }
    let result = {
        time: parseInt(solution_score['score'].toString(), 10) - totalPenalty,
        totalPenalty: totalPenalty,
        penalty: penalty,
        answers: answers,
        ranking: ranking
    };
    return result;
}

async function save_result(quiz_id, solution_id, answers) {
    let answers_list = JSON.parse(answers);
    let date = new Date();
    let date_string = date.toDateString() + "&&&time&&&=" + date.toLocaleTimeString();
    let start_time = await get_quiz_start_time(solution_id);
    start_time = start_time['start_time'];
    let solution_time = get_time_difference(start_time, date_string);
    let correctAnswers = await get_quiz_answers(quiz_id);
    let penalty = await get_quiz_penalty(quiz_id);
    penalty = penalty['penalty'];
    let totalPenalty = 0;
    let db = get_db();
    let result;
    await new Promise((resolve, reject) => {
        db.serialize(async function () {
            for (let i = 1; i <= answers_list.length; i++) {
                let answer = answers_list[i - 1];
                let correct_answer = correctAnswers[i - 1];
                let qtime = Math.ceil(solution_time * parseInt(answer.time, 10) / 100);
                let correct = correct_answer.answer == answer.answer;
                if (correct) {
                    db.run('UPDATE quiz_questions SET corrected = corrected + 1, attempts = attempts + 1, corrected_total_time = corrected_total_time + ? ' +
                        'WHERE quiz_id = ? AND question_id = ?', [qtime, quiz_id, i]);
                } else {
                    db.run('UPDATE quiz_questions SET attempts = attempts + 1 WHERE quiz_id = ? AND question_id = ?', [quiz_id, i]);
                    totalPenalty += parseInt(penalty.toString(), 10);
                }
                db.run('INSERT INTO solutions(solution_id, question_id, answer) VALUES (?, ?, ?)', [solution_id, i, answer.answer]);
            }
            db.run('UPDATE quiz_scoring SET score = ?, end_time = ? WHERE solution_id = ?', [solution_time + totalPenalty, date_string, solution_id]);
            result = await get_solution_summary(quiz_id, solution_id, parseInt(penalty.toString(), 10), db);
            resolve();
        });
    });
    //db.close();
    return result;
}

function check_quiz_solved(quiz_id, user_id) {
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.get('SELECT solution_id, score FROM quiz_scoring WHERE quiz_id = ? AND user_id = ?',
                [quiz_id, user_id], (err, row) => {
                    if (err) console.error(err.message);
                    else resolve(row);
                });
        });
    });
    db.close();
    return result;
}

async function get_quiz(quiz_id, user_id) {
    let quiz_questions = await get_quiz_questions(quiz_id);
    let result = {
        id: quiz_id,
        solution_id: quiz_solution_next_id,
        questions: quiz_questions
    }
    let date = new Date();
    let date_string = date.toDateString() + "&&&time&&&=" + date.toLocaleTimeString();
    let db = get_db();
    db.serialize(function () {
        db.run('INSERT INTO quiz_scoring (quiz_id, user_id, solution_id, start_time, score) VALUES ' +
            '(?, ?, ?, ?, -1)', [quiz_id, user_id, quiz_solution_next_id, date_string]);
    })
    db.close();
    quiz_solution_next_id++;
    return result;
}

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
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.run('UPDATE users SET loginCookie = -1 WHERE username = ?', [user]);
            resolve();
        });
    });
    db.close();
    return result;
}

function check_login_cookie(user, cookie) {
    let db = get_db();
    let result = new Promise((resolve, reject) => {
        db.get('SELECT count(*) as find FROM users WHERE username = ? AND loginCookie = ?', [user, cookie], (err, row) => {
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
    let result = new Promise((resolve, reject) => {
        db.serialize(function () {
            db.run('UPDATE users SET passwd = ?, loginCookie = -1 WHERE username = ?', [passwd, user]);
            resolve();
        });
    });
    db.close();
    return result;
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
    get_quiz: get_quiz,
    save_result: save_result,
    get_solution_summary: get_solution_summary,
    check_quiz_resolved: check_quiz_solved,
};