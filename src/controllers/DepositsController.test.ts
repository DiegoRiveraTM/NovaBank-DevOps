import {deposits} from './transactionController'
//Deposits Controller Unit tests

//Esto me costo un poco, las pruebas unitarias deben de usar datos mock, entonces no deben de conectarse a la bd
jest.mock('../models/users', () => {
    return {
        __esModule: true,
        default: {
            findById: jest.fn(),
            updateOne: jest.fn(),
        }
    }
})

describe('deposits controller', () => {

    it('should return 400 if amount is not provided', async () => {
        const User = require('../models/users').default;
        User.findById.mockResolvedValue({ id: 'user123' });
        const req = {
            user: { id: 'user123' },
            body: {}  //sin amount
            }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await deposits(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
        message: "Amount is required and must be a number"
        })
    })

    it('should return 400 if amount is of deposit is 0', async() => {
        const User = require('../models/users').default;
        User.findById.mockResolvedValue({ id: 'user123' });
        const req = {
            user: { id: 'user123'},
            body: { amount: 0}
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        await deposits(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: "Amount should be more than 0"
        })
    })

    it('should return 400 if amount is negative', async() =>{
        const User = require('../models/users').default;
        User.findById.mockResolvedValue({ id: 'user123' });
        const req = {
            user: { id: "user123"},
            body: { amount: -320}
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        await deposits(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: "Amount should be more than 0"
        })
    })

    it('should return 400 if user id its not provided', async() =>{
        const User = require('../models/users').default;
        User.findById.mockResolvedValue({ id: 'user123' });
        const req = {
            user: {},
            body: { amount: 5}
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        await deposits(req as any, res as any)
        
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: "UserId not provided"
        })
    })

})

