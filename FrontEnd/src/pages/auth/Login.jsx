import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import loginBg from '@/assets/logincasaw.avif'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })

      // Redirect to dashboard on successful login
      navigate('/pages/dashboard')
    } catch (err) {
      setError(err.message || 'An error occurred during login')
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


      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative z-10" style={{backgroundColor: '#99b1cef5'}}>
        <div className="flex">
          {/* Login Form */}
          <div className="w-full p-6 lg:p-8">
            <div className="max-w-xs mx-auto">
              <div className="flex items-center justify-center mb-5">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Sign In</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-xs text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
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
                  className="w-full py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* <div className="mt-5">
                <Button variant="outline" className="w-full">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div> */}

              {/* <p className="mt-5 text-center text-xs text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-800">
                  Sign up for free
                </a>
              </p> */}
            </div>
          </div>
        </div>
      </Card>
    </div>


  )
}

export default Login
