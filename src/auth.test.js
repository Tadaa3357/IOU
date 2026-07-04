import { describe, expect, it } from 'vitest'
import { authenticateUser, registerUser } from './auth'

describe('auth helpers', () => {
    it('registers a new user and stores them locally', () => {
        localStorage.clear()

        const result = registerUser({ name: 'Ada', email: 'ada@example.com', password: 'secret123' })

        expect(result.success).toBe(true)
        expect(result.user.email).toBe('ada@example.com')
        expect(localStorage.getItem('iou-users')).toContain('ada@example.com')
    })

    it('rejects a duplicate email during sign-up', () => {
        localStorage.clear()
        registerUser({ name: 'Ada', email: 'ada@example.com', password: 'secret123' })

        const result = registerUser({ name: 'Grace', email: 'ada@example.com', password: 'another' })

        expect(result.success).toBe(false)
        expect(result.message).toContain('already exists')
    })

    it('authenticates an existing user', () => {
        localStorage.clear()
        registerUser({ name: 'Linus', email: 'linus@example.com', password: 'open-source' })

        const result = authenticateUser({ email: 'linus@example.com', password: 'open-source' })

        expect(result.success).toBe(true)
        expect(result.user.name).toBe('Linus')
    })
})
