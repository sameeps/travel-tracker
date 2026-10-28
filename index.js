import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "travel",
  password: "123456",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let users = [];
let currentUserId = 1;

async function getUsers() {
  const result = await db.query("SELECT id, name, colour color FROM users");
  // console.log(result.rows);
  return result.rows;
}

async function checkVisited(chosenUserID) {
  let countries = [];
  let colour = null;
  try {
    const result = await db.query(
      "SELECT u.id userid, u.colour colour, v.country_code country FROM users u JOIN visited_countries v ON u.id = v.user_id WHERE u.id = ($1)",
      [chosenUserID],
    );
    // console.log(result.rows);
    colour = result.rows[0].colour;
    result.rows.forEach((row) => {
      countries.push(row.country);
    });
  } catch (err) {
    console.log(err);
  }
  const output = {
    userID: currentUserId,
    colour: colour,
    countries: countries,
  };
  // console.log(output);
  return output;
}

app.get("/", async (req, res) => {
  users = await getUsers();
  const output = await checkVisited(currentUserId);
  // console.log(output);
  res.render("index.ejs", {
    countries: output.countries,
    total: output.countries.length,
    users: users,
    color: output.colour,
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()],
    );
    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId],
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  console.log(req.body);
  if (req.body.add) {
    res.render("new.ejs");
  } else {
    const userToGet = req.body.user;
    currentUserId = userToGet;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  console.log(req.body);
  const result = await db.query(
    "INSERT INTO users (name, colour) VALUES ($1, $2) RETURNING id, name, colour color",
    [req.body.name, req.body.color],
  );
  const newUserId = result.rows[0].id;
  currentUserId = newUserId;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
