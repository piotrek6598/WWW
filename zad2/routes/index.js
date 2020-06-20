var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var {
    get_quiz_list, check_login, login, logout, check_login_cookie, cmp_passwd, add_user, find_user, change_passwd,
    get_quiz, save_result, check_quiz_resolved, get_solution_summary
} = require('../db.js');


var csrf = require('csurf');
var bodyParser = require('body-parser');
var csrfProtection = csrf({cookie: true})
var parseForm = bodyParser.urlencoded({extended: false})

function create_login_cookie() {
    return Math.floor(Math.random() * 1000000) + 246738;
}

/* GET home page. */
router.get('/', csrfProtection, async function (req, res, next) {
    let usr = req.cookies.usr;
    let cookie = req.cookies.ul;
    if (usr === undefined || cookie === undefined) {
        res.locals.loggedIn = false;
    } else {
        let checked = await check_login_cookie(usr, cookie);
        if (checked.find == 1) {
            res.locals.loggedIn = true;
        } else {
            res.locals.loggedIn = false;
            res.clearCookie("usr");
            res.clearCookie("ul");
        }
    }
    get_quiz_list(quizes => {
        console.log(quizes);
        res.locals.message = false;
        res.locals.available_quizes = quizes;
        res.render('index', {csrfToken: req.csrfToken(), title: 'Quizy algebraiczne'});
    })
});

router.get('/signup', csrfProtection, async function (req, res, next) {
    let usr = req.cookies.usr;
    let cookie = req.cookies.ul;
    if (usr === undefined || cookie === undefined) {
        res.locals.loggedIn = false;
    } else {
        let checked = await check_login_cookie(usr, cookie);
        if (checked.find == 1) {
            res.locals.loggedIn = true;
            next(createError(403, "You cannot create second account"));
        } else {
            res.locals.loggedIn = false;
            res.clearCookie("usr");
            res.clearCookie("ul");
        }
    }
    res.render('signup', {csrfToken: req.csrfToken(), title: 'Sign up'});
});

router.post('/signup', parseForm, csrfProtection, async function (req, res, next) {
    let passwd = req.body.passwd;
    let rpasswd = req.body.rpasswd;
    let result = cmp_passwd(passwd, rpasswd);
    console.log(result);
    if (result) {
        let user_find = await find_user(req.body.username, passwd);
        if (user_find.find == 0) {
            let cookie = create_login_cookie();
            add_user(req.body.username, passwd, cookie);
            res.cookie('usr', req.body.username);
            res.cookie('ul', cookie);
            res.locals.loggedIn = true;
            res.redirect('/');
        } else {
            res.locals.message = true;
            res.render('signup', {csrfToken: req.csrfToken(), title: 'Sign up', msg: "Username already taken"});
        }
    } else {
        res.locals.message = true;
        res.render('signup', {csrfToken: req.csrfToken(), title: 'Sign up', msg: "Passwords are different"});
    }
});

router.get('/changepasswd', csrfProtection, async function (req, res, next) {
    res.render('changepasswd', {csrfToken: req.csrfToken(), title: 'Password change'});
});

router.post('/changepasswd', parseForm, csrfProtection, async function (req, res, next) {
    let usr = req.cookies.usr;
    let cookie = req.cookies.ul;
    if (usr === undefined || cookie === undefined) {
        res.locals.loggedIn = false;
        next(createError(401, "Unauthorized user"));
    } else {
        let checked = await check_login_cookie(usr, cookie);
        if (checked.find != 1) {
            res.locals.loggedIn = false;
            res.clearCookie("usr");
            res.clearCookie("ul");
            next(createError(401, "Unauthorized user"));
        }
    }
    let cpasswd = req.body.cpasswd;
    let passwd = req.body.passwd;
    let rpasswd = req.body.rpasswd;
    let new_cookie = create_login_cookie();
    if (cmp_passwd(cpasswd, passwd)) {
        res.locals.message = true;
        res.render('changepasswd', {
            msg: "New password is the same password",
            csrfToken: req.csrfToken(),
            title: 'Password change'
        });
    } else if (cmp_passwd(passwd, rpasswd)) {
        logout(usr);
        while (new_cookie == cookie)
            new_cookie = create_login_cookie();
        change_passwd(usr, passwd);
        let set_cookie = await login(usr, passwd, new_cookie);
        res.cookie('usr', req.body.username);
        res.cookie('ul', set_cookie.cookie);
        res.locals.loggedIn = true;
        res.locals.message = false;
        res.redirect('/');
    } else {
        res.locals.message = true;
        res.render('changepasswd', {
            msg: "Passwords are different",
            csrfToken: req.csrfToken(),
            title: 'Password change'
        });
    }
});

router.post('/', parseForm, csrfProtection, async function (req, res, next) {
    if (req.body.login == "signup") {
        res.locals.message = false;
        res.redirect('/signup');
    } else if (req.body.login == "login") {
        let user_find = await check_login(req.body.username, req.body.passwd);
        let msg;
        if (user_find.find == 1) {
            let cookie = create_login_cookie();
            let set_cookie = await login(req.body.username, req.body.passwd, cookie);
            if (set_cookie.cookie != -1) {
                console.log(set_cookie.cookie);
                res.cookie('usr', req.body.username);
                res.cookie('ul', set_cookie.cookie);
                res.locals.loggedIn = true;
                res.locals.message = false;
                msg = "login successful";
            } else {
                res.locals.loggedIn = false;
                res.locals.message = true;
                msg = "Invalid user or password!";
            }
        } else {
            res.locals.loggedIn = false;
            res.locals.message = true;
            msg = "Invalid user or password!";
        }
        get_quiz_list(quizes => {
            console.log(quizes);
            res.render('index', {
                msg: msg,
                csrfToken: req.csrfToken(),
                title: 'Quiz Algebraiczne',
                available_quizes: quizes
            });
        })
    } else if (req.body.login == "logout") {
        logout(req.cookies.usr);
        res.clearCookie("usr");
        res.clearCookie("ul");
        res.locals.loggedIn = false;
        res.redirect('/');
    } else if (req.body.login == "changepasswd") {
        res.locals.message = false;
        res.redirect('/changepasswd');
    } else {
        next(createError(400, "Bad login parameter"));
    }
});

router.get('/quiz/:quiz_id', csrfProtection, function (req, res, next) {
    next(createError(403));
});

router.get('/quiz/:quiz_id/:solution_id', csrfProtection, function (req, res, next) {
    next(createError(403));
});

router.get('/summary', csrfProtection, function (req, res, next) {
    next(createError(403));
});

router.post('/quiz/:quiz_id', parseForm, csrfProtection, async function (req, res, next) {
    let quiz_id = req.params.quiz_id;
    let usr = req.cookies.usr;
    let cookie = req.cookies.ul;
    if (usr === undefined || cookie === undefined) {
        res.locals.loggedIn = false;
        next(createError(401, "Unauthorized user"));
    } else {
        let checked = await check_login_cookie(usr, cookie);
        if (checked.find != 1) {
            res.locals.loggedIn = false;
            res.clearCookie("usr");
            res.clearCookie("ul");
            next(createError(401, "Unauthorized user"));
        }
    }
    let solution_id = await check_quiz_resolved(quiz_id, usr);
    if (solution_id != undefined) {
        console.log("I'm hear");
        if (solution_id.score == -1) {
            get_quiz_list(quizes => {
                console.log(quizes);
                res.locals.message = true;
                res.locals.available_quizes = quizes;
                res.locals.loggedIn = true;
                res.render('index', {
                    msg: "You are doing this quiz in other window",
                    csrfToken: req.csrfToken(),
                    title: 'Quizy algebraiczne'
                });
            });
            return;
        } else {
            console.log("I'm here 2");
            let summary = await get_solution_summary(quiz_id, solution_id.solution_id);
            res.locals.message = true;
            res.render('summary', {
                msg: "Quiz resolved",
                csrfToken: req.csrfToken(),
                title: 'Quiz summary',
                window: {summary: summary}
            });
            return;
        }
    }
    let quiz_desc = JSON.parse(req.body.quiz_desc);
    let quiz_title = quiz_desc.title;
    let answerPenalty = quiz_desc.penalty;
    let quiz_intro = quiz_desc.introduction;
    let quiz = await get_quiz(quiz_id, usr);
    console.log(quiz_title);
    console.log(answerPenalty);
    console.log(quiz_intro)
    console.log(quiz);
    res.render('quiz', {
        csrfToken: req.csrfToken(),
        title: quiz_title,
        window: {quiz: quiz},
        quiz: quiz,
        penalty: answerPenalty,
        intro: quiz_intro
    });
});

router.post('/quiz/:quiz_id/:solution_id', parseForm, csrfProtection, async function (req, res, next) {
    let quiz_id = req.params.quiz_id;
    let usr = req.cookies.usr;
    let cookie = req.cookies.ul;
    if (usr === undefined || cookie === undefined) {
        res.locals.loggedIn = false;
        next(createError(401, "Unauthorized user"));
    } else {
        let checked = await check_login_cookie(usr, cookie);
        if (checked.find != 1) {
            res.locals.loggedIn = false;
            res.clearCookie("usr");
            res.clearCookie("ul");
            next(createError(401, "Unauthorized user"));
        }
    }
    let solution_id = req.params.solution_id;
    console.log(quiz_id);
    console.log(solution_id);
    let summary = await save_result(quiz_id, solution_id, req.body.answers);
    console.log("To jest summary");
    console.log(summary);
    res.render('summary', {csrfToken: req.csrfToken(), title: 'Quiz summary', window: {summary: summary}});
});

router.post('/summary', parseForm, csrfProtection, function (req, res, next) {
    res.redirect('/');
});

module.exports = router;
