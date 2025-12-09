import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Upload, FileText, X } from 'lucide-react';
import { uploadFile } from '@/src/api/upload';
import toast from 'react-hot-toast';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  user: {
    name: string;
    email: string;
  } | null;
  onSubmit: (data: { resumeUrl: string; coverLetter: string }) => Promise<void>;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  jobTitle,
  user,
  onSubmit,
}: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Resume
      setIsUploading(true);
      const uploadResp = await uploadFile(resumeFile, 'document');
      setIsUploading(false);

      if (!uploadResp || !uploadResp.url) {
        throw new Error('Failed to upload resume');
      }

      // 2. Submit Application
      await onSubmit({
        resumeUrl: uploadResp.url,
        coverLetter,
      });

      // Reset and close
      setCoverLetter('');
      setResumeFile(null);
      onClose();
    } catch (error) {
      console.error('Application error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${jobTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Applying as</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#001145] text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-bold text-[#001145]">{user?.name || 'Guest'}</p>
              <p className="text-sm text-gray-500">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#001145] mb-2">
            Resume / CV <span className="text-red-500">*</span>
          </label>
          
          {!resumeFile ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
               <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#001145]">Click to upload resume</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          ) : (
             <div className="flex items-center justify-between p-4 bg-[#e4f0ff] rounded-xl border border-[#001145]/10">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#001145]" size={24} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#001145] truncate max-w-[200px]">{resumeFile.name}</p>
                    <p className="text-xs text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="p-1 hover:bg-white rounded-full text-gray-500 transition-colors"
                >
                  <X size={18} />
                </button>
             </div>
          )}
        </div>

        <Textarea
          label="aadCover Letter (Optional)"
          placeholder="Tell us why you're a great fit for this role..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={5}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isSubmitting || isUploading}
            disabled={!resumeFile}
          >
            {isUploading ? 'Uploading...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
