const {
  readFile,
  writeFile
} = require('fs/promises')
// uuid
const {
  v4
} = require('uuid')

const {
  getFileContent,
  saveFileContent
} = require('../file_utils')

const {
  faker
} = require('@faker-js/faker')

exports.makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const questions = await getFileContent(fileName)
    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    const question = questions.find(q => q.id === questionId)
    if (!question) {
      throw new Error('This question does not exist')
    }
    return question
  }

  const addQuestion = async question => {
    const questions = await getQuestions()

    const copiedArr = [...questions]

    const newId = v4()

    const newQuestion = {
      id: newId,
      author: `${faker.name.firstName()} ${faker.name.lastName()}`,
      summary: question,
      answers: []
    }
    copiedArr.push(newQuestion)

    await saveFileContent(fileName, copiedArr)
    return newId
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)

    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const question = await getQuestionById(questionId)
    const answer = (question.answers).find(a => a.id === answerId)
    if (!answer) {
      throw new Error("This answer does not exist")
    }
    return answer
  }

  const addAnswer = async (questionId, answer) => {
    const questions = await getQuestions()
    const copyQuestions = [...questions]

    const question = await getQuestionById(questionId)
    const questionsIndex = questions.findIndex(q => q.id === questionId)

    const newId = v4()
    const newAnswer = {
      id: newId,
      author: `${faker.name.firstName()} ${faker.name.lastName()}`,
      summary: answer,
    }

    const copyQuestion = {
      ...question,
      answers: [...question.answers, newAnswer]
    }

    copyQuestions[questionsIndex] = copyQuestion

    await saveFileContent(fileName, copyQuestions)

    return newId
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}