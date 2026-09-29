import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { Order, PaymentRecord } from '../../types';

export const OrdersAndSettlementView: React.FC = () => {
  const {
    t,
    orders,
    currentRole,
    recordBuyerPayment,
    confirmFarmerPaymentReceipt,
    raisePaymentDispute,
    digitalTransactionRecord,
    setDigitalTransactionRecord,
  } = useApp();

  // Role checks
  const isBuyer = currentRole === 'buyer';
  const isFarmer = currentRole === 'farmer';

  // Buyer Payment Modal State
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer' | 'Cash'>('UPI');
  const [refId, setRefId] = useState('');
  const [paymentProof, setPaymentProof] = useState('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(false);

  // Dispute Modal State for specific unconfirmed payment
  const [activeDisputeItem, setActiveDisputeItem] = useState<{
    order: Order;
    payment: PaymentRecord;
  } | null>(null);
  const [disputeReason, setDisputeReason] = useState('Amount not reflected in bank account yet');

  const filteredOrders = orders; // show orders for test convenience

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentOrder) return;

    recordBuyerPayment(
      activePaymentOrder.id,
      paymentAmount,
      paymentMethod,
      refId,
      paymentProof
    );
    setPaymentSuccessMsg(true);
    setTimeout(() => {
      setPaymentSuccessMsg(false);
      setActivePaymentOrder(null);
    }, 1200);
  };

  const handleRaiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDisputeItem) return;
    raisePaymentDispute(
      activeDisputeItem.order.id,
      disputeReason,
      activeDisputeItem.payment.id
    );
    setActiveDisputeItem(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.settlement.title}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.settlement.subtitle}
          </p>
        </div>

        {/* Zero Lock Guarantee */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Zero Custody Guarantee:</strong> Platform does NOT hold farmer funds. Direct buyer-to-farmer settlement via UPI, NEFT, or Cash.
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map(order => {
          // Calculate settlement using ONLY farmer-confirmed payments
          const confirmedPayments = order.payments.filter(
            p => p.status === 'CONFIRMED_BY_FARMER' || (!p.status && order.settlementStatus === 'settlement_completed')
          );
          const confirmedPaid = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
          const remainingBalance = Math.max(0, order.cropValue - confirmedPaid);
          const percentPaid = Math.min(100, Math.round((confirmedPaid / order.cropValue) * 100));
          const isSettled = order.settlementStatus === 'settlement_completed' && confirmedPaid >= order.cropValue;

          // Pending recorded payments awaiting farmer confirmation
          const pendingPayments = order.payments.filter(
            p => p.status === 'RECORDED' || (!p.status && order.settlementStatus !== 'settlement_completed')
          );
          const pendingRecordedAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
          const unrecordedBalance = Math.max(0, remainingBalance - pendingRecordedAmount);

          // Dynamic coconut units: "500 Coconuts @ ₹30/Coconut"
          const isCoconut = order.cropName.toLowerCase().includes('coconut') || order.unit === 'Coconuts';
          const lotQuantityStr = isCoconut
            ? `${order.quantityKg.toLocaleString('en-IN')} Coconuts`
            : `${order.quantityKg.toLocaleString('en-IN')} ${order.unit || 'KG'} ${order.cropName}`;
          const priceUnitStr = isCoconut ? 'Coconut' : (order.unit || 'KG');

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 space-y-5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-slate-900">
                      Order #{order.id.toUpperCase()}
                    </span>

                    {/* Status Badge */}
                    {isSettled ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        SETTLEMENT COMPLETED
                      </span>
                    ) : order.settlementStatus === 'disputed' ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-700" />
                        DISPUTED
                      </span>
                    ) : pendingPayments.length > 0 ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        Awaiting Farmer Confirmation
                      </span>
                    ) : confirmedPaid > 0 ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-blue-100 text-blue-900 border border-blue-300">
                        Partial Payment ({percentPaid}%)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                        Unpaid
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    Created: {order.createdAt} · {order.pickupTerms}
                  </span>
                </div>

                {/* Crop & Buyer Payable Figures */}
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">{t.settlement.cropValue}</span>
                  <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                    ₹{order.cropValue.toLocaleString('en-IN')}
                  </span>
                  <div className="text-[11px] text-emerald-800">
                    <span>Buyer Fee (2%): ₹{order.buyerPlatformFee}</span>
                    <span className="ml-2 font-bold">Farmer Deduction: ₹0</span>
                  </div>
                </div>
              </div>

              {/* Farmer and Buyer Profile Row with Trust Rings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <TrustRingAvatar user={{ name: order.farmerName }} trust={order.farmerTrust} size="md" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Farmer / Seller</span>
                    <h4 className="text-xs font-bold text-slate-900">{order.farmerName}</h4>
                    <span className="text-[11px] text-emerald-800 font-medium">{order.farmerTrust.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TrustRingAvatar user={{ name: order.buyerName }} trust={order.buyerTrust} size="md" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Buyer / Purchaser</span>
                    <h4 className="text-xs font-bold text-slate-900">{order.buyerName}</h4>
                    <span className="text-[11px] text-emerald-800 font-medium">{order.buyerTrust.title}</span>
                  </div>
                </div>
              </div>

              {/* Produce Specifications with Dynamic Coconut Units */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-950 font-medium">
                <span>
                  Contracted Lot: <strong>{lotQuantityStr}</strong> @ ₹{order.pricePerKg}/{priceUnitStr}
                </span>
                <span>
                  Order Status: <strong className="capitalize">{order.orderStatus.replace('_', ' ')}</strong>
                </span>
              </div>

              {/* Partial Payment Progress Bar (Calculated using ONLY farmer-confirmed payments) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Settlement Progress (Confirmed by Farmer)</span>
                  <span className="text-slate-900 tabular-nums">
                    ₹{confirmedPaid.toLocaleString('en-IN')} of ₹{order.cropValue.toLocaleString('en-IN')}{' '}
                    <span className="text-slate-500">({percentPaid}%)</span>
                    {isSettled ? (
                      <span className="ml-2 text-emerald-700 font-bold">✓ SETTLEMENT COMPLETED</span>
                    ) : (
                      <span className="ml-2 text-amber-700 font-medium">· NOT settled</span>
                    )}
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isSettled ? 'bg-emerald-600' : 'bg-gradient-to-r from-emerald-700 to-amber-500'
                    }`}
                    style={{ width: `${percentPaid}%` }}
                  />
                </div>

                <div className="flex flex-wrap justify-between text-[11px] text-slate-500 gap-1">
                  <span>
                    Confirmed by Farmer: <strong className="text-emerald-900 font-bold">₹{confirmedPaid.toLocaleString('en-IN')}</strong>
                  </span>
                  {pendingRecordedAmount > 0 && (
                    <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ₹{pendingRecordedAmount.toLocaleString('en-IN')} recorded (Awaiting Farmer Confirmation)
                    </span>
                  )}
                  <span>
                    Balance Remaining: <strong className="text-slate-900 font-bold">₹{remainingBalance.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>

              {/* Recorded Direct Payments History */}
              {order.payments.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Direct Payments History ({order.payments.length})
                  </span>
                  <div className="space-y-2">
                    {order.payments.map(p => {
                      const pStatus = p.status || (order.settlementStatus === 'settlement_completed' ? 'CONFIRMED_BY_FARMER' : 'RECORDED');
                      const isPaymentConfirmed = pStatus === 'CONFIRMED_BY_FARMER';
                      const isPaymentDisputed = pStatus === 'DISPUTED';
                      const isPaymentUnconfirmed = pStatus === 'RECORDED';

                      return (
                        <div
                          key={p.id}
                          className={`p-3.5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                            isPaymentConfirmed
                              ? 'bg-emerald-50/70 border-emerald-200'
                              : isPaymentDisputed
                              ? 'bg-rose-50 border-rose-200'
                              : 'bg-amber-50/80 border-amber-200'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-sm">
                                ₹{p.amount.toLocaleString('en-IN')}
                              </span>
                              <span className="px-2 py-0.5 rounded-lg bg-white/90 border border-slate-200 text-[11px] font-semibold text-slate-700">
                                {p.method}
                              </span>
                              {p.referenceId && (
                                <span className="text-slate-500 font-mono text-[11px] bg-white/60 px-1.5 py-0.5 rounded border border-slate-200">
                                  Ref: {p.referenceId}
                                </span>
                              )}

                              {/* Status Badges */}
                              {isPaymentConfirmed && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  CONFIRMED_BY_FARMER
                                </span>
                              )}
                              {isPaymentUnconfirmed && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200/90 border border-amber-300 px-2 py-0.5 rounded-full">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  RECORDED · Awaiting Farmer Confirmation
                                </span>
                              )}
                              {isPaymentDisputed && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                                  <AlertCircle className="w-3 h-3 text-rose-700" />
                                  DISPUTED
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                              <span>Logged: {p.timestamp}</span>
                              {(p.proofUrl || p.proof) && (
                                <span className="text-emerald-800 font-medium bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                                  Proof / Note: {p.proofUrl || p.proof}
                                </span>
                              )}
                              {p.notes && <span className="italic text-slate-600">&ldquo;{p.notes}&rdquo;</span>}
                            </div>
                          </div>

                          {/* FARMER ACTION BUTTONS: For each unconfirmed payment */}
                          {isFarmer && isPaymentUnconfirmed && (
                            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                              <button
                                type="button"
                                onClick={() => confirmFarmerPaymentReceipt(order.id, p.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                                <span>Confirm ₹{p.amount.toLocaleString('en-IN')} Received</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDisputeItem({ order, payment: p });
                                  setDisputeReason(`Amount ₹${p.amount.toLocaleString('en-IN')} via ${p.method} (Ref: ${p.referenceId || 'N/A'}) not reflected in bank account.`);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-100/60 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Raise Payment Issue</span>
                              </button>
                            </div>
                          )}

                          {/* BUYER VIEW for unconfirmed payment: Waiting state indicator */}
                          {isBuyer && isPaymentUnconfirmed && (
                            <span className="text-xs text-amber-800 font-medium italic shrink-0">
                              Awaiting Farmer Confirmation
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Settlement Actions Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Digital Transaction Record Button: ONLY after 100% confirmed by farmer */}
                  {isSettled ? (
                    <button
                      onClick={() =>
                        setDigitalTransactionRecord({
                          transactionId: `TXN-${order.id.slice(-6)}`,
                          orderId: order.id,
                          farmerName: order.farmerName,
                          buyerName: order.buyerName,
                          cropName: order.cropName,
                          quantityKg: order.quantityKg,
                          pricePerKg: order.pricePerKg,
                          unit: order.unit,
                          totalCropValue: order.cropValue,
                          payments: order.payments,
                          settlementDate: new Date().toISOString().split('T')[0],
                          deliveryStatus: 'Produce Received & Verified',
                          isSettled: true,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span>{t.settlement.viewTransactionRecord}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      Settlement Progress: <strong>{percentPaid}%</strong> confirmed ({remainingBalance === 0 ? 'Full' : `₹${remainingBalance.toLocaleString('en-IN')} remaining`})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* BUYER ACTION: ONLY Buyer can see "Record Direct Payment" */}
                  {isBuyer && !isSettled && (
                    <>
                      {unrecordedBalance > 0 ? (
                        <button
                          onClick={() => {
                            setActivePaymentOrder(order);
                            setPaymentAmount(unrecordedBalance);
                            setPaymentProof('');
                            setRefId(`UPI/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/${Math.floor(100000 + Math.random() * 900000)}`);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          <span>Record Direct Payment</span>
                        </button>
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Full Balance Recorded · Awaiting Farmer Confirmation</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* FARMER UI: "Record Direct Payment (Buyer)" is COMPLETELY REMOVED */}
                  {isFarmer && !isSettled && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      {pendingPayments.length > 0 ? (
                        <span className="text-amber-800 font-medium bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                          {pendingPayments.length} payment(s) awaiting your confirmation above
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">
                          Awaiting buyer direct payment recording
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Payment Modal (BUYER ONLY) */}
      {activePaymentOrder && isBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Record Direct Payment</span>
              </h3>
              <button
                onClick={() => setActivePaymentOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Order:</span>
                  <span className="text-slate-900">#{activePaymentOrder.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Farmer / Recipient:</span>
                  <span className="text-slate-900 font-medium">{activePaymentOrder.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Order Balance:</span>
                  <span className="text-emerald-900 font-bold">
                    ₹{activePaymentOrder.remainingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Amount to Pay (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  max={activePaymentOrder.remainingBalance}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-sm"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  You can make partial payments. Total order value: ₹{activePaymentOrder.cropValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                >
                  <option value="UPI">Direct UPI (PhonePe / GPay / BHIM / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (IMPS / NEFT / RTGS)</option>
                  <option value="Cash">Direct Cash at Farm Gate</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Transaction / Reference ID
                </label>
                <input
                  type="text"
                  value={refId}
                  onChange={e => setRefId(e.target.value)}
                  placeholder="e.g. UPI/20260927/894211 or UTR number"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Optional Payment Proof / Receipt Note
                </label>
                <input
                  type="text"
                  value={paymentProof}
                  onChange={e => setPaymentProof(e.target.value)}
                  placeholder="e.g. Bank SMS reference / Receipt link / Mandi cash voucher"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <strong>Flow Notice:</strong>
                <p>
                  Payment will be recorded with status <strong>RECORDED</strong> and set to &ldquo;Awaiting Farmer Confirmation&rdquo;.
                  Settlement updates ONLY after the farmer confirms receipt in their account.
                </p>
              </div>

              {paymentSuccessMsg && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl font-semibold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Payment recorded! Awaiting farmer confirmation.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActivePaymentOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Record Direct Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raise Dispute Modal for Specific Payment */}
      {activeDisputeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700" />
                <span>Raise Payment Issue</span>
              </h3>
              <button
                onClick={() => setActiveDisputeItem(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRaiseDispute} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                <div>Order: <strong>#{activeDisputeItem.order.id.toUpperCase()}</strong></div>
                <div>
                  Disputed Payment: <strong>₹{activeDisputeItem.payment.amount.toLocaleString('en-IN')}</strong> ({activeDisputeItem.payment.method})
                </div>
                {activeDisputeItem.payment.referenceId && (
                  <div>Reference: <code>{activeDisputeItem.payment.referenceId}</code></div>
                )}
              </div>

              <p className="text-slate-600">
                If this recorded payment has not arrived in your bank account or cash was not received, describe the issue. Our admin console will review UTR reference details.
              </p>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Reason for Non-Receipt
                </label>
                <textarea
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveDisputeItem(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Submit Issue to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Transaction Record (Invoice Modal) - Only accessible when 100% confirmed by farmer */}
      {digitalTransactionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-amber-900/10 p-6 sm:p-8 space-y-5 text-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-200 font-bold flex items-center justify-center">
                  உ
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.settlement.digitalRecordTitle}</h3>
                  <span className="text-[11px] text-slate-500 font-medium">Record ID: {digitalTransactionRecord.transactionId}</span>
                </div>
              </div>
              <button
                onClick={() => setDigitalTransactionRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Status Stamp */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                ✓ 100% DIRECT SETTLEMENT CONFIRMED BY FARMER
              </span>
              <span className="text-[11px] text-emerald-700">
                Settled on {digitalTransactionRecord.settlementDate} · Direct Farmer Confirmation
              </span>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Farmer</span>
                <span className="font-bold text-slate-900">{digitalTransactionRecord.farmerName}</span>
                <span className="text-[11px] text-emerald-800 block mt-0.5">Direct Recipient</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Buyer</span>
                <span className="font-bold text-slate-900">{digitalTransactionRecord.buyerName}</span>
                <span className="text-[11px] text-purple-800 block mt-0.5">Purchaser</span>
              </div>
            </div>

            {/* Produce Breakdown with Dynamic Coconut Unit */}
            {(() => {
              const isCoconutDoc = digitalTransactionRecord.cropName.toLowerCase().includes('coconut') || digitalTransactionRecord.unit === 'Coconuts';
              const docQtyStr = isCoconutDoc
                ? `${digitalTransactionRecord.quantityKg.toLocaleString('en-IN')} Coconuts`
                : `${digitalTransactionRecord.quantityKg.toLocaleString('en-IN')} ${digitalTransactionRecord.unit || 'KG'}`;
              const docUnitRateStr = isCoconutDoc ? 'Coconut' : (digitalTransactionRecord.unit || 'KG');

              return (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span>Crop:</span>
                    <span className="font-bold">{digitalTransactionRecord.cropName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contracted Quantity:</span>
                    <span className="font-bold">{docQtyStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price / {docUnitRateStr}:</span>
                    <span className="font-bold">₹{digitalTransactionRecord.pricePerKg}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-sm">
                    <span>Total Settled Value:</span>
                    <span className="text-emerald-900">₹{digitalTransactionRecord.totalCropValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })()}

            {/* Payment Audit Breakdown */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Farmer Confirmed Payments ({digitalTransactionRecord.payments.length})
              </span>
              {digitalTransactionRecord.payments.map((p, idx) => (
                <div key={p.id || idx} className="flex justify-between text-[11px] border-b border-slate-100 pb-1">
                  <span>
                    ₹{p.amount.toLocaleString('en-IN')} via {p.method}
                    {p.referenceId ? ` (${p.referenceId})` : ''}
                  </span>
                  <span className="text-emerald-800 font-bold">✓ CONFIRMED</span>
                </div>
              ))}
            </div>

            {/* Platform zero-deduction certification */}
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
              Certified that no platform deduction or commission was made against the farmer&apos;s agreed produce value (0% farmer fee). Buyer platform fee of 2% was handled separately.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDigitalTransactionRecord(null)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
