import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/services/api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Client-side validation
    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.forgotPassword(email)
      setSuccess(response.message || 'If your email is registered, you will receive an OTP to reset your password')

      // Clear email field after successful submission
      setEmail('')

      // Redirect to verify OTP page after 2 seconds
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } })
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error processing forgot password request')
      console.error('Forgot password error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative pt-20 overflow-hidden"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg')"
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative z-10" style={{backgroundColor: '#99b1cef5'}}>
        <div className="w-full p-6 lg:p-8">
          <div className="max-w-xs mx-auto">
            <div className="flex items-center justify-center mb-5">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Forgot Password</h2>
            </div>

            <p className="text-xs text-gray-600 text-center mb-4">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              {error && (
                <div className="text-red-500 text-xs">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-xs">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPassword
