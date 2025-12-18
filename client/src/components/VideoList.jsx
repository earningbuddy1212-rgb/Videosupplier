import React, { useState } from 'react'

import { API } from '../config'

function Player({ src }) {
  return (
    <div className="player">
      <video controls width="720" preload="metadata" src={src} />
    </div>
  )
}

export default function VideoList({ videos }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="video-list">
      <div className="list">
        {videos.length === 0 && <div className="empty">No videos yet</div>}
        {videos.map(v => (
          <div key={v.name} className="video-item" onClick={() => setSelected(v)}>
            <div className="thumb">🎬</div>
            <div className="meta">
              <div className="name">{v.originalname || v.name}</div>
              <div className="size">{(v.size/1024/1024).toFixed(2)} MB</div>
            </div>
          </div>
        ))}
      </div>
      <div className="player-area">
        {selected ? <Player src={`${API}/videos/${encodeURIComponent(selected.name)}`} /> : <div className="empty-player">Select a video to play</div>}
      </div>
    </div>
  )
}
