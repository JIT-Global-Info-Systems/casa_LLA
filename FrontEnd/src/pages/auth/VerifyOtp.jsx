import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/services/api'

function VerifyOtp() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get email from location state or localStorage
    if (location.state?.email) {
      setEmail(location.state.email)
    } else {
      // Try to get from localStorage as fallback
      const storedEmail = localStorage.getItem('reset_email')
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        // No email found, redirect to forgot password
        navigate('/forgot-password')
      }
    }
  }, [location.state, navigate])

  const validateOtp = (otp) => {
    // OTP should be exactly 6 digits
    return /^\d{6}$/.test(otp)
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

    if (!otp) {
      setError('OTP is required')
      return
    }

    if (!validateOtp(otp)) {
      setError('OTP must be exactly 6 digits')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.verifyOtp(email, otp)
      setSuccess(response.message || 'OTP verified successfully')

      // Store reset token and email for next step
      if (response.resetToken) {
        localStorage.setItem('reset_token', response.resetToken)
        localStorage.setItem('reset_email', email)
      }

      // Redirect to reset password page after 1 second
      setTimeout(() => {
        navigate('/reset-password')
      }, 1000)
    } catch (err) {
      setError(err.message || 'Error verifying OTP')
      console.error('Verify OTP error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await authAPI.forgotPassword(email)
      setSuccess(response.message || 'OTP has been resent to your email')
    } catch (err) {
      setError(err.message || 'Error resending OTP')
      console.error('Resend OTP error:', err)
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Verify OTP</h2>
            </div>

            <p className="text-xs text-gray-600 text-center mb-4">
              Enter the 6-digit OTP sent to your email address.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <Input
                label="OTP Code"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  // Only allow digits and max 6 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setOtp(value)
                }}
                maxLength={6}
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
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                disabled={isLoading}
              >
                Resend OTP
              </button>

              <div>
                <Link to="/login" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default VerifyOtp
