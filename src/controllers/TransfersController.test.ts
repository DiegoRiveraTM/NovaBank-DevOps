import {transfers} from './transactionController'

jest.mock('../models/users', () => {
    return {
        __esModule: true,
        default: {
            findById: jest.fn(),
            updateOne: jest.fn(),
        }
    }
})

describe('Transfer Controller', () => {

    it('Should return 400 if the amount or CLABE is not provided', async() => {
        const User = require('../models/users').default;
        User.findById.mockResolvedValue({ id: 'user123' });

        const req={
            user: {id: 'user123'},
            body: {}
        }
        const res={
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await transfers(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: "Amount and CLABE are required"
        })
    })

    it('Should return 404 if a Sender is not found', async() =>{
        const User = require('../models/users').default;
        User.findById.mockResolvedValue(null);

        const req={
            user: {id: 'user123'},
            body: {amount: 200, clabe: '123456789123456789'}
        }
        const res={
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await transfers(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            message: "Sender not found"
        })
    })

    it('should return 400 if amount is of deposit is 0', async() => {
            const User = require('../models/users').default;
            User.findById.mockResolvedValue({ id: 'user123', balance: 1000});
            const req = {
                user: { id: 'user123'},
                body: { amount: 0, clabe:'123456789123456789', saveUser: false}
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            await transfers(req as any, res as any)
    
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Amount should be more than 0"
            })
        })
    
        it('should return 400 if amount is negative', async() =>{
            const User = require('../models/users').default;
            User.findById.mockResolvedValue({ id: 'user123', balance: 1000});
            const req = {
                user: { id: "user123"},
                body: { amount: -320, clabe: '123456789123456789', saveUser: false}
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            await transfers(req as any, res as any)
    
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Amount should be more than 0"
            })
        })
//Gracias papa dio, por dejarme pasar estos tests unitarios
})