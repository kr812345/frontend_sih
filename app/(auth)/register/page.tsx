"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Mail, Lock, Calendar, FileText, Building } from 'lucide-react';
import { registerAlumni } from '@/src/api/auth';

interface College {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    graduationYear: '',
    degreeUrl: '',
    collegeId: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [colleges, setColleges] = React.useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = React.useState(true);

  // Fetch colleges on mount
  React.useEffect(() => {
    const fetchColleges = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const url = `${apiUrl}/auth/colleges`;
        console.log('Fetching colleges from:', url);

        let response = await fetch(url);
        
        if (!response.ok) {
           console.error(`Fetch failed with status: ${response.status}`);
           // Fallback for localhost development if env var is messed up
           if (url.includes('api/v1/api/v1')) {
               const fixedUrl = 'http://localhost:5000/api/v1/auth/colleges';
               console.log('Retrying with fixed URL:', fixedUrl);
               response = await fetch(fixedUrl);
           }
        }

        const result = await response.json();
        console.log('College fetch result:', result);

        if (result.success && Array.isArray(result.data)) {
          // Filter out entries without names and remove duplicates
          const uniqueColleges = result.data
            .filter((c: College) => c.name && c.id)
            .reduce((acc: College[], curr: College) => {
              if (!acc.find(c => c.id === curr.id)) {
                acc.push(curr);
              }
              return acc;
            }, []);
          
          console.log('Parsed colleges:', uniqueColleges);
          setColleges(uniqueColleges);
        }
      } catch (err) {
        console.error('Failed to fetch colleges:', err);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const data = new FormData();
    data.append('degree', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/upload/degree`, {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, degreeUrl: result.data.url }));
      } else {
        setError(result.error || result.message || 'Upload failed');
      }
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      if (!formData.degreeUrl) {
        throw new Error('Please upload your degree certificate.');
      }
      if (!formData.collegeId) {
        throw new Error('Please provide a valid College ID.');
      }

      const response = await registerAlumni({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        graduationYear: Number(formData.graduationYear),
        degreeUrl: formData.degreeUrl,
        collegeId: formData.collegeId
      });

      // Store token and redirect
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      window.location.href = '/profile';
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-sans">
      {/* Background Split */}
      <div className="absolute inset-0 z-0 flex">
        <div className="w-1/2 h-full bg-white relative hidden md:block">
          <div className="absolute right-0 top-0 h-full w-24 bg-linear-to-l from-gray-100 to-transparent opacity-50"></div>
        </div>
        <div className="w-full md:w-1/2 h-full bg-[#020c25]"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[1000px] h-screen md:h-[650px] bg-white md:rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Column: Logo Area */}
        <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center relative p-8 order-1 md:order-0 border-b md:border-b-0 border-slate-100">
          <div className="grow flex items-center justify-center w-full">
            <Image 
              src="/sarthak.png" 
              alt="Sarthak Logo" 
              width={450}
              height={200}
              className="w-full max-w-[300px] md:max-w-[450px] object-contain mb-8"
              priority
            />
          </div>
          
          <div className="absolute bottom-4 md:bottom-8 text-[#0f172a] font-bold text-[11px] tracking-wide">
            Sarthak © 2025 | Built at SIH | De-bugs_
          </div>
        </div>

        {/* Right Column: Form Area */}
        <div className="w-full md:w-1/2 bg-[#f6f9fc] p-8 md:p-10 flex flex-col justify-center text-[#1e293b] order-0 md:order-1 overflow-y-auto">
          <div className="w-full max-w-[380px] mx-auto">
            {/* Headers */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#051025] mb-1">
                Join Sarthak !
              </h2>
              <p className="text-sm text-slate-500">
                Connect with your legacy. Build your future.
              </p>
            </div>

            {/* Form */}
            <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
              
              {error && <div className="col-span-2 text-red-500 text-sm text-center bg-red-50 p-2 rounded-md border border-red-100">{error}</div>}

              {/* Name (Half Width) */}
              <div className="col-span-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-400 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#001245] focus:ring-1 focus:ring-[#001245] transition-all"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Username (Half Width) */}
              <div className="col-span-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-400 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#001245] focus:ring-1 focus:ring-[#001245] transition-all"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email (Full Width) */}
              <div className="col-span-2 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-400 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#001245] focus:ring-1 focus:ring-[#001245] transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password (Half Width) */}
              <div className="col-span-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-400 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#001245] focus:ring-1 focus:ring-[#001245] transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password (Half Width) */}
              <div className="col-span-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Pass"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-400 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#001245] focus:ring-1 focus:ring-[#001245] transition-all"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Graduation Year (Half Width) */}
              <div className="col-span-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="number"
                  name="graduationYear"
                  min="1950"
                  max="2030"
                  placeholder="Grad. Year"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-slate-400 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#001245] focus:ring-1 focus:ring-[#001245] transition-all"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* College (Half Width) */}
              <div className="col-span-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Building size={16} />
                </div>
                <select
                  name="collegeId"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-400 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-[#001245] focus:ring-1 focus:ring-[#001245] transition-all appearance-none cursor-pointer"
                  value={formData.collegeId}
                  onChange={handleChange}
                  required
                  disabled={loadingColleges}
                >
                  <option value="" disabled>
                    {loadingColleges ? 'Loading...' : 'Select College'}
                  </option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Degree Upload (Full Width) */}
              <div className="col-span-2 mt-1">
                <label className={`flex flex-col items-center justify-center w-full h-20 px-4 bg-white border-2 border-dashed rounded-xl cursor-pointer transition-all group ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-[#001245] hover:bg-slate-50'} ${formData.degreeUrl ? 'border-green-500 bg-green-50' : 'border-slate-300'}`}>
                  <div className="flex items-center gap-3 text-slate-500 group-hover:text-[#001245] transition-colors">
                    <FileText size={24} strokeWidth={1.5} className={formData.degreeUrl ? 'text-green-600' : ''} />
                    <span className="text-sm font-medium">
                      {uploading ? 'Uploading...' : formData.degreeUrl ? 'Certificate Uploaded ✓' : 'Upload Degree Certificate'}
                    </span>
                  </div>
                  {!formData.degreeUrl && !uploading && <span className="text-[10px] text-slate-400 mt-1">Supports PDF, JPG, PNG</span>}
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                </label>
              </div>

              {/* Sign Up Button */}
              <div className="col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="block w-40 mx-auto bg-[#051025] text-white font-bold py-2.5 rounded-full hover:bg-[#061637] transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>
            </form>

            {/* Bottom Link */}
            <p className="text-center text-xs text-slate-600 mt-6">
              Already have an account? <Link href="/login" className="font-bold text-[#051025] hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
