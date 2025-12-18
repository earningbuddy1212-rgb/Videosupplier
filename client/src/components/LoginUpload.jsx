import React, { useState } from 'react'

import { API } from '../config'

export default function LoginUpload({ onUploaded }) {
  const [token, setToken] = useState(localStorage.getItem('vs_token') || '')
  const [password, setPassword] = useState('')
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')

  const login = async () => {
    setMsg('')
    const res = await fetch(`${API}/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) {
      const { token } = await res.json()
      localStorage.setItem('vs_token', token)
      setToken(token)
      setMsg('Logged in')
    } else {
      setMsg('Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('vs_token')
    setToken('')
    setMsg('Logged out')
  }

  const upload = async () => {
    if (!file) return setMsg('No file selected')
    setMsg('Uploading...')
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API}/upload`, { method: 'POST', body: fd, headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      setMsg('Uploaded')
      setFile(null)
      onUploaded()
    } else {
      setMsg('Upload failed: ' + (await res.text()))
    }
  }

  return (
    <div className="login-upload">
      {!token ? (
        <div className="login">
          <input placeholder="owner password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div className="logged">
          <input type="file" onChange={e => setFile(e.target.files?.[0])} />
          <button onClick={upload}>Upload</button>
          <button onClick={logout} className="muted">Logout</button>
        </div>
      )}
      <div className="msg">{msg}</div>
    </div>
  )
}
