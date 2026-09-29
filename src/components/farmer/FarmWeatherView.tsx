import React, { useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FarmWeatherView: React.FC = () => {
  const { t, language, weatherForecast, currentUser, setActiveTab } = useApp();
  const [selectedDay, setSelectedDay] = useState(0);

  const activeDay = weatherForecast[selectedDay] || weatherForecast[0];

  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case 'Rain Expected':
      case 'Heavy Showers':
        return <CloudRain className="w-10 h-10 text-blue-500" />;
      case 'Sunny':
        return <Sun className="w-10 h-10 text-amber-500" />;
      default:
        return <CloudSun className="w-10 h-10 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Mandatory Prototype/Demo Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.weather.title}
            </h2>
            {/* MANDATORY EXPLICIT LABEL */}
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {t.weather.demoLabel}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {currentUser.taluk || 'Pollachi'}, {currentUser.district || 'Coimbatore'}, Tamil Nadu
            </span>
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2 max-w-md">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Ground Notice:</strong> {t.weather.demoNotice}
          </span>
        </div>
      </div>

      {/* Main Focus Weather Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-emerald-200">
              <span>{activeDay.dayName}</span>
              <span>·</span>
              <span>{activeDay.date}</span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums">
                {activeDay.tempCelsius}°C
              </span>
              <div className="text-sm text-emerald-200">
                <span className="font-semibold block text-base text-white">
                  {language === 'ta' ? activeDay.conditionTa : activeDay.condition}
                </span>
                <span>
                  High: {activeDay.tempHigh}°C · Low: {activeDay.tempLow}°C
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-lg pt-1">
              {language === 'ta' ? activeDay.advisoryTa : activeDay.advisory}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 min-w-[140px]">
            {getWeatherIcon(activeDay.condition)}
            <span className="text-xs font-semibold text-amber-200 mt-2">
              {activeDay.condition}
            </span>
          </div>
        </div>

        {/* 3 Key Weather Sensors */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-3">
          <div className="p-3 bg-white/10 rounded-2xl text-center">
            <Droplets className="w-5 h-5 text-blue-300 mx-auto mb-1" />
            <span className="text-[11px] text-emerald-200 block">{t.weather.rainChance}</span>
            <span className="text-base sm:text-lg font-bold tabular-nums">
              {activeDay.rainChancePercent}%
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl text-center">
            <Droplets className="w-5 h-5 text-teal-300 mx-auto mb-1" />
            <span className="text-[11px] text-emerald-200 block">{t.weather.humidity}</span>
            <span className="text-base sm:text-lg font-bold tabular-nums">
              {activeDay.humidityPercent}%
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl text-center">
            <Wind className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <span className="text-[11px] text-emerald-200 block">{t.weather.wind}</span>
            <span className="text-base sm:text-lg font-bold tabular-nums">
              {activeDay.windSpeedKmh} km/h
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Horizontal Scroller */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          {t.weather.forecast7Days}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {weatherForecast.map((day, idx) => {
            const isSelected = idx === selectedDay;
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(idx)}
                className={`p-3 rounded-2xl text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600/30'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-2xs'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{day.dayName.split(' ')[0]}</div>
                <div className="my-2 flex justify-center">{getWeatherIcon(day.condition)}</div>
                <div className="text-sm font-bold tabular-nums">{day.tempCelsius}°C</div>
                <div
                  className={`text-[10px] mt-1 font-medium ${
                    day.hasAlert
                      ? isSelected
                        ? 'text-amber-300 font-bold'
                        : 'text-amber-700 font-bold'
                      : isSelected
                      ? 'text-emerald-200'
                      : 'text-slate-500'
                  }`}
                >
                  Rain: {day.rainChancePercent}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weather + Farm Calendar Integration Module */}
      <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <h4 className="text-sm font-bold">{t.weather.weatherAlert}</h4>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          {t.weather.alertWarning}
        </p>
        <div className="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-800">
            <strong>Scheduled on Harvest Day (Oct 5):</strong> 2,000 Coconuts Harvest + Tractor Tillage Booking.
            <div className="text-[11px] text-slate-500 mt-0.5">
              Uzhavan Rule: Weather alerts INFORM the farmer. Never automatically cancels or reschedules without farmer decision.
            </div>
          </div>
          <button
            onClick={() => setActiveTab('calendar')}
            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer"
          >
            Review Farm Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
