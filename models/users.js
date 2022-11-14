const db = require("./db");
const jwt = require("jsonwebtoken");
let md5 = require("md5");
const { response } = require("express");
let SECRET_KEY = "This is my auth app ohk bro";

// insert userData in database
async function registerUsers(userData) {
    let sqlStmt =
        "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *";
    let { name, email, phone, password } = userData;
    return db.pool.query(sqlStmt, [name, email, phone, md5(password)]);
}

// update user
async function updateUser(userId, userData) {
    let sqlStmt =
        "UPDATE users SET name=$1, email=$2, phone=$3, password=$4 WHERE id=$5";
    let { name, email, phone, password } = userData;
    let id = userId;
    return db.pool.query(sqlStmt, [name, email, phone, md5(password), id]);
}

// delete user

// login
async function loginUser(userData) {
    let sqlStmt = "SELECT  * FROM users WHERE email=$1 and password=$2 limit 1";
    let { email, password } = userData;

    let data = await db.pool.query(sqlStmt, [email, md5(password)]);

    if (data.rowCount > 0) {
        let userData = data.rows[0];
        let { id, phone, email } = userData;
        let personalData = { id, phone, email };
        let expIn = 24 * 60 * 60;
        let token = jwt.sign({ personalData }, SECRET_KEY, { expiresIn: expIn });
        console.log("Login Successfully");
        return token;
    } else {
        console.log("Auth Fail");
    }
}

//token verifications
let verificationUsers = (req, res, next) => {
    try {
        const token = req.headers["token"];
        const decodeToken = jwt.verify(token, SECRET_KEY);
        const userId = decodeToken.personalData.id;
        // console.log(userId);
        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user Id";
        } else {
            res.locals.userID = userId;
            res.locals.isAuthenticated = true;
            console.log("verify succussfully");
            next();
        }
    } catch (e) {
        console.log(e.message);
        next();
    }
};

module.exports = {
    registerUsers,
    updateUser,
    loginUser,
    verificationUsers,
};