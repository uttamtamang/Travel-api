const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const userRouter = require('./routes/users');
const dotenv = require('dotenv').config();
const uploadRouter = require('./routes/upload');
const cors = require('cors');
const morgan = require('morgan');
const packageRouter = require('./routes/package')


mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then((db) => {
        console.log("SUCCESSFULLY CONNECTED TO DATABASE SERVER");
    }, (err) => console.log(err));

const app = express();
app.use(express.static(__dirname + "/public"));
app.options('*', cors());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use('/users', userRouter);
app.use('/upload', auth.verifyUser, uploadRouter);
app.use('/packages', packageRouter)


app.use((err, req, res, next) => {
    console.error(err.stack);
    // res.status(500).send({ status: err.message });
    res.statusCode = 500;
    res.json({ status: err.message });
})

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`);
});

