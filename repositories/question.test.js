const {
  writeFile,
  rm
} = require('fs/promises')
const {
  faker
} = require('@faker-js/faker')
const {
  makeQuestionRepository
} = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [{
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should add and return a list of 3 questions', async () => {
    const question = {
      id: faker.datatype.uuid(),
      summary: 'Who are you?',
      author: 'Tim Doods',
      answers: []
    }
    const questionId = await questionRepo.addQuestion(question)

    expect(await questionRepo.getQuestions()).toHaveLength(3)
    expect((await questionRepo.getQuestionById(questionId)).id).toMatch(questionId)
  })

  test('should return proper question', async () => {
    const question = "What is wrong here?"
    const newId = await questionRepo.addQuestion(question)

    const addedQuestion = await questionRepo.getQuestionById(newId)

    expect(addedQuestion.id).toMatch(newId)
    expect(addedQuestion.summary).toMatch(question)
  })

  test('should add and return proper answers', async () => {
    const question = "What is wrong here?"
    const questionId = await questionRepo.addQuestion(question)

    const answer = "Everything's fine"
    await questionRepo.addAnswer(questionId, answer)

    const getAnswers = await questionRepo.getAnswers(questionId)

    expect(getAnswers).toHaveLength(1)
  })

  test('should add and return proper answer', async () => {
    const question = "What is wrong here?"
    const questionId = await questionRepo.addQuestion(question)

    const answer = "Everything's fine"
    const answerId = await questionRepo.addAnswer(questionId, answer)

    const getAnswer = await questionRepo.getAnswer(questionId, answerId)

    expect(getAnswer.id).toMatch(answerId)
    expect(getAnswer.summary).toMatch(answer)
  })

})