import { useEffect, useState } from 'react'
import { BUNDLED_SERMONS, fetchLatestSermons } from '../lib/sermons.js'

export function useSermons() {
  const [videos, setVideos] = useState(BUNDLED_SERMONS)
  useEffect(() => {
    const controller = new AbortController()
    fetchLatestSermons(controller.signal)
      .then(setVideos)
      .catch(() => {
        /* keep the copy bundled at build time */
      })
    return () => controller.abort()
  }, [])
  return videos
}
