"use client"

import React from 'react'

const Page = async ({ params }: { params: Promise<{ supervisorId: string }> }) => {

    const { supervisorId } = await params

    return (
        <div>{supervisorId}</div>
    )
}

export default Page