// import React from 'react'

import AuthForm from "../components/AuthForm"

function AuthPages() {
  return (
    <div className="relative bg-slate-100 w-screen h-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <AuthForm />

        </div>
    </div>
  )
}

export default AuthPages