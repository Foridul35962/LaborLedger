"use client"

import ForgetPassPage from '@/components/auth/ForgetPassPage'
import ResetPass from '@/components/auth/ResetPass'
import VerifyPass from '@/components/auth/VerifyPass'
import React, { useState } from 'react'

const page = () => {
  const [email, setEmail] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  return (
    <>
      {
        !email ? <ForgetPassPage setEmail={setEmail} /> : (
          !isVerified ? <VerifyPass email={email} setIsVerified={setIsVerified} /> :
            <ResetPass email={email} />
        )
      }
    </>
  )
}

export default page