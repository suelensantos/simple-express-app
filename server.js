const express = require('express')

const app = express()
// app.use(express.json()) - é um middleware global usado para analisar JSON
// habilita análise JSON para os requests recebidos (para trabalhar com o corpo da requisição)
app.use(express.json())

// In-memory database (os filmes serão armazenados em um array de memória para fins de demonstração)
// Em aplicação real, você deve usar banco de dados como MongoDB e PostgreSQL
const movies = []

// validateMovie - Middleware personalizado para validar o input para os requests POST e PUT
// Isto mantém a lógica de validação separada e reutilizável, ajudando a manter os manipuladores de rotas limpos e RESTful.
const validateMovie = (req, res, next) => {
  if (!req.body.title || !req.body.genre || !req.body.year) {
    return res.status(400).send('Title, genre, and year are required.')
  }
  next() // passa o controle para o próximo middleware ou rota
}

// Get all movies
app.get('/movies', (_req, res) => {
  res.json(movies)
  console.log(movies)
})

// Get a particular movie by ID
app.get('/movies/:movieId', (req, res) => {
  const movie = movies.find(movie => movie.id === parseInt(req.params.movieId))
  if (!movie) return res.status(404).send('Movie not found.')
  res.json(movie)
})

// Add a new movie
app.post('/movies', validateMovie, (req, res) => {
  const movie = {
    id: movies.length + 1,
    title: req.body.title,
    genre: req.body.genre,
    year: req.body.year
  }

  movies.push(movie)
  res.status(201).json(movie)
})

// Update a movie
app.put('/movies/:movieId', validateMovie, (req, res) => {
  const movie = movies.find(movie => movie.id === parseInt(req.params.movieId))
  if (!movie) return res.status(404).send('Movie not found.')
  
  movie.title = req.body.title
  movie.genre = req.body.genre
  movie.year = req.body.year

  res.json(movie)
})

// Delete a movie
app.delete('/movies/:movieId', (req, res) => {
  const movieIndex = movies.findIndex(movie => movie.id === parseInt(req.params.movieId))
  if (movieIndex === -1) return res.status(404).send('Movie not found.')

  const deletedMovie = movies.splice(movieIndex, 1)
  res.json(deletedMovie)
})

app.listen(3000, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:3000`)
})