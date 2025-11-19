import React from 'react'
import { Link } from 'react-router-dom'
import { AuthProvider } from '../providers/AuthProvider'
import RegisterComponent from '../components/auth/RegisterComponent'

export default function Register() {
  return (
    <AuthProvider>
      <RegisterComponent />
    </AuthProvider>
  )
}
