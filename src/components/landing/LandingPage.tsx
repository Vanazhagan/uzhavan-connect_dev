import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Wrench,
  Users,
  Truck,
  CreditCard,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ASSET_IMAGES } from '../../assets/images';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenLogin }) => {
  const { t, language } = useApp();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-950 text-white shadow-md">
        {/* Background Image with Scrim */}
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${ASSET_IMAGES.heroTamilFarms})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-xs font-semibold text-emerald-200">
            <span>{language === 'ta' ? 'தமிழ்நாடு வேளாண்மை சூழல்' : 'Tamil Nadu Agricultural Ecosystem'}</span>
            <span>·</span>
            <span>0% Farmer Commission</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t.appName}
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-amber-200/95 max-w-2xl mx-auto">
            {t.tagline}
          </p>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            A farmer-first digital platform connecting Tamil Nadu growers directly with wholesale buyers, local worker teams, agricultural machinery rental, certified input stores, and rural logistics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              {t.login} / Register
            </button>
          </div>
        </div>
      </section>

      {/* Visual Farmer Journey (Strictly No Fake Stats) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">
            {language === 'ta' ? 'முழுமையான விவசாயி பயணம்' : 'The Connected Farming Journey'}
          </h2>
          <p className="text-xs text-slate-600">
            Supporting you step-by-step from weather planning to final settlement
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '01', title: t.journey.stepPlan, desc: 'Weather & Yield Goals', icon: Calendar },
            { step: '02', title: t.journey.stepPrepare, desc: 'Tractors & Tillers', icon: Wrench },
            { step: '03', title: t.journey.stepHarvest, desc: 'Worker Teams Booking', icon: Users },
            { step: '04', title: t.journey.stepSell, desc: 'Crop Lots & Live Progress', icon: Layers },
            { step: '05', title: t.journey.stepDeliver, desc: 'Status-Based Transit', icon: Truck },
            { step: '06', title: t.journey.stepPayment, desc: 'Direct UPI & Bank Settled', icon: CreditCard },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-xs flex flex-col justify-between min-h-[130px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800">{item.step}</span>
                  <Icon className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            0%
          </div>
          <h3 className="text-base font-bold text-slate-900">
            100% Free For Farmers
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zero commission on crop sales and zero fee on agricultural inputs. Farmers keep 100% of their negotiated produce value.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            ⭐
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Profile Trust Rings
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every member earns their visual Trust Ring through verifiable on-ground fulfillment, prompt direct settlement, and zero cancellation records. Rings cannot be purchased.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            📉
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Live Crop Sale Progress
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Partial selling made effortless. Contract portions of your harvest across multiple buyers (e.g. 800 KG, 700 KG, 500 KG) until 100% SOLD OUT.
          </p>
        </div>
      </section>
    </div>
  );
};
