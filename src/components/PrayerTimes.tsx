import React from 'react';
import { Clock } from 'lucide-react';
import type { PrayerTime } from '../types';

interface PrayerTimesProps {
  times: PrayerTime[];
}

export function PrayerTimes({ times }: PrayerTimesProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <Clock className="w-5 h-5 text-emerald-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Prayer Times</h2>
      </div>
      <div className="space-y-2">
        {times.map((prayer) => (
          <div key={prayer.name} className="flex justify-between items-center">
            <span className="text-gray-600">{prayer.name}</span>
            <span className="text-gray-800 font-medium">{prayer.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}