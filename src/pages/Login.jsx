import React from 'react'
import { AuthProvider} from '../providers/AuthProvider'
import LoginComponent from '../components/auth/LoginComponent'

export default function Login() {
  return (
    <AuthProvider>
      <LoginComponent />
    </AuthProvider>
  )
}
