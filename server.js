const express = require("express");
const app = express();

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use("/views", express.static("views"));

const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://jeeun:xF4cv6yidg53qiTg@cluster0.npzdcur.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const postCollection = client.db("project3").collection("post");
    const counterCollection = client.db("project3").collection("counter");
    console.log("서버 연결");

    //GET
    app.get("/", (req, res) => {
      res.render("first.ejs");
    });

    app.get("/list", async (req, res) => {
      const cursor = postCollection.find({});
      const result = (await cursor.toArray()).sort().reverse();
      res.render("list.ejs", { post: result });
    });

    app.get("/write", (req, res) => {
      res.render("write.ejs");
    });

    app.get("/detail/:id", async function (req, res) {
      const result = await postCollection.findOne({
        _id: parseInt(req.params.id),
      });

      const cursor = postCollection.find({
        _id: { $lte: parseInt(req.params.id) },
      });
      const result2 = (await cursor.toArray()).sort().reverse();

      const all = postCollection.find({});
      const allresult = (await all.toArray()).sort().reverse();
      const arrLength = parseInt(allresult.length);

      res.render("detail.ejs", {
        result: result,
        post: result2,
        length: arrLength,
      });
    });

    app.get("/edit/:id", async function (req, res) {
      const result = await postCollection.findOne({
        _id: parseInt(req.params.id),
      });
      res.render("edit.ejs", { post: result });
    });

    //POST
    app.post("/add", async function (req, res) {
      const { title, content, date, pw } = req.body;
      const { totalcounter } = await counterCollection.findOne({
        name: "count",
      });
      await postCollection.insertOne({
        _id: totalcounter + 1,
        title: title,
        content: content,
        pw: pw,
        date: date,
      });
      await counterCollection.updateOne(
        { name: "count" },
        { $inc: { totalcounter: 1 } }
      );
      res.redirect("/list");
    });

    // DELETE
    app.delete("/delete", async function (req, res) {
      req.body._id = parseInt(req.body._id);
      await postCollection.deleteOne(req.body);
      res.status(200).send({ message: "성공" });
    });

    //PUT
    app.put("/edit", async (req, res) => {
      const { id, title, content, pw } = req.body;
      await postCollection.updateOne(
        { _id: parseInt(id) },
        { $set: { title: title, content: content, pw: pw } }
      );
      console.log("수정완료");
      res.redirect("/list");
    });
  } finally {
    console.log("마무리");
  }
}

main().catch(console.dir);

app.listen(8080, () => {
  console.log("listening on 8080");
});
