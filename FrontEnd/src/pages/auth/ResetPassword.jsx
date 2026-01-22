import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/services/api'

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if reset token exists
    const resetToken = localStorage.getItem('reset_token')
    if (!resetToken) {
      // No token found, redirect to forgot password
      navigate('/forgot-password')
    }
  }, [navigate])

  const validatePassword = (password) => {
    // Basic password validation - at least 6 characters
    return password.length >= 6
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Client-side validation
    if (!newPassword) {
      setError('New password is required')
      return
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (!confirmPassword) {
      setError('Please confirm your password')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const resetToken = localStorage.getItem('reset_token')
    if (!resetToken) {
      setError('Reset token not found. Please start the password reset process again.')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.resetPassword(resetToken, newPassword)
      setSuccess(response.message || 'Password reset successful')

      // Clear reset token and email from localStorage
      localStorage.removeItem('reset_token')
      localStorage.removeItem('reset_email')

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error resetting password')
      console.error('Reset password error:', err)
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Reset Password</h2>
            </div>

            <p className="text-xs text-gray-600 text-center mb-4">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

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
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword
