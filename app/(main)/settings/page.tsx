"use client";

import React, { useState } from 'react';
import { Shield, Bell, Eye, Lock, Mail, Phone, Linkedin, Users, Globe, Save, Check, AlertCircle, Smartphone, MessageSquare, Briefcase, Calendar, Heart } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'notifications'>('privacy');
  const [saved, setSaved] = useState(false);
  
  // Privacy settings state
  const [profileVisibility, setProfileVisibility] = useState('all');
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showLinkedin, setShowLinkedin] = useState(true);
  const [contactPermission, setContactPermission] = useState('connections');
  const [searchable, setSearchable] = useState(true);
  const [shareData, setShareData] = useState(false);
  
  // Notification settings state
  const [emailNotifs, setEmailNotifs] = useState({
    jobs: true,
    events: true,
    connections: true,
    messages: true,
    campaigns: false,
    newsletter: true,
  });
  const [pushNotifs, setPushNotifs] = useState({
    jobs: true,
    events: true,
    connections: true,
    messages: true,
    campaigns: false,
  });
  const [notifFrequency, setNotifFrequency] = useState('daily');
  const [batchNews, setBatchNews] = useState(true);
  const [departmentUpdates, setDepartmentUpdates] = useState(['cs', 'placement']);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-[#001145]' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Settings</h1>
          <p className="text-gray-500">Manage your privacy and notification preferences</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
            <Check size={18} /> Settings saved successfully!
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'privacy'
              ? 'bg-[#001145] text-white shadow-md'
              : 'text-gray-600 hover:text-[#001145]'
          }`}
        >
          <Shield size={18} /> Privacy
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'notifications'
              ? 'bg-[#001145] text-white shadow-md'
              : 'text-gray-600 hover:text-[#001145]'
          }`}
        >
          <Bell size={18} /> Notifications
        </button>
      </div>

      {activeTab === 'privacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Visibility */}
          <Card className="bg-[#e4f0ff] border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Eye className="text-[#001145]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#001145]">Profile Visibility</h3>
                <p className="text-sm text-[#7088aa]">Control who can see your profile</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { value: 'all', label: 'All Alumni', desc: 'Anyone on the platform can view your profile' },
                { value: 'batch', label: 'Same Batch Only', desc: 'Only your batchmates can view your profile' },
                { value: 'connections', label: 'Connections Only', desc: 'Only connected alumni can view your profile' },
                { value: 'hidden', label: 'Hidden', desc: 'Your profile is not visible to others' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                    profileVisibility === option.value ? 'bg-[#001145] text-white' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={profileVisibility === option.value}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    profileVisibility === option.value ? 'border-white' : 'border-gray-300'
                  }`}>
                    {profileVisibility === option.value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`font-medium ${profileVisibility === option.value ? 'text-white' : 'text-[#001145]'}`}>
                      {option.label}
                    </p>
                    <p className={`text-sm ${profileVisibility === option.value ? 'text-white/70' : 'text-gray-500'}`}>
                      {option.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="bg-[#e4f0ff] border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Lock className="text-[#001145]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#001145]">Contact Information</h3>
                <p className="text-sm text-[#7088aa]">Choose what info to share</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#7088aa]" />
                  <div>
                    <p className="font-medium text-[#001145]">Email Address</p>
                    <p className="text-sm text-gray-500">Show on your profile</p>
                  </div>
                </div>
                <Toggle enabled={showEmail} onChange={setShowEmail} />
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[#7088aa]" />
                  <div>
                    <p className="font-medium text-[#001145]">Phone Number</p>
                    <p className="text-sm text-gray-500">Show on your profile</p>
                  </div>
                </div>
                <Toggle enabled={showPhone} onChange={setShowPhone} />
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div className="flex items-center gap-3">
                  <Linkedin size={18} className="text-[#7088aa]" />
                  <div>
                    <p className="font-medium text-[#001145]">LinkedIn Profile</p>
                    <p className="text-sm text-gray-500">Show on your profile</p>
                  </div>
                </div>
                <Toggle enabled={showLinkedin} onChange={setShowLinkedin} />
              </div>
            </div>
          </Card>

          {/* Who Can Contact */}
          <Card className="bg-[#e4f0ff] border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <MessageSquare className="text-[#001145]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#001145]">Who Can Contact Me</h3>
                <p className="text-sm text-[#7088aa]">Control who can send you messages</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { value: 'everyone', label: 'Everyone', icon: Globe },
                { value: 'connections', label: 'Connections Only', icon: Users },
                { value: 'batch', label: 'Same Batch Only', icon: Users },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                    contactPermission === option.value ? 'bg-[#001145] text-white' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="contact"
                    value={option.value}
                    checked={contactPermission === option.value}
                    onChange={(e) => setContactPermission(e.target.value)}
                    className="sr-only"
                  />
                  <option.icon size={18} className={contactPermission === option.value ? 'text-white' : 'text-[#7088aa]'} />
                  <span className={`font-medium ${contactPermission === option.value ? 'text-white' : 'text-[#001145]'}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Data Preferences */}
          <Card className="bg-[#e4f0ff] border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Shield className="text-[#001145]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#001145]">Data Preferences</h3>
                <p className="text-sm text-[#7088aa]">Control how your data is used</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div>
                  <p className="font-medium text-[#001145]">Searchable in Directory</p>
                  <p className="text-sm text-gray-500">Allow others to find you via search</p>
                </div>
                <Toggle enabled={searchable} onChange={setSearchable} />
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div>
                  <p className="font-medium text-[#001145]">Anonymous Analytics</p>
                  <p className="text-sm text-gray-500">Help improve the platform with anonymous usage data</p>
                </div>
                <Toggle enabled={shareData} onChange={setShareData} />
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">We never sell your data to third parties. Your privacy is our priority.</p>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Notifications */}
          <Card className="bg-[#e4f0ff] border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Mail className="text-[#001145]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#001145]">Email Notifications</h3>
                <p className="text-sm text-[#7088aa]">Choose what emails to receive</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { key: 'jobs', label: 'New Job Postings', icon: Briefcase },
                { key: 'events', label: 'Event Announcements', icon: Calendar },
                { key: 'connections', label: 'Connection Requests', icon: Users },
                { key: 'messages', label: 'New Messages', icon: MessageSquare },
                { key: 'campaigns', label: 'Campaign Updates', icon: Heart },
                { key: 'newsletter', label: 'Weekly Newsletter', icon: Mail },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-[#7088aa]" />
                    <span className="font-medium text-[#001145]">{item.label}</span>
                  </div>
                  <Toggle
                    enabled={emailNotifs[item.key as keyof typeof emailNotifs]}
                    onChange={(v) => setEmailNotifs({ ...emailNotifs, [item.key]: v })}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Push Notifications */}
          <Card className="bg-[#e4f0ff] border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Smartphone className="text-[#001145]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#001145]">Push Notifications</h3>
                <p className="text-sm text-[#7088aa]">Real-time alerts on your device</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { key: 'jobs', label: 'New Job Postings', icon: Briefcase },
                { key: 'events', label: 'Event Reminders', icon: Calendar },
                { key: 'connections', label: 'Connection Requests', icon: Users },
                { key: 'messages', label: 'New Messages', icon: MessageSquare },
                { key: 'campaigns', label: 'Campaign Updates', icon: Heart },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-[#7088aa]" />
                    <span className="font-medium text-[#001145]">{item.label}</span>
                  </div>
                  <Toggle
                    enabled={pushNotifs[item.key as keyof typeof pushNotifs]}
                    onChange={(v) => setPushNotifs({ ...pushNotifs, [item.key]: v })}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Notification Frequency */}
          <Card className="bg-[#e4f0ff] border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Bell className="text-[#001145]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#001145]">Notification Frequency</h3>
                <p className="text-sm text-[#7088aa]">How often do you want to hear from us?</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { value: 'immediate', label: 'Immediate', desc: 'Get notified right away' },
                { value: 'daily', label: 'Daily Digest', desc: 'One summary email per day' },
                { value: 'weekly', label: 'Weekly Summary', desc: 'One email per week' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                    notifFrequency === option.value ? 'bg-[#001145] text-white' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={notifFrequency === option.value}
                    onChange={(e) => setNotifFrequency(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    notifFrequency === option.value ? 'border-white' : 'border-gray-300'
                  }`}>
                    {notifFrequency === option.value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={`font-medium ${notifFrequency === option.value ? 'text-white' : 'text-[#001145]'}`}>
                      {option.label}
                    </p>
                    <p className={`text-sm ${notifFrequency === option.value ? 'text-white/70' : 'text-gray-500'}`}>
                      {option.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Targeted Updates */}
          <Card className="bg-[#e4f0ff] border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Users className="text-[#001145]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#001145]">Targeted Updates</h3>
                <p className="text-sm text-[#7088aa]">Get updates specific to you</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div>
                  <p className="font-medium text-[#001145]">Batch-Specific News</p>
                  <p className="text-sm text-gray-500">Updates from your batchmates</p>
                </div>
                <Toggle enabled={batchNews} onChange={setBatchNews} />
              </div>
              <div className="p-4 bg-white rounded-xl">
                <p className="font-medium text-[#001145] mb-3">Department Updates</p>
                <div className="flex flex-wrap gap-2">
                  {['CS', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Placement'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        const deptLower = dept.toLowerCase();
                        if (departmentUpdates.includes(deptLower)) {
                          setDepartmentUpdates(departmentUpdates.filter(d => d !== deptLower));
                        } else {
                          setDepartmentUpdates([...departmentUpdates, deptLower]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        departmentUpdates.includes(dept.toLowerCase())
                          ? 'bg-[#001145] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} leftIcon={<Save size={18} />} className="px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
