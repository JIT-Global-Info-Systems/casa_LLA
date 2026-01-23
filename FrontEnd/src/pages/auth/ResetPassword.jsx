import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/services/api'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
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
      toast.error('New password is required')
      return
    }

    if (!validatePassword(newPassword)) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    if (!confirmPassword) {
      toast.error('Please confirm your password')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const resetToken = localStorage.getItem('reset_token')
    if (!resetToken) {
      toast.error('Reset token not found. Please start the password reset process again.')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.resetPassword(resetToken, newPassword)
      toast.success(response.message || 'Password reset successfully! Redirecting to login...')

      // Clear reset token and email from localStorage
      localStorage.removeItem('reset_token')
      localStorage.removeItem('reset_email')

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error resetting password'
      toast.error(errorMessage)
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">Reset Password</h2>
              </div>

              <p className="text-xs text-gray-700 text-center mb-6">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
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
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {error && (
                  <div className="text-red-500 text-xs mb-2">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-green-600 text-xs mb-2">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword
