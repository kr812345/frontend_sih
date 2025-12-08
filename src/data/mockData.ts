// Centralized Mock Data for Sarthak Alumni Platform
// Sarthak Light Theme Colors: #001145, #001439, #4a5f7c, #7088aa, #a8bdda, #f6faff, #e4f0ff

export interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'award' | 'certification' | 'publication' | 'recognition';
}

export interface Activity {
    id: string;
    type: 'post' | 'event' | 'connection' | 'job' | 'achievement';
    description: string;
    date: string;
    link?: string;
}

export interface AlumniProfileComplete {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    bio: string;
    degree: string;
    major: string;
    faculty: string;
    gradYear: string;
    currentRole: string;
    currentCompany: string;
    location: string;
    socials: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        portfolio?: string;
    };
    alumniRelation: {
        department: string;
        faculty: string;
        university: string;
        batch: string;
    };
    latestDegree: string;
    interests: string[];
    skills: string[];
    experiences: {
        id: string;
        company: string;
        role: string;
        startDate: string;
        endDate?: string;
        current: boolean;
        description: string;
        location?: string;
    }[];
    education: {
        id: string;
        institution: string;
        degree: string;
        field: string;
        startYear: number;
        endYear?: number;
        current: boolean;
        grade?: string;
    }[];
    achievements: Achievement[];
    activities: Activity[];
    isVerified: boolean;
    connectionStatus: 'connected' | 'pending' | 'none';
}

// ===== MY PROFILE (Pre-filled detailed sample) =====
export const MY_PROFILE: AlumniProfileComplete = {
    id: 'my-profile-001',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@alumni.sarthak.edu',
    phone: '+91 98765 43210',
    avatarUrl: '/profile.jpeg',
    bio: 'Passionate Full-Stack Developer with 6+ years of experience building scalable web applications. Currently leading engineering teams at Google. Love mentoring students and contributing to open-source projects. Speaker at tech conferences and active community builder.',
    degree: 'B.Tech',
    major: 'Computer Science & Engineering',
    faculty: 'Faculty of Engineering',
    gradYear: '2018',
    currentRole: 'Senior Software Engineer',
    currentCompany: 'Google India',
    location: 'Bangalore, Karnataka',
    socials: {
        linkedin: 'https://linkedin.com/in/aaravmehta',
        github: 'https://github.com/aaravmehta',
        twitter: 'https://twitter.com/aaravmehta_dev',
        portfolio: 'https://aaravmehta.dev',
    },
    alumniRelation: {
        department: 'Computer Science & Engineering',
        faculty: 'Faculty of Engineering',
        university: 'Sarthak University',
        batch: '2014-2018',
    },
    latestDegree: 'M.S. Computer Science (Stanford University)',
    interests: ['Machine Learning', 'System Design', 'Web Development', 'Open Source', 'Mentorship', 'Public Speaking'],
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'Go', 'AWS', 'Kubernetes', 'System Design', 'GraphQL', 'PostgreSQL'],
    experiences: [
        {
            id: 'exp-1',
            company: 'Google India',
            role: 'Senior Software Engineer',
            startDate: '2021-06',
            current: true,
            description: 'Leading a team of 8 engineers building core payment infrastructure for Google Pay India. Architected systems handling 1M+ daily transactions. Mentoring junior engineers and conducting technical interviews.',
            location: 'Bangalore, India',
        },
        {
            id: 'exp-2',
            company: 'Microsoft',
            role: 'Software Engineer II',
            startDate: '2019-01',
            endDate: '2021-05',
            current: false,
            description: 'Built features for Azure DevOps platform used by 10M+ developers worldwide. Led migration of legacy services to microservices architecture, improving performance by 40%.',
            location: 'Hyderabad, India',
        },
        {
            id: 'exp-3',
            company: 'Flipkart',
            role: 'Software Engineer',
            startDate: '2018-07',
            endDate: '2018-12',
            current: false,
            description: 'Developed recommendation engine for product discovery. Implemented A/B testing framework that increased conversion rates by 15%.',
            location: 'Bangalore, India',
        },
    ],
    education: [
        {
            id: 'edu-1',
            institution: 'Stanford University',
            degree: 'M.S.',
            field: 'Computer Science',
            startYear: 2019,
            endYear: 2021,
            current: false,
            grade: 'GPA: 3.9/4.0',
        },
        {
            id: 'edu-2',
            institution: 'Sarthak University',
            degree: 'B.Tech',
            field: 'Computer Science & Engineering',
            startYear: 2014,
            endYear: 2018,
            current: false,
            grade: 'CGPA: 9.2/10',
        },
    ],
    achievements: [
        { id: 'ach-1', title: 'Google Spot Bonus Award', description: 'Recognized for exceptional contribution to Google Pay security infrastructure', date: '2023-09', type: 'award' },
        { id: 'ach-2', title: 'AWS Solutions Architect Professional', description: 'Amazon Web Services professional certification', date: '2022-03', type: 'certification' },
        { id: 'ach-3', title: 'Speaker at ReactConf India', description: 'Presented "Scaling React Applications at Google" to 2000+ attendees', date: '2023-06', type: 'recognition' },
        { id: 'ach-4', title: 'Open Source Contributor', description: 'Top contributor to React Query library with 50+ merged PRs', date: '2022-12', type: 'recognition' },
        { id: 'ach-5', title: 'Research Publication', description: 'Co-authored paper on "Distributed Systems Patterns" published in IEEE', date: '2021-08', type: 'publication' },
    ],
    activities: [
        { id: 'act-1', type: 'event', description: 'Attended Alumni Reunion 2024', date: '2024-11-15' },
        { id: 'act-2', type: 'post', description: 'Shared job opportunity for React developers', date: '2024-11-10' },
        { id: 'act-3', type: 'connection', description: 'Connected with 5 new alumni', date: '2024-11-05' },
        { id: 'act-4', type: 'achievement', description: 'Earned Google Spot Bonus', date: '2023-09-20' },
        { id: 'act-5', type: 'job', description: 'Posted internship opportunity at Google', date: '2024-10-28' },
    ],
    isVerified: true,
    connectionStatus: 'none',
};

// ===== ALUMNI DIRECTORY MOCK DATA =====
export const MOCK_ALUMNI: AlumniProfileComplete[] = [
    MY_PROFILE,
    {
        id: 'alumni-002',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 87654 32109',
        avatarUrl: '',
        bio: 'Product leader with 7+ years experience in fintech. Passionate about building user-centric products that solve real problems.',
        degree: 'B.Tech',
        major: 'Information Technology',
        faculty: 'Faculty of Engineering',
        gradYear: '2017',
        currentRole: 'Senior Product Manager',
        currentCompany: 'Razorpay',
        location: 'Bangalore, Karnataka',
        socials: { linkedin: 'https://linkedin.com/in/priyasharma' },
        alumniRelation: { department: 'Information Technology', faculty: 'Faculty of Engineering', university: 'Sarthak University', batch: '2013-2017' },
        latestDegree: 'MBA (IIM Bangalore)',
        interests: ['Product Strategy', 'Fintech', 'UX Design'],
        skills: ['Product Management', 'Agile', 'Data Analysis', 'SQL', 'Figma'],
        experiences: [
            { id: 'e1', company: 'Razorpay', role: 'Senior Product Manager', startDate: '2022-01', current: true, description: 'Leading payments product team' },
            { id: 'e2', company: 'Paytm', role: 'Product Manager', startDate: '2019-06', endDate: '2021-12', current: false, description: 'Built merchant solutions' },
        ],
        education: [
            { id: 'ed1', institution: 'IIM Bangalore', degree: 'MBA', field: 'Business Administration', startYear: 2017, endYear: 2019, current: false },
            { id: 'ed2', institution: 'Sarthak University', degree: 'B.Tech', field: 'Information Technology', startYear: 2013, endYear: 2017, current: false },
        ],
        achievements: [{ id: 'a1', title: 'Best Product Launch Award', description: 'Razorpay internal award', date: '2023-06', type: 'award' }],
        activities: [{ id: 'ac1', type: 'post', description: 'Shared insights on product management', date: '2024-11-12' }],
        isVerified: true,
        connectionStatus: 'connected',
    },
    {
        id: 'alumni-003',
        name: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        phone: '+91 76543 21098',
        avatarUrl: '',
        bio: 'Data Scientist building ML models for healthcare. Believer in AI for social good.',
        degree: 'M.Tech',
        major: 'Computer Science',
        faculty: 'Faculty of Engineering',
        gradYear: '2019',
        currentRole: 'Lead Data Scientist',
        currentCompany: 'PharmEasy',
        location: 'Mumbai, Maharashtra',
        socials: { linkedin: 'https://linkedin.com/in/rahulverma', github: 'https://github.com/rahulverma' },
        alumniRelation: { department: 'Computer Science', faculty: 'Faculty of Engineering', university: 'Sarthak University', batch: '2017-2019' },
        latestDegree: 'M.Tech Computer Science',
        interests: ['Machine Learning', 'Healthcare AI', 'Deep Learning'],
        skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'AWS SageMaker'],
        experiences: [
            { id: 'e1', company: 'PharmEasy', role: 'Lead Data Scientist', startDate: '2021-03', current: true, description: 'Building ML models for drug recommendations' },
        ],
        education: [
            { id: 'ed1', institution: 'Sarthak University', degree: 'M.Tech', field: 'Computer Science', startYear: 2017, endYear: 2019, current: false },
        ],
        achievements: [],
        activities: [],
        isVerified: true,
        connectionStatus: 'none',
    },
    {
        id: 'alumni-004',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        phone: '+91 65432 10987',
        avatarUrl: '',
        bio: 'UX Designer crafting delightful digital experiences. Design thinking evangelist.',
        degree: 'B.Des',
        major: 'Interaction Design',
        faculty: 'Faculty of Design',
        gradYear: '2020',
        currentRole: 'Senior UX Designer',
        currentCompany: 'Swiggy',
        location: 'Bangalore, Karnataka',
        socials: { linkedin: 'https://linkedin.com/in/snehareddy', portfolio: 'https://snehareddy.design' },
        alumniRelation: { department: 'Interaction Design', faculty: 'Faculty of Design', university: 'Sarthak University', batch: '2016-2020' },
        latestDegree: 'B.Des Interaction Design',
        interests: ['UX Research', 'Design Systems', 'Accessibility'],
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
        experiences: [
            { id: 'e1', company: 'Swiggy', role: 'Senior UX Designer', startDate: '2022-08', current: true, description: 'Designing food delivery experiences' },
        ],
        education: [
            { id: 'ed1', institution: 'Sarthak University', degree: 'B.Des', field: 'Interaction Design', startYear: 2016, endYear: 2020, current: false },
        ],
        achievements: [{ id: 'a1', title: 'Design Excellence Award', description: 'Swiggy quarterly award', date: '2023-12', type: 'award' }],
        activities: [],
        isVerified: true,
        connectionStatus: 'pending',
    },
    {
        id: 'alumni-005',
        name: 'Vikram Malhotra',
        email: 'vikram.m@example.com',
        phone: '+91 54321 09876',
        avatarUrl: '',
        bio: 'Engineering Manager building high-performing teams. Startup enthusiast.',
        degree: 'B.Tech',
        major: 'Electronics & Communication',
        faculty: 'Faculty of Engineering',
        gradYear: '2015',
        currentRole: 'Engineering Manager',
        currentCompany: 'Uber',
        location: 'Hyderabad, Telangana',
        socials: { linkedin: 'https://linkedin.com/in/vikrammalhotra' },
        alumniRelation: { department: 'Electronics & Communication', faculty: 'Faculty of Engineering', university: 'Sarthak University', batch: '2011-2015' },
        latestDegree: 'B.Tech ECE',
        interests: ['Leadership', 'Embedded Systems', 'Startups'],
        skills: ['Team Leadership', 'System Design', 'C++', 'Go', 'Microservices'],
        experiences: [
            { id: 'e1', company: 'Uber', role: 'Engineering Manager', startDate: '2020-01', current: true, description: 'Managing maps and navigation team' },
        ],
        education: [
            { id: 'ed1', institution: 'Sarthak University', degree: 'B.Tech', field: 'Electronics & Communication', startYear: 2011, endYear: 2015, current: false },
        ],
        achievements: [],
        activities: [],
        isVerified: true,
        connectionStatus: 'connected',
    },
];

// Add more alumni for variety
for (let i = 6; i <= 20; i++) {
    const roles = ['Software Engineer', 'Data Analyst', 'Product Designer', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer', 'ML Engineer'];
    const companies = ['Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Flipkart', 'Ola', 'Zomato', 'PhonePe', 'CRED'];
    const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
    const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];

    MOCK_ALUMNI.push({
        id: `alumni-${String(i).padStart(3, '0')}`,
        name: `Alumni Member ${i}`,
        email: `alumni${i}@example.com`,
        phone: `+91 ${Math.floor(Math.random() * 90000 + 10000)} ${Math.floor(Math.random() * 90000 + 10000)}`,
        avatarUrl: '',
        bio: 'Experienced professional passionate about technology and innovation.',
        degree: 'B.Tech',
        major: departments[i % departments.length],
        faculty: 'Faculty of Engineering',
        gradYear: String(2015 + (i % 9)),
        currentRole: roles[i % roles.length],
        currentCompany: companies[i % companies.length],
        location: locations[i % locations.length],
        socials: { linkedin: `https://linkedin.com/in/alumni${i}` },
        alumniRelation: { department: departments[i % departments.length], faculty: 'Engineering', university: 'Sarthak University', batch: `${2011 + (i % 9)}-${2015 + (i % 9)}` },
        latestDegree: 'B.Tech',
        interests: ['Technology', 'Innovation'],
        skills: ['Problem Solving', 'Communication', 'Teamwork'],
        experiences: [],
        education: [],
        achievements: [],
        activities: [],
        isVerified: i % 3 !== 0,
        connectionStatus: i % 4 === 0 ? 'connected' : i % 5 === 0 ? 'pending' : 'none',
    });
}

// ===== MOCK EVENTS =====
export const MOCK_EVENTS = [
    { _id: 'evt-001', title: 'Annual Alumni Reunion 2024', name: 'Annual Alumni Reunion 2024', date: '2024-12-20', from: { date: '2024-12-20', time: '10:00' }, to: { date: '2024-12-20', time: '18:00' }, description: 'Join us for the grand annual reunion! Reconnect with batchmates, meet faculty, and celebrate our alma mater.', location: 'Sarthak University Campus, Main Auditorium', venue: 'Main Auditorium', eventType: 'Reunion', registeredUsers: Array(156), status: 'upcoming', createdAt: '2024-11-01' },
    { _id: 'evt-002', title: 'Tech Talk: AI in 2025', name: 'Tech Talk: AI in 2025', date: '2024-12-15', from: { date: '2024-12-15', time: '14:00' }, to: { date: '2024-12-15', time: '16:00' }, description: 'Industry experts discuss the future of AI and its impact on various sectors.', location: 'Online (Zoom)', venue: 'Virtual', eventType: 'Webinar', registeredUsers: Array(89), status: 'upcoming', createdAt: '2024-11-10' },
    { _id: 'evt-003', title: 'Startup Networking Night', name: 'Startup Networking Night', date: '2024-12-18', from: { date: '2024-12-18', time: '18:00' }, to: { date: '2024-12-18', time: '21:00' }, description: 'Connect with fellow alumni entrepreneurs. Pitch ideas, find co-founders, and network!', location: 'WeWork Galaxy, Bangalore', venue: 'WeWork Galaxy', eventType: 'Networking', registeredUsers: Array(45), status: 'upcoming', createdAt: '2024-11-08' },
    { _id: 'evt-004', title: 'Workshop: System Design Masterclass', name: 'Workshop: System Design Masterclass', date: '2024-12-22', from: { date: '2024-12-22', time: '09:00' }, to: { date: '2024-12-22', time: '17:00' }, description: 'Hands-on workshop on designing scalable distributed systems. By Aarav Mehta (Google).', location: 'Sarthak University, Lab Complex', venue: 'Lab Complex', eventType: 'Workshop', registeredUsers: Array(32), status: 'upcoming', createdAt: '2024-11-12' },
    { _id: 'evt-005', title: 'Career Guidance Session', name: 'Career Guidance Session', date: '2024-12-25', from: { date: '2024-12-25', time: '15:00' }, to: { date: '2024-12-25', time: '17:00' }, description: 'Get career advice from industry professionals. Resume review and mock interviews.', location: 'Online (Google Meet)', venue: 'Virtual', eventType: 'Webinar', registeredUsers: Array(120), status: 'upcoming', createdAt: '2024-11-15' },
    { _id: 'evt-006', title: 'Hackathon: Code for Good', name: 'Hackathon: Code for Good', date: '2025-01-10', from: { date: '2025-01-10', time: '08:00' }, to: { date: '2025-01-11', time: '20:00' }, description: '24-hour hackathon focused on building solutions for social impact.', location: 'Sarthak University, Innovation Hub', venue: 'Innovation Hub', eventType: 'Workshop', registeredUsers: Array(200), status: 'upcoming', createdAt: '2024-11-20' },
];

// ===== MOCK JOBS =====
export const MOCK_JOBS = [
    { _id: 'job-001', id: 'job-001', title: 'Senior Frontend Developer', company: 'Google India', location: 'Bangalore, Karnataka', type: 'full-time', isOpen: true, description: 'Join our team building next-generation payment products. Looking for experienced React developers with a passion for performance.', skillsRequired: ['React', 'TypeScript', 'GraphQL', 'Jest', 'Performance Optimization'], salary: '₹35-50 LPA', experienceLevel: '5+ years', deadline: '2024-12-31', postedBy: 'my-profile-001', createdAt: '2024-11-20' },
    { _id: 'job-002', id: 'job-002', title: 'Product Manager - Fintech', company: 'Razorpay', location: 'Bangalore, Karnataka', type: 'full-time', isOpen: true, description: 'Lead product strategy for B2B payment solutions. Work with engineering, design, and business teams.', skillsRequired: ['Product Strategy', 'Agile', 'SQL', 'Data Analysis', 'Fintech'], salary: '₹40-60 LPA', experienceLevel: '4-7 years', deadline: '2024-12-25', postedBy: 'alumni-002', createdAt: '2024-11-18' },
    { _id: 'job-003', id: 'job-003', title: 'Data Scientist', company: 'PharmEasy', location: 'Mumbai, Maharashtra', type: 'full-time', isOpen: true, description: 'Build ML models for healthcare recommendations. Experience with deep learning preferred.', skillsRequired: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Healthcare'], salary: '₹25-40 LPA', experienceLevel: '3-5 years', deadline: '2025-01-15', postedBy: 'alumni-003', createdAt: '2024-11-22' },
    { _id: 'job-004', id: 'job-004', title: 'UX Design Intern', company: 'Swiggy', location: 'Bangalore, Karnataka', type: 'internship', isOpen: true, description: 'Join our design team for a 6-month internship. Learn from senior designers and contribute to real projects.', skillsRequired: ['Figma', 'UI Design', 'Prototyping', 'User Research'], salary: '₹50,000/month', experienceLevel: 'Fresher', deadline: '2024-12-20', postedBy: 'alumni-004', createdAt: '2024-11-19' },
    { _id: 'job-005', id: 'job-005', title: 'Backend Engineer', company: 'Uber', location: 'Hyderabad, Telangana', type: 'full-time', isOpen: true, description: 'Build reliable backend services for maps and navigation. Experience with distributed systems required.', skillsRequired: ['Go', 'Java', 'Microservices', 'Kubernetes', 'PostgreSQL'], salary: '₹30-45 LPA', experienceLevel: '3-6 years', deadline: '2025-01-10', postedBy: 'alumni-005', createdAt: '2024-11-21' },
    { _id: 'job-006', id: 'job-006', title: 'DevOps Engineer', company: 'Flipkart', location: 'Bangalore, Karnataka', type: 'full-time', isOpen: true, description: 'Manage cloud infrastructure and CI/CD pipelines. AWS experience mandatory.', skillsRequired: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins'], salary: '₹28-42 LPA', experienceLevel: '4-6 years', deadline: '2024-12-28', postedBy: 'alumni-006', createdAt: '2024-11-17' },
    { _id: 'job-007', id: 'job-007', title: 'Mobile Developer (React Native)', company: 'Zomato', location: 'Gurgaon, Haryana', type: 'full-time', isOpen: true, description: 'Build cross-platform mobile apps for food delivery. React Native expertise essential.', skillsRequired: ['React Native', 'JavaScript', 'Redux', 'iOS', 'Android'], salary: '₹22-35 LPA', experienceLevel: '2-4 years', deadline: '2025-01-05', postedBy: 'alumni-007', createdAt: '2024-11-23' },
    { _id: 'job-008', id: 'job-008', title: 'Software Engineering Intern', company: 'Microsoft', location: 'Hyderabad, Telangana', type: 'internship', isOpen: true, description: 'Summer internship program for final year students. Work on Azure cloud products.', skillsRequired: ['C#', '.NET', 'Azure', 'Data Structures', 'Algorithms'], salary: '₹80,000/month', experienceLevel: 'Fresher', deadline: '2025-01-31', postedBy: 'alumni-008', createdAt: '2024-11-24' },
];

// ===== MOCK CONNECTIONS =====
export const MOCK_CONNECTIONS = MOCK_ALUMNI.filter(a => a.connectionStatus === 'connected').map(a => ({
    id: `conn-${a.id}`,
    user: { id: a.id, name: a.name, email: a.email, avatarUrl: a.avatarUrl, currentRole: a.currentRole, currentCompany: a.currentCompany, gradYear: a.gradYear },
    connectedAt: '2024-10-15',
}));

export const MOCK_PENDING_REQUESTS = [
    { id: 'req-001', from: { id: 'alumni-004', name: 'Sneha Reddy', email: 'sneha@example.com', avatarUrl: '', currentRole: 'Senior UX Designer', currentCompany: 'Swiggy' }, to: { id: MY_PROFILE.id, name: MY_PROFILE.name }, message: 'Hi! Would love to connect and discuss design systems.', status: 'pending' as const, createdAt: '2024-11-20' },
    { id: 'req-002', from: { id: 'alumni-010', name: 'Alumni Member 10', email: 'alumni10@example.com', avatarUrl: '', currentRole: 'Data Analyst', currentCompany: 'Amazon' }, to: { id: MY_PROFILE.id, name: MY_PROFILE.name }, message: 'Fellow Sarthak alum here!', status: 'pending' as const, createdAt: '2024-11-18' },
];

export const MOCK_SUGGESTIONS = MOCK_ALUMNI.filter(a => a.connectionStatus === 'none' && a.id !== MY_PROFILE.id).slice(0, 6).map((a, i) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    avatarUrl: a.avatarUrl,
    currentRole: a.currentRole,
    currentCompany: a.currentCompany,
    gradYear: a.gradYear,
    mutualConnections: Math.floor(Math.random() * 15) + 1,
    reason: ['Same batch', 'Similar interests', 'Same department', 'Worked at same company'][i % 4],
}));
