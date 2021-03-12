const request = require('supertest')
const app = require('../index')
const CompanyModel = require('../models/company.model')
const UserModel = require('../models/user.model')
const faker = require('faker')

describe('Company Controller', () => {
    /** @type {string} Id of the item created */
    let id

    const company = {
        data: {
            type: "companies",
            attributes: {
                name: faker.company.companyName()
            }
        }
    }

    test('It should post', async (done) => {
        const res = await request(app)
            .post('/api/companies')
            .send(company)
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(201)
        expect(res.body?.data?.id).toBeDefined()
        id = res.body?.data?.id
        done()
    })

    test('It should not post', async (done) => {
        const res = await request(app)
            .post('/api/companies')
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(400)
        done()
    })

    test('It should get data', async (done) => {
        const res = await request(app)
            .get('/api/companies')

        expect(res.status).toEqual(200)
        expect(res.body?.data?.length).toBeGreaterThanOrEqual(1)
        done()
    })

    test('It should get by id', async (done) => {
        const res = await request(app)
            .get(`/api/companies/${id}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not get by id', async (done) => {
        const res = await request(app)
            .get(`/api/companies/123`)

        expect(res.status).toEqual(404)
        done()
    })

    test('It should patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/companies/${id}`)
            .send({ data: { ...company.data, id } })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/companies/${id}`)
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(400)
        done()
    })

    test('It should delete by id', async (done) => {
        const res = await request(app)
            .delete(`/api/companies/${id}`)

        expect(res.status).toEqual(204)
        done()
    })

    beforeAll(async () => {
        await UserModel.deleteMany({})
        await CompanyModel.deleteMany({})
    })
})