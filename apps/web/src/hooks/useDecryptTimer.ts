'use client';

import { useState, useEffect, useCallback } from 'react';

export function useDecryptTimer(durationMs: number = 10000) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const show = useCallback(() => {
    setIsVisible(true);
    setProgress(100);
    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      hide();
    }, durationMs);

    progressIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.max(0, 100 - (elapsed / durationMs) * 100);
        setProgress(newProgress);
      }
    }, 50);
  }, [durationMs]);

  const hide = useCallback(() => {
    setIsVisible(false);
    setProgress(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return { isVisible, progress, show, hide, toggle };
}

import { useRef } from 'react';