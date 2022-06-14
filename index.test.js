const request = require('supertest')

describe('REST Api', () => {
    test('Should return welcome to responder', async () => {
        const response = await request('http://localhost:3000')
            .get('/')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(200)

        expect(response.text).toMatch('Welcome to responder!')
    })

    test('Should add a question', async () => {
        const response = await request('http://localhost:3000')
            .post('/questions')
            .send({
                question: 'What does the fox say?'
            })

        expect(response.statusCode).toEqual(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('author')
        expect(response.body).toHaveProperty('summary')
        expect(response.body).toHaveProperty('answers')
        expect(response.body).not.toHaveProperty('answersss')
    })

    test('Should return list of 2 questions', async () => {
        const response = await request('http://localhost:3000')
            .post('/questions')
            .send({
                question: 'My question is...'
            })

        const getQuestions = await request('http://localhost:3000')
            .get('/questions')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(200)

        expect(getQuestions.body).toHaveLength(2)
    })
})