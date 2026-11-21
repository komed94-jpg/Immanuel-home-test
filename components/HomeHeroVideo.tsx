"use client";

import { useEffect, useRef, useState } from "react";

const source = "/videos/hero-city-cross-orbit-paced.mp4";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (document.hidden || reducedMotion.matches || userPaused.current) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) video.src = source;
      void video.play().catch(() => setPlaying(false));
    };
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      userPaused.current = true;
      video.pause();
    } else {
      userPaused.current = false;
      if (!video.getAttribute("src")) video.src = source;
      void video.play().catch(() => setPlaying(false));
    }
  };

  return <>
    <video
      ref={videoRef}
      className={`home-hero-video${ready ? " is-ready" : ""}`}
      poster="/images/hero-city-cross-video-poster.jpg"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onLoadedData={() => setReady(true)}
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onError={() => { setReady(false); setPlaying(false); }}
    />
    <button className="home-hero-motion-toggle" type="button" onClick={togglePlayback}>
      <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
      {playing ? "배경영상 멈춤" : "배경영상 재생"}
    </button>
  </>;
}
