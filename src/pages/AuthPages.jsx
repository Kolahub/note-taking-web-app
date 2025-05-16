// import React from 'react'
import PropTypes from 'prop-types';

import AuthForm from "../components/auth/AuthForm"

function AuthPages({ mode }) {
  return (
    <div className="relative bg-blue-100 dark:bg-gray-800 w-full min-h-screen p-4 sm:px-8 sm:py-16 overflow-x-hidden">
        <div className="flex flex-col justify-center items-center h-full w-full max-w-4xl mx-auto">
        <AuthForm mode={mode} />

        </div>
    </div>
  )
}
AuthPages.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default AuthPages;