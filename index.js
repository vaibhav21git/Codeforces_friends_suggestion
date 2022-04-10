import express from 'express';
import fetch from "node-fetch";
import path from 'path';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import { model } from './models/model.js';
const app = express();



app.use('/views', express.static('views'));
// app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


let userrating = 0;

mongoose.connect('mongodb://localhost:27017/codeforces')
    .then(() => {



        console.log("mongo connection open");
    }).catch((err) => {
        console.log("connection lost");
        console.log(err);
    })

app.listen(3000, () => {
    console.log("app is listening on port 3000");
})

app.get('/home', async (req, res) => {
    res.render('home');
})


app.post('/homep', async (req, res) => {
    const { username } = req.body;
    const user = username;

    const hasUser = await model.findOne({ user: user }).select("_id");
    if (!hasUser) {
        var user1 = new model({ user: user });
        user1.save();
    }


    let str = "https://codeforces.com/api/user.info?handles="
    str += user;

    const res2 = await fetch(str)
    const json2 = await res2.json();
    const tt = json2.result;
    userrating = tt[0].rating;





    res.render('info', { tt, user });
})


app.post('/homef', async (req, res) => {
    const { username } = req.body;
    const user = username;
    const res2 = await fetch(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=10`)
    const json3 = await res2.json();
    const res1 = json3.result;

    let z = res1.length;

    class Data1 {
        constructor(arraytags, verdict) {
            this.arraytags = arraytags;
            this.verdict = verdict;
        }
    }

    let biary = [];

    for (let i = 0; i < z; i++) {
        let array = res1[i].problem.tags;
        let verd = res1[i].verdict;

        let ddata = new Data1();

        ddata.arraytags = array;
        ddata.verdict = verd;

        biary.push(ddata);
    }
    let r1 = biary.filter(dete => dete.verdict !== 'OK');
    let r2 = [];
    let zz = r1.length;

    for (let i = 0; i < r1.length; i++) {
        r2.push(r1[i].arraytags);
    }

    let finalary = [];
    for (let i = 0; i < zz; i++) {
        let subary = r2[i];
        let z2 = subary.length;

        for (let j = 0; j < z2; j++) {
            if (finalary.indexOf(subary[j]) == -1) {
                finalary.push(subary[j]);
            }
        }
    }
    res.render('weakness', { finalary, user });
})


app.post('/homeff', async (req, res) => {

    let fans = [];
    const { handle } = req.body;
    const user = handle;

    // console.log(user);

    const res2 = await fetch(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=10`)
    const json3 = await res2.json();
    const res1 = json3.result;



    let z = res1.length;

    class Data1 {
        constructor(arraytags, verdict) {
            this.arraytags = arraytags;
            this.verdict = verdict;
        }
    }

    let biary = [];

    for (let i = 0; i < z; i++) {
        let array = res1[i].problem.tags;
        let verd = res1[i].verdict;

        let ddata = new Data1();

        ddata.arraytags = array;
        ddata.verdict = verd;

        biary.push(ddata);
    }

    // console.log(biary.length);
    let r1 = biary.filter(dete => dete.verdict !== 'OK');
    let r2 = [];
    let zz = r1.length;

    for (let i = 0; i < r1.length; i++) {
        r2.push(r1[i].arraytags);
    }

    let finalary = [];
    for (let i = 0; i < zz; i++) {
        let subary = r2[i];
        let z2 = subary.length;

        for (let j = 0; j < z2; j++) {
            if (finalary.indexOf(subary[j]) == -1) {
                finalary.push(subary[j]);
            }
        }
    }



    const res5 = await fetch("https://codeforces.com/api/problemset.recentStatus?count=100");

    const json4 = await res5.json();
    const resultt = json4.result;


    let fz = resultt.length;



    for (let i = 0; i < fz; i++) {
        let currtags = resultt[i].problem.tags;
        let newname = resultt[i].author.members[0].handle;
        let prating = resultt[i].problem.rating;



        let fg = 0;

        for (let j = 0; j < currtags.length; j++) {
            if ((finalary.indexOf(currtags[j]) !== -1) && (prating >= userrating)) {
                fans.push(newname);
                fg = 1;
            }

            if (fg == 1) {
                break;
            }
        }
    }

    res.render('friends', { fans });
});

app.get('/home/all', async (req,res) =>
{
    const users  = await model.find({})
    res.render('allusers',{users});
})









