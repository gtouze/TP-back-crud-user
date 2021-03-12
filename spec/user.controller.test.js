const request = require('supertest')
const app = require('../index')
const CompanyModel = require('../models/company.model')
const UserModel = require('../models/user.model')
const faker = require('faker')

describe('Use Controller', () => {
    /** @type {string} Id of the item created */
    let id

    const user = {
        data: {
            type: "users",
            attributes: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                userType: faker.random.arrayElement(['employee', 'client']),
                employeeDashboard: faker.random.boolean(),
                clientDashboard: faker.random.boolean(),
                admin: faker.random.boolean()
            }
        }
    }

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
            .post('/api/users')
            .send(user)
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(201)
        expect(res.body?.data?.id).toBeDefined()
        id = res.body?.data?.id
        done()
    })

    test('It should not post', async (done) => {
        const res = await request(app)
            .post('/api/users')
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(400)
        done()
    })

    test('It should get data', async (done) => {
        const res = await request(app)
            .get('/api/users')

        expect(res.status).toEqual(200)
        expect(res.body?.data?.length).toBeGreaterThanOrEqual(1)
        done()
    })

    test('It should get by id', async (done) => {
        const res = await request(app)
            .get(`/api/users/${id}`)

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not get by id', async (done) => {
        const res = await request(app)
            .get(`/api/users/123`)

        expect(res.status).toEqual(404)
        done()
    })

    test('It should patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/users/${id}`)
            .send({ data: { ...user.data, id } })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(200)
        expect(res.body?.data?.id).toEqual(id)
        done()
    })

    test('It should not patch by id', async (done) => {
        const res = await request(app)
            .patch(`/api/users/${id}`)
            .send({ data: {} })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(400)
        done()
    })

    test('It should delete by id', async (done) => {
        const res = await request(app)
            .delete(`/api/users/${id}`)

        expect(res.status).toEqual(204)
        done()
    })

    test('It should post with company', async (done) => {
        const companyId = (
            await request(app)
                .post('/api/companies')
                .send(company)
                .set("Content-Type", "application/vnd.api+json")
        ).body?.data?.id

        const res = await request(app)
            .post('/api/users?includes=companies')
            .send({
                data: {
                    ...user.data,
                    relationships: {
                        companyId: {
                            data: {
                                id: companyId,
                                type: "companies"
                            }
                        }
                    }
                }
            })
            .set("Content-Type", "application/vnd.api+json")

        expect(res.status).toEqual(201)
        expect(res.body?.data?.id).toBeDefined()
        expect(res.body?.data?.relationships?.companyId?.data?.id).toEqual(companyId)
        done()
    })

    beforeAll(async () => {
        await UserModel.deleteMany({})
        await CompanyModel.deleteMany({})
    })
})