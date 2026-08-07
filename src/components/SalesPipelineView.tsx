import React, { useState } from 'react';
import { 
  Plus, 
  DollarSign, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send,
  MoreVertical,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Deal, PipelineStage, Language } from '../types';
import { getTranslation, formatCurrency } from '../i18n/translations';

interface SalesPipelineViewProps {
  deals: Deal[];
  lang: Language;
  onUpdateDealStage: (dealId: string, newStage: PipelineStage) => void;
  onAddDeal: (deal: Deal) => void;
}

export const SalesPipelineView: React.FC<SalesPipelineViewProps> = ({
  deals,
  lang,
  onUpdateDealStage,
  onAddDeal
}) => {
  const isAr = lang === 'ar';

  const pipelineStages: { id: PipelineStage; labelKey: string }[] = [
    { id: 'lead', labelKey: 'stageLead' },
    { id: 'interested', labelKey: 'stageInterested' },
    { id: 'offer_sent', labelKey: 'stageOfferSent' },
    { id: 'negotiation', labelKey: 'stageNegotiation' },
    { id: 'reserved', labelKey: 'stageReserved' },
    { id: 'invoice', labelKey: 'stageInvoice' },
    { id: 'paid', labelKey: 'stagePaid' },
    { id: 'shipping', labelKey: 'stageShipping' },
    { id: 'delivered', labelKey: 'stageDelivered' },
    { id: 'closed', labelKey: 'stageClosed' }
  ];

  const getStageDeals = (stageId: PipelineStage) => {
    return deals.filter(d => d.stage === stageId);
  };

  const getStageTotal = (stageId: PipelineStage) => {
    return deals
      .filter(d => d.stage === stageId)
      .reduce((sum, d) => sum + d.amountMAD, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {getTranslation(lang, 'pipelineTitle')}
          </h2>
          <p className="text-xs text-slate-400">
            {isAr ? 'متابعة مسار مبيعات اللوحات من مرحلة الاهتمام الأولية إلى التسليم النهائي' : 'Suivi du pipeline de vente d’œuvres d’art du premier contact à la livraison'}
          </p>
        </div>

        <button
          onClick={() => {
            const newDeal: Deal = {
              id: `deal-${Date.now()}`,
              dealNumber: `DEAL-2024-${Math.floor(100 + Math.random() * 900)}`,
              customerId: 'cust-1',
              customerNameAr: 'مقتني جديد',
              customerNameFr: 'Nouveau Collectionneur',
              artworkId: 'artwk-1',
              artworkTitleAr: 'غروب في المدينة',
              artworkTitleFr: 'Coucher de Soleil',
              artworkImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
              stage: 'lead',
              amountMAD: 45000,
              probability: 50,
              notes: 'صفقة جديدة مضافة محلياً',
              createdAt: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString().split('T')[0]
            };
            onAddDeal(newDeal);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{getTranslation(lang, 'addDeal')}</span>
        </button>
      </div>

      {/* Horizontal Kanban Pipeline Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {pipelineStages.map((stage) => {
            const stageDeals = getStageDeals(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <div
                key={stage.id}
                className="w-72 bg-slate-100/80 dark:bg-slate-900/60 rounded-3xl p-4 border border-slate-200/60 dark:border-slate-800 flex flex-col max-h-[700px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                      {getTranslation(lang, stage.labelKey as any)}
                    </h3>
                  </div>
                  <span className="text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    {stageDeals.length}
                  </span>
                </div>

                {/* Column Total Amount Summary */}
                <div className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-white/60 dark:bg-slate-800/40 p-2 rounded-xl mb-3 text-center border border-slate-200/40 dark:border-slate-700/40">
                  {formatCurrency(stageTotal, lang)}
                </div>

                {/* Cards List */}
                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          {deal.dealNumber}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                          {deal.probability}%
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={deal.artworkImage}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {isAr ? deal.artworkTitleAr : deal.artworkTitleFr}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {isAr ? deal.customerNameAr : deal.customerNameFr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(deal.amountMAD, lang)}
                        </span>

                        {/* Move Stage Selector */}
                        <select
                          value={deal.stage}
                          onChange={(e) => onUpdateDealStage(deal.id, e.target.value as PipelineStage)}
                          className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1 outline-none border border-slate-200 dark:border-slate-700"
                        >
                          {pipelineStages.map((s) => (
                            <option key={s.id} value={s.id}>
                              {getTranslation(lang, s.labelKey as any)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      {isAr ? 'لا توجد صفقات' : 'Aucune offre'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
