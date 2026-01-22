'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        className: '!bg-background !text-foreground',
        success: {
          className: '!bg-green-50 !text-green-800 border border-green-200',
          iconTheme: {
            primary: '#10b981',
            secondary: 'white',
          },
        },
        error: {
          className: '!bg-red-50 !text-red-800 border border-red-200',
          iconTheme: {
            primary: '#ef4444',
            secondary: 'white',
          },
        },
        loading: {
          className: '!bg-blue-50 !text-blue-800 border border-blue-200',
        },
      }}
    />
  )
}
