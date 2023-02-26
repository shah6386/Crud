const { default: axios } = require("axios");
const express = require("express");
const Contacts = require("./dbmodel/contact");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const API_KEY = process.env.API_KEY;
const BASE_URL = "http://knit-549951018832356343.myfreshworks.com/crm/sales/api/contacts";

const header = {
    'Content-Type': 'application/json',
    'Authorization': `Token token=${API_KEY}`
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/createContact', async (req, res) => {
    const data_store = req.body.data_store;

    const contact = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "mobile_number": req.body.mobile_number
    };

    try {
        if (data_store === "CRM") {
            const { data } = await axios.post(BASE_URL, {
                "contact": contact
            }, {
                headers: header
            });
            res.status(201).send(data);
        } else {
            const new_contact = Contacts.build(contact);
            await new_contact.save();
            res.status(201).send(new_contact);
        }
    } catch (e) {
        res.status(400).send(e)
    }
});

app.get('/getContact', async (req, res) => {
    const contact_id = req.body.contact_id;
    const data_store = req.body.data_store;

    try {
        if (data_store === 'CRM') {
            const { data } = await axios.get(BASE_URL + `/${contact_id}`, {
                headers: header
            });
            res.status(201).send(data);
        } else {
            const contact = await Contacts.findByPk(contact_id);
            res.status(201).send(contact);
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post('/updateContact', async (req, res) => {
    const contact = {
        "email": req.body.email,
        "mobile_number": req.body.mobile_number
    };
    const contact_id = req.body.contact_id;
    const data_store = req.body.data_store;

    try {
        if (data_store === "CRM") {
            const { data } = await axios.put(BASE_URL + `/${contact_id}`, {
                "contact": contact
            }, {
                headers: header
            });
            res.status(201).send(data);
        } else {
            await Contacts.update(contact, {
                where: {
                    contact_id: contact_id
                }
            })
            const contact = await Contacts.findByPk(contact_id);
            res.status(201).send(contact);
        }
    } catch (e) {
        res.status(400).send(e)
    }
});

app.post('/deleteContact', async (req, res) => {
    const contact_id = req.body.contact_id;
    const data_store = req.body.data_store;

    try {
        if (data_store === "CRM") {
            const { data } = await axios.delete(BASE_URL + `/${contact_id}`, {
                headers: header
            });
            res.status(201).send(data);
        }else{
            await Contacts.destroy({
                where: {
                    contact_id: contact_id
                }
            })
            res.status(201).send("success");
        }
    } catch (e) {
        res.status(400).send(e)
    }
});

app.listen(port, () => {
    console.log("Server is up on port " + port)
});