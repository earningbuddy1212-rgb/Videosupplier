import React, { useEffect, useState } from 'react'
import VideoList from './components/VideoList'
import LoginUpload from './components/LoginUpload'

const API = 'http://localhost:4000'

export default function App() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    fetch(`${API}/videos`).then(r => r.json()).then(setVideos).catch(console.error)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>Video Supplier</h1>
        <LoginUpload onUploaded={() => fetch(`${API}/videos`).then(r => r.json()).then(setVideos)} />
      </header>
      <main>
        <VideoList videos={videos} />
      </main>
    </div>
  )
}
