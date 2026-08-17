import { useState, useRef, useEffect, useCallback } from 'react';

export interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number; // in seconds
  waveformData: number[];
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => { duration: string; waveform: number[]; audioUrl: string };
  cancelRecording: () => void;
}

export function useVoiceRecorder(): VoiceRecordingState {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const timerRef = useRef<number | null>(null);
  const waveIntervalRef = useRef<number | null>(null);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setWaveformData([20, 35, 50, 25, 40]);

    // Timer tick every second
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Waveform simulation tick every 100ms
    waveIntervalRef.current = window.setInterval(() => {
      setWaveformData(prev => {
        const nextVal = Math.floor(Math.random() * 65) + 15;
        const newArr = [...prev, nextVal];
        return newArr.slice(-30); // Keep last 30 bars
      });
    }, 120);
  }, []);

  const pauseRecording = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
  }, []);

  const resumeRecording = useCallback(() => {
    setIsPaused(false);
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    waveIntervalRef.current = window.setInterval(() => {
      setWaveformData(prev => {
        const nextVal = Math.floor(Math.random() * 65) + 15;
        const newArr = [...prev, nextVal];
        return newArr.slice(-30);
      });
    }, 120);
  }, []);

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
  };

  const cancelRecording = useCallback(() => {
    clearTimers();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setWaveformData([]);
  }, []);

  const stopRecording = useCallback(() => {
    const finalSecs = recordingTime || 1;
    const mins = Math.floor(finalSecs / 60);
    const secs = finalSecs % 60;
    const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    const result = {
      duration: durationStr,
      waveform: waveformData.length > 0 ? [...waveformData] : [30, 45, 60, 40, 25, 70, 50, 30],
      audioUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg',
    };

    clearTimers();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setWaveformData([]);

    return result;
  }, [recordingTime, waveformData]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return {
    isRecording,
    isPaused,
    recordingTime,
    waveformData,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
  };
}
