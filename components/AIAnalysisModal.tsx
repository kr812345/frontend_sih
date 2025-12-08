import React from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { Modal, LoadingSpinner, Button } from '@/components/ui';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  analysis: string | null;
  title?: string;
}

export default function AIAnalysisModal({ 
  isOpen, 
  onClose, 
  loading, 
  analysis, 
  title = "AI Analysis" 
}: AIAnalysisModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#001145] to-[#1a237e] rounded-xl shadow-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#001145]">{title}</h3>
            <p className="text-sm text-gray-500">Powered by Gemini AI</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 min-h-[200px] flex items-center justify-center relative overflow-hidden">
           {/* Decorative background elements */ }
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#001145] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-20"></div>

          {loading ? (
             <div className="text-center relative z-10">
                <LoadingSpinner />
                <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">Analyzing data...</p>
             </div>
          ) : analysis ? (
            <div className="relative z-10 w-full">
               <div className="prose prose-sm max-w-none text-[#4a5f7c]">
                  {analysis.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                  ))}
               </div>
            </div>
          ) : (
            <div className="text-center relative z-10 px-4">
               <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
               <p className="text-gray-500">No analysis available. Please try again.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="secondary" className="min-w-[100px]">
             Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
