const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// Get Movies API 1

app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT movie_name AS movieName FROM movie;`;
  const dbResponse = await db.all(getMovieQuery);
  response.send(dbResponse);
});

// Create a new Movie API 2

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMoviequery = `
    INSERT INTO 
    movie (director_id,movie_name,lead_actor)
    VALUES (${directorId},"${movieName}","${leadActor}");`;
  const dbResponse = await db.run(addMoviequery);
  response.send("Movie Successfully Added");
});

// Get a movie based on id API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT 
        movie_id AS movieId,
        director_id AS directorId,
        movie_name AS movieName,
        lead_actor AS leadActor 
    FROM 
        movie WHERE movie_id = ${movieId};`;
  const dbResponse = await db.get(getMovieQuery);
  response.send(dbResponse);
});

// Update a movie based on movieId API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;

  const updateMovieQuery = `
    UPDATE
    movie
    SET
    director_id = ${directorId},
    movie_name = "${movieName}",
    lead_actor = '${leadActor}'
  WHERE
    movie_id = ${movieId};`;

  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//delete movie name based on movieId API 5

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    delete from  movie where movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

// Get Directors API 6

app.get("/directors/", async (request, response) => {
  const getDirectoryQuery = `
    SELECT
        director_id AS directorId,
        director_name AS directorName 
    FROM 
        director;`;
  const dbResponse = await db.all(getDirectoryQuery);
  response.send(dbResponse);
});

// Get movie names directed by a specific director  API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectoryQuery = `
    SELECT 
        movie_name AS movieName 
    FROM 
        movie 
    where 
        director_id =${directorId};`;
  const dbResponse = await db.all(getDirectoryQuery);
  response.send(dbResponse);
});

module.exports = app;
