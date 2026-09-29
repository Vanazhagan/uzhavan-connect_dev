import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Package,
  Info,
  Phone,
  Truck,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { AgriProduct, AgriStore } from '../../types';

export const AgriInputMarketplace: React.FC = () => {
  const { t, language, agriStores, agriProducts, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProductForModal, setSelectedProductForModal] = useState<AgriProduct | null>(null);
  const [selectedStoreForModal, setSelectedStoreForModal] = useState<AgriStore | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = [
    'All',
    'Seeds',
    'Fertilizers / Nutrients',
    'Crop Protection Products',
    'Basic Agricultural Supplies',
  ];

  const filteredProducts = agriProducts.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    return true;
  });

  const handleOrderInput = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedProductForModal(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.agriInputs.title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {t.agriInputs.zeroFeeNotice}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.agriInputs.subtitle}
          </p>
        </div>

        {/* Highlight 0% Platform Fee Rule */}
        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
          <span className="font-bold">Farmer Support Guarantee: </span>
          <span>Platform Fee = ₹0 for all input purchases. 100% direct value to agro shops.</span>
        </div>
      </div>

      {/* Verified Stores Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {t.agriInputs.stores}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agriStores.map(store => (
            <div
              key={store.id}
              className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <TrustRingAvatar
                      user={{ name: store.storeName }}
                      trust={store.trust}
                      size="lg"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{store.storeName}</h4>
                      <p className="text-xs text-slate-500 font-medium">Owner: {store.ownerName}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{store.village}, {store.district}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {store.trust.title}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                  {store.categories.map((c, i) => (
                    <span key={i} className="bg-slate-100 px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                  {store.pickupAvailable && (
                    <span className="flex items-center gap-1 text-emerald-800 font-medium">
                      <Store className="w-3.5 h-3.5" /> Farm Pickup Ready
                    </span>
                  )}
                  {store.deliveryAvailable && (
                    <span className="flex items-center gap-1 text-emerald-800 font-medium">
                      <Truck className="w-3.5 h-3.5" /> Village Delivery
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-semibold">{store.mobile}</span>
                </div>

                <button
                  onClick={() => setSelectedStoreForModal(store)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Store Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certified Products Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {t.agriInputs.products}
          </h3>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                      ₹{product.price} <span className="text-[10px] text-slate-500 font-normal">/ {product.unit}</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-emerald-900/90 text-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      {product.category}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {language === 'ta' ? product.nameTa : product.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">Seller: {product.storeName}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Safety & Pack Spec Note */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      {t.agriInputs.manufacturerSpec}:
                    </span>
                    <span className="leading-snug">{product.manufacturerInfo}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedProductForModal(product)}
                    className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Inquire / Request at Store</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Inquiry Modal */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Store Inquiry: {selectedProductForModal.name}
                </h3>
                <span className="text-xs text-slate-500">{selectedProductForModal.storeName}</span>
              </div>
              <button
                onClick={() => setSelectedProductForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOrderInput} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-emerald-950">
                <div>
                  <span className="font-bold text-sm block">₹{selectedProductForModal.price}</span>
                  <span className="text-[11px] text-emerald-800">Unit: {selectedProductForModal.unit}</span>
                </div>
                <div className="text-right text-[11px] text-emerald-800">
                  <span>Platform Fee = ₹0</span>
                  <span className="block font-semibold">100% Free For Farmers</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Required Quantity / Bags
                </label>
                <input
                  type="number"
                  min={1}
                  defaultValue={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Fulfillment Mode
                </label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800">
                  <option>Self Farm Pickup from Agro Store</option>
                  <option>Door Delivery to Farm Gate</option>
                </select>
              </div>

              {orderSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl font-semibold text-center">
                  Inquiry sent directly to {selectedProductForModal.storeName}!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProductForModal(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Send Request to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Store Profile Details Modal */}
      {selectedStoreForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {selectedStoreForModal.storeName}
              </h3>
              <button
                onClick={() => setSelectedStoreForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-slate-700">
              <p><strong>Owner:</strong> {selectedStoreForModal.ownerName}</p>
              <p><strong>Address:</strong> {selectedStoreForModal.address}</p>
              <p><strong>Phone:</strong> {selectedStoreForModal.mobile}</p>
              <p><strong>Available Inventory:</strong> {selectedStoreForModal.categories.join(', ')}</p>
              <p className="text-emerald-800 font-medium">✓ Certified agricultural retail outlet registered under Uzhavan Connect.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStoreForModal(null)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
