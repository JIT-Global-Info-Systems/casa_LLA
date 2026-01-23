import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/services/api'
import { toast } from 'react-hot-toast'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Client-side validation
    if (!email) {
      toast.error('Email is required')
      return
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    const loadingToast = toast.loading('Sending password reset instructions...')
    setIsLoading(true)

    try {
      const response = await authAPI.forgotPassword(email)
      
      // Show success message
      toast.success(response.message || 'Password reset link has been sent to your email', {
        id: loadingToast,
        duration: 4000
      })

      // Clear email field after successful submission
      setEmail('')

      // Redirect to verify OTP page after a short delay
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } })
      }, 2000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send password reset instructions. Please try again.'
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000
      })
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

      <Card 
        className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative z-10 bg-blue-50" 
        style={{backgroundColor: "#5b92bcc9"}}
      >
        <div className="flex">
          <div className="w-full p-6 lg:p-8">
            <div className="max-w-xs mx-auto">
              {/* Header */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">Forgot Password</h2>
              </div>

              <p className="text-xs text-gray-700 text-center mb-6">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  className="w-full py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs text-blue-600 hover:underline font-medium">
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

export default ForgotPassword
