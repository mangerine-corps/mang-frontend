import { useState, useEffect } from 'react';

export type CountdownUrgency = 'future' | 'soon' | 'imminent' | 'now';

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
  label: string;
  urgency: CountdownUrgency;
}

const EMPTY: CountdownResult = {
  days: 0, hours: 0, minutes: 0, seconds: 0,
  totalSeconds: 0, isPast: false, label: '', urgency: 'future',
};

function compute(targetMs: number): CountdownResult {
  const diff = Math.floor((targetMs - Date.now()) / 1000);
  if (diff <= 0) {
    return { ...EMPTY, totalSeconds: diff, isPast: true, label: 'Starting now', urgency: 'now' };
  }
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  let label: string;
  if (days > 0) label = `in ${days}d ${hours}h`;
  else if (hours > 0) label = `in ${hours}h ${minutes}m`;
  else if (minutes >= 1) label = `in ${minutes}m ${seconds}s`;
  else label = `in ${seconds}s`;

  let urgency: CountdownUrgency = 'future';
  if (diff < 60) urgency = 'now';
  else if (diff < 15 * 60) urgency = 'imminent';
  else if (diff < 60 * 60) urgency = 'soon';

  return { days, hours, minutes, seconds, totalSeconds: diff, isPast: false, label, urgency };
}

export function useCountdown(targetDate: Date | string | number | null | undefined): CountdownResult {
  const targetMs = targetDate ? new Date(targetDate as any).getTime() : null;
  const valid = targetMs !== null && !isNaN(targetMs);

  const [result, setResult] = useState<CountdownResult>(() => (valid ? compute(targetMs!) : EMPTY));

  useEffect(() => {
    if (!valid) { setResult(EMPTY); return; }
    setResult(compute(targetMs!));
    const id = setInterval(() => setResult(compute(targetMs!)), 1000);
    return () => clearInterval(id);
  }, [targetMs]); // eslint-disable-line react-hooks/exhaustive-deps

  return result;
}

/**
 * Resolves the consultation start time from the various shapes the API returns.
 * Priority: scheduledDateTimeStart → availability.date + timeslots[0].startTime → date + startTime
 */
export function resolveStartTime(appointment: any): Date | null {
  if (!appointment) return null;

  if (appointment.scheduledDateTimeStart) {
    const d = new Date(appointment.scheduledDateTimeStart);
    if (!isNaN(d.getTime())) return d;
  }

  const date = appointment?.availability?.date || appointment?.date;
  const startTime = appointment?.timeslots?.[0]?.startTime;

  if (date && startTime) {
    // Full ISO-ish string
    if (/[T\-]/.test(String(startTime)) && String(startTime).length > 8) {
      const d = new Date(startTime);
      if (!isNaN(d.getTime())) return d;
    } else {
      // HH:mm or HH:mm:ss
      const parts = String(startTime).split(':').map(Number);
      const base = new Date(date);
      base.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);
      if (!isNaN(base.getTime())) return base;
    }
  }

  return null;
}

/** Formats seconds into MM:SS or HH:MM:SS */
export function formatSessionTime(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
