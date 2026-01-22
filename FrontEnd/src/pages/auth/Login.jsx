import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import loginBg from '@/assets/logincasaw.avif'
import toast from 'react-hot-toast'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login, forcePasswordChange } = useAuth()

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
     
      // if (forcePasswordChange) {
      //   navigate('/first-time-password-change', {
      //     state: {
      //       isFirstLogin: true,
      //       message: 'This is your first login. Please change your password to continue.'
      //     }
      //   })
      // } else {
        toast.success('Login successful! Redirecting...')
        navigate('/pages/dashboard')
      // }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Login error:', err)
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

      {/* Animated Clouds */}
      {/* <div className="absolute top-10 w-32 h-16 bg-white rounded-full opacity-70 animate-cloud-slow"></div>
      <div className="absolute top-20 w-40 h-20 bg-white rounded-full opacity-60 animate-cloud-medium"></div>
      <div className="absolute top-32 w-28 h-14 bg-white rounded-full opacity-80 animate-cloud-fast"></div>
      <div className="absolute top-40 w-36 h-18 bg-white rounded-full opacity-50 animate-cloud-slow"></div>

      <style jsx>{`
        @keyframes cloud-slow {
          from { transform: translateX(-200px); }
          to { transform: translateX(calc(100vw + 200px)); }
        }
        @keyframes cloud-medium {
          from { transform: translateX(-250px); }
          to { transform: translateX(calc(100vw + 250px)); }
        }
        @keyframes cloud-fast {
          from { transform: translateX(-180px); }
          to { transform: translateX(calc(100vw + 180px)); }
        }
        .animate-cloud-slow {
          animation: cloud-slow 30s linear infinite;
        }
        .animate-cloud-medium {
          animation: cloud-medium 20s linear infinite;
        }
        .animate-cloud-fast {
          animation: cloud-fast 15s linear infinite;
        }
      `}</style> */}

      {/* Test animaton */}

      <Card 
  className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative z-10 bg-blue-50" style={{backgroundColor:"#5b92bcc9"}}
>
  <div className="flex">
    <div className="w-full p-6 lg:p-8">
      <div className="max-w-xs mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800">Sign In</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded"
              />
              <span className="ml-2 text-xs text-gray-600">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="text-red-500 text-xs mb-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  </div>
</Card>

    </div>


  )
}

export default Login
