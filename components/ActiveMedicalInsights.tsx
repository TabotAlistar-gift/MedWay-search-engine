import React from 'react';
import { medicalInsightsData } from '@/lib/data';

export default function ActiveMedicalInsights() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 mt-8 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h3 className="text-lg font-bold text-slate-900">Active Medical Insights</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-200">
              <th className="px-6 py-3 text-sm font-bold text-slate-900">Condition</th>
              <th className="px-6 py-3 text-sm font-bold text-slate-900">Category</th>
              <th className="px-6 py-3 text-sm font-bold text-slate-900">Last Modified</th>
              <th className="px-6 py-3 text-sm font-bold text-slate-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {medicalInsightsData.map((insight) => (
              <tr key={insight.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">{insight.condition}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{insight.category}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{insight.lastModified}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="border border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5]/10 px-3 py-1 rounded text-xs font-semibold transition-colors">
                    [View]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
