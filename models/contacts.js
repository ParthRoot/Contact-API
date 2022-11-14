const db = require("./db");

// insert data in database
async function insertContactDetails(userData, userid) {
    let sqlStmt =
        "INSERT INTO contacts (name, email, phone, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
    let { name, email, phone } = userData;
    let user_id = userid;
    return db.pool.query(sqlStmt, [name, email, phone, user_id]);
}

//get contacts by name
async function getContactsByName(name, userId) {
    let sqlStmt = "SELECT  * FROM contacts WHERE user_id=$1 AND name=$2 ";
    let name1 = name;
    let user_id = userId;
    return db.pool.query(sqlStmt, [user_id, name1]);
}

//update Contanct by name
async function updateContactsByName(userData, name2, userId) {
    let sqlStmt =
        "UPDATE contacts SET name=$1, email=$2, phone=$3 WHERE user_id=$4 AND name=$5";
    let { name, email, phone } = userData;
    let name1 = name2;
    let user_id = userId;
    return db.pool.query(sqlStmt, [name, email, phone, user_id, name1]);
}

//delete contacts by name
async function deleteContactsByName(name2, userId) {
    let sqlStmt = "DELETE FROM contacts WHERE user_id=$1 AND name=$2";
    // let { name, email, phone } = userData;
    let name1 = name2;
    let user_id = userId;
    return db.pool.query(sqlStmt, [user_id, name1]);
}

module.exports = {
    insertContactDetails,
    getContactsByName,
    updateContactsByName,
    deleteContactsByName,
};