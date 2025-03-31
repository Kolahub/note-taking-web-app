// import React from 'react'
import PropTypes from 'prop-types';

import AuthForm from "../components/AuthForm"

function AuthPages({ mode }) {
  return (
    <div className="relative bg-slate-100 w-screen h-screen p-4 sm:p-8">
        <div className="flex flex-col justify-center items-center h-full w-full">
        <AuthForm mode={mode} />

        </div>
    </div>
  )
}
AuthPages.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default AuthPages;