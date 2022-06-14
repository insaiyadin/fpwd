const express = require('express')
const {
  urlencoded,
  json
} = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({
  extended: true
}))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to responder!'
  })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const {
    questionId
  } = req.params

  try {
    const question = await req.repositories.questionRepo.getQuestionById(questionId)
    return res.json(question)
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
})

app.post('/questions', async (req, res) => {
  const {
    question
  } = req.body

  if (!question) {
    return res.status(400).json({
      message: "Ask some question"
    })
  }

  const questionId = await req.repositories.questionRepo.addQuestion(question)
  const newQuestion = await req.repositories.questionRepo.getQuestionById(questionId)

  res.status(201).json(newQuestion)
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const {
    questionId
  } = req.params
  try {
    const answers = await req.repositories.questionRepo.getAnswers(questionId)
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }

  res.json(answers)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const {
    questionId
  } = req.params

  const {
    answer
  } = req.body

  if (!answer) {
    return res.status(400).json({
      details: "Give some answer"
    })
  }

  try {
    const answerId = await req.repositories.questionRepo.addAnswer(questionId, answer)
    const newAnswer = await req.repositories.questionRepo.getAnswer(questionId, answerId)
    res.status(201).json(newAnswer)
  } catch (error) {
    return res.status(400).json({
      details: error.message
    })
  }

})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const {
    questionId,
    answerId
  } = req.params

  const answer = await req.repositories.questionRepo.getAnswer(questionId, answerId)

  res.json(answer)
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})