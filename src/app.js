const express = require("express");
let app = express();
const doteve = require("dotenv");
doteve.config();
const dbUser = require("../models/users");
const dbContacts = require("../models/contacts");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World This is Contacts API");
});

app.get("/registerUser", async(req, res) => {
    let data = await dbUser.registerUsers(req.body);
    res.send(data);
});

app.put("/updateUser", async(req, res) => {
    let userId = req.body.id;
    let data = await dbUser.updateUser(userId, req.body);
    res.send(data);
});



//login data
app.get("/login", async(req, res) => {
    let data = await dbUser.loginUser(req.body);

    if (data) {
        res.send({
            auth: true,
            access_token: data,
            msg: "done!",
        });
    } else {
        console.log("error");
        res.send({ msg: "Invalid UserName and Password" });
    }
});

//verify while adding contacts
app.get("/addContacts", dbUser.verificationUsers, async(req, res) => {
    if (res.locals.isAuthenticated) {
        console.log(req.body);
        let userId = res.locals.userID;
        // console.log(userId);
        await dbContacts.insertContactDetails(req.body, userId);
        res.send("Verify Successfully");
    } else {
        res.send("Authenticated Fail");
    }
});

//get contact data by name
app.get("/getContacts", dbUser.verificationUsers, async(req, res) => {
    if (res.locals.isAuthenticated) {
        let userName = req.body.name;
        let userId = res.locals.userID;
        let data = await dbContacts.getContactsByName(userName, userId);
        res.send(data);
    } else {
        res.send("Authenticated Fail");
    }
});

//update contact data by name
app.put("/updateContacts", dbUser.verificationUsers, async(req, res) => {
    // res.send("Update");
    if (res.locals.isAuthenticated) {
        let userName = req.body.name;
        let userId = res.locals.userID;
        let data = await dbContacts.updateContactsByName(
            req.body,
            userName,
            userId
        );
        res.send(data);
    } else {
        res.send("Authenticated Fail");
    }
});

//delete contact by name
app.delete("/deleteContacts", dbUser.verificationUsers, async(req, res) => {
    if (res.locals.isAuthenticated) {
        let userName = req.body.name;
        let userId = res.locals.userID;
        let data = await dbContacts.deleteContactsByName(userName, userId);
        res.send(data);
    } else {
        res.send("Authenticated Fail");
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Hello This is Express ${process.env.PORT}`);
});