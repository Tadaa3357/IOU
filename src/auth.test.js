import { describe, expect, it } from 'vitest'
import { getAuthErrorMessage } from './auth'

describe('auth helpers', () => {
    it('returns a friendly message for email rate limits', () => {
        const message = getAuthErrorMessage({ message: 'Email rate exceeded' })

        expect(message).toContain('wait a few minutes')
        expect(message).toContain('different email')
    })

    it('returns the original message for unrelated errors', () => {
        const message = getAuthErrorMessage({ message: 'Invalid login credentials' })

        expect(message).toBe('Invalid login credentials')
    })
})
