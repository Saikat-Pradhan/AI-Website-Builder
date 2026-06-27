import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App.jsx'

const LiveSite = () => {
    const { id } = useParams()
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-slug/${id}`, { withCredentials: true })
                setWebsite(result.data)
                setCode(result.data.latestCode)
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || "Something went wrong")
            }
        }

        handleGetWebsite()
    }, [id])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>
                {error}
            </div>
        )
    }

    if (!website) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>
                Loading...
            </div>
        )
    }

    return (
        <iframe
            title='Live Site'
            srcDoc={code}
            className='w-screen h-screen border-none'
            sandbox='allow-scripts allow-same-origin allow-forms'
        />
    )
}

export default LiveSite
