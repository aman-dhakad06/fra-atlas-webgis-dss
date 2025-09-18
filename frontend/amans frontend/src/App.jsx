import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
// import axios from 'axios'; // Uncomment when connecting to a real backend

// --- I1N & TRANSLATIONS ---
const translations = {
    en: {
        // Titles
        overview_title: 'Project Overview',
        fra_atlas_title: 'Forest Rights Act (FRA) Atlas',
        data_management_title: 'Legacy Data Management',
        asset_mapping_title: 'AI-Powered Asset Mapping',
        dss_title: 'Decision Support System (DSS)',
        community_title: 'Community Engagement Hub',
        settings_title: 'System Settings',
        app_title: 'FRA Atlas & DSS',

        // Sidebar
        overview: 'Overview',
        fra_atlas: 'FRA Atlas',
        data_management: 'Data Management',
        asset_mapping: 'Asset Mapping',
        dss: 'Decision Support',
        community: 'Community Engagement',
        settings: 'Settings',

        // Stat Cards
        digitized_records: 'Digitized FRA Records',
        villages_mapped: 'Villages Mapped',
        assets_identified: 'Assets Identified',
        grievances_logged: 'Grievances Logged',
        this_month: 'this month',

        // Data Management & DSS
        upload_docs: 'Upload Documents',
        filter_by_state: 'Filter by State',
        filter_by_status: 'Filter by Status',
        all: 'All',
        claim_id: 'Claim ID',
        holder: 'Patta Holder',
        village_district: 'Village, District',
        state: 'State',
        status: 'Status',
        actions: 'Actions',
        gen_summary: 'Generate Summary',
        no_records_match: 'No records match the current filters.',
        ai_summary_for: 'AI Summary for',
        dss_engine_title: 'Scheme Recommendation Engine',
        dss_engine_desc: 'Layer Central Sector Schemes (CSS) benefits for FRA patta holders based on mapped data and eligibility criteria.',
        find_recommendations: 'Find Recommendations',
        results: 'Results:',
        village: 'Village',
        issue: 'Issue',
        recommended_schemes: 'Recommended Schemes',
        gen_strategy_report: 'Generate Strategy Report',
        generating_report: 'Generating...',
        ai_strategy: 'AI-Generated Intervention Strategy:',

        // FRA Atlas - NEW FEATURES ADDED
        filters_layers: 'Filters & Layers',
        map_layers: 'Map Layers',
        village_boundaries: 'Village Boundaries',
        ifr_claims: 'IFR Claims',
        cfr_claims: 'CFR Claims',
        land_use: 'Land Use Classification',
        water_bodies: 'Water Bodies',
        switch_to_lang: 'Switch to',
        field_reports: 'Field Reports (Mobile)',
        advanced_ai_layers: 'Advanced AI Layers',
        potential_claims: 'Potential CFR Claims',
        change_detection: 'Change Detection',
        timeline_control: 'Timeline Control for Change Detection',
        start_date: 'Start Date',
        end_date: 'End Date',
        view_mode: 'View Mode',

        // Community
        grievance_tracker: 'Grievance Redressal Tracker',
        recent_meetings: 'Recent Gram Sabha Meetings',
        community_feedback: 'Community Feedback',

        // General
        generating: 'Generating with Gemini...',
        language: 'Language',
        loading: 'Loading...',
        
        // Scheme Names & Descriptions
        jjm: 'Jal Jeevan Mission',
        jjm_desc: 'Aims to provide safe and adequate drinking water through individual household tap connections by 2024 to all households in rural India.',
        mgnrega: 'MGNREGA',
        mgnrega_desc: 'Aims to enhance livelihood security in rural areas by providing at least 100 days of guaranteed wage employment in a financial year to every household whose adult members volunteer to do unskilled manual work.',
        pmkisan: 'PM-KISAN',
        pmkisan_desc: 'An income support scheme for all landholding farmer families to supplement their financial needs for procuring various inputs related to agriculture and allied activities.',
        pmksy: 'PMKSY (Per Drop More Crop)',
        pmksy_desc: 'Aims to enhance water use efficiency at the farm level through micro-irrigation technologies.',
        nfsm: 'National Food Security Mission',
        nfsm_desc: 'Aims to increase the production of rice, wheat, pulses, and coarse cereals through area expansion and productivity enhancement.',
        vandhan: 'Van Dhan Vikas Karyakram',
        vandhan_desc: 'An initiative for providing skill upgradation and setting up of primary processing and value addition facilities for tribal communities.',
        pmgsy: 'PM Gram Sadak Yojana',
        pmgsy_desc: 'Aims to provide good all-weather road connectivity to unconnected villages.',
        ssa: 'Samagra Shiksha Abhiyan',
        ssa_desc: 'An integrated scheme for school education extending from pre-school to class 12 to ensure inclusive and equitable quality education.',
        emrs: 'Eklavya Model Residential Schools',
        emrs_desc: 'Aims to provide quality middle and high-level education to Scheduled Tribe (ST) students in remote areas.'
    },
    hi: { // Hindi
        overview_title: 'परियोजना अवलोकन',
        fra_atlas_title: 'वन अधिकार अधिनियम (FRA) एटलस',
        data_management_title: 'विरासत डेटा प्रबंधन',
        asset_mapping_title: 'एआई-संचालित संपत्ति मैपिंग',
        dss_title: 'निर्णय समर्थन प्रणाली (DSS)',
        community_title: 'सामुदायिक सहभागिता केंद्र',
        settings_title: 'सिस्टम सेटिंग्स',
        app_title: 'FRA एटलस और DSS',
        overview: 'अवलोकन',
        fra_atlas: 'FRA एटलस',
        data_management: 'डेटा प्रबंधन',
        asset_mapping: 'एसेट मैपिंग',
        dss: 'निर्णय समर्थन',
        community: 'सामुदायिक जुड़ाव',
        settings: 'सेटिंग्स',
        digitized_records: 'डिजिटल FRA रिकॉर्ड्स',
        villages_mapped: 'मैप किए गए गांव',
        assets_identified: 'पहचाने गए संपत्ति',
        grievances_logged: 'दर्ज शिकायतें',
        this_month: 'इस महीने',
        upload_docs: 'दस्तावेज़ अपलोड करें',
        filter_by_state: 'राज्य द्वारा फ़िल्टर करें',
        filter_by_status: 'स्थिति द्वारा फ़िल्टर करें',
        all: 'सभी',
        claim_id: 'दावा आईडी',
        holder: 'पट्टा धारक',
        village_district: 'गांव, जिला',
        state: 'राज्य',
        status: 'स्थिति',
        actions: 'कार्रवाइयाँ',
        gen_summary: 'सारांश उत्पन्न करें',
        no_records_match: 'वर्तमान फ़िल्टर से कोई रिकॉर्ड मेल नहीं खाता।',
        ai_summary_for: 'के लिए AI सारांश',
        dss_engine_title: 'योजना अनुशंसा इंजन',
        dss_engine_desc: 'मैप किए गए डेटा और पात्रता मानदंडों के आधार पर FRA पट्टा धारकों के लिए केंद्रीय क्षेत्र की योजनाओं (CSS) के लाभों को परत करें।',
        find_recommendations: 'सिफारिशें खोजें',
        results: 'परिणाम:',
        village: 'गाँव',
        issue: 'मुद्दा',
        recommended_schemes: 'अनुशंसित योजनाएं',
        gen_strategy_report: 'रणनीति रिपोर्ट तैयार करें',
        generating_report: 'उत्पन्न हो रहा है...',
        ai_strategy: 'एआई-जनित हस्तक्षेप रणनीति:',
        filters_layers: 'फ़िल्टर और परतें',
        map_layers: 'मानचित्र परतें',
        village_boundaries: 'ग्राम सीमाएँ',
        ifr_claims: 'IFR दावे',
        cfr_claims: 'CFR दावे',
        land_use: 'भूमि उपयोग वर्गीकरण',
        water_bodies: 'जलाशय',
        grievance_tracker: 'शिकायत निवारण ट्रैकर',
        recent_meetings: 'हाल की ग्राम सभा बैठकें',
        community_feedback: 'सामुदायिक प्रतिक्रिया',
        generating: 'जेमिनी के साथ उत्पन्न हो रहा है...',
        language: 'भाषा',
        loading: 'लोड हो रहा है...',
        switch_to_lang: 'पर स्विच करें',
        jjm: 'जल जीवन मिशन',
        jjm_desc: 'ग्रामीण भारत के सभी घरों में 2024 तक व्यक्तिगत घरेलू नल कनेक्शन के माध्यम से सुरक्षित और पर्याप्त पेयजल उपलब्ध कराने का लक्ष्य है।',
        mgnrega: 'मनरेगा',
        mgnrega_desc: 'ग्रामीण क्षेत्रों में हर उस घर को एक वित्तीय वर्ष में कम से कम 100 दिनों का गारंटीकृत मजदारी रोजगार प्रदान करके आजीविका सुरक्षा बढ़ाने का लक्ष्य है, जिसके वयस्क सदस्य अकुशल शारीरिक काम करने के लिए स्वेच्छा से काम करते हैं।',
        pmkisan: 'पीएम-किसान',
        pmkisan_desc: 'देश के सभी भूमिधारक किसान परिवारों के लिए एक आय सहायता योजना है ताकि कृषि और संबद्ध गतिविधियों के साथ-साथ घरेलू जरूरतों से संबंधित विभिन्न आदानों की खरीद के लिए उनकी वित्तीय जरूरतों को पूरा किया जा सके।',
    },
    bn: { /* ... */ },
    or: { /* ... */ },
    te: { /* ... */ }
};

const LanguageContext = createContext();

const useTranslations = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useTranslations must be used within a LanguageProvider');
    const { language, setLanguage } = context;
    const t = (key) => translations[language]?.[key] || translations.en[key] || key;
    return { t, language, setLanguage };
};

// --- SVG ICONS ---
const HomeIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const UsersIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const MapIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);
const DatabaseIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>);
const LayersIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>);
const BrainCircuitIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 2a2.83 2.83 0 0 0 4 4 4 4 0 1 1-8 0 2.83 2.83 0 0 0 4-4"/><path d="M12 14a2.83 2.83 0 0 0 4 4 4 4 0 1 1-8 0 2.83 2.83 0 0 0 4-4"/><path d="M20 10a2.83 2.83 0 0 0-4-4 4 4 0 1 0 0 8 2.83 2.83 0 0 0 4-4"/><path d="M4 10a2.83 2.83 0 0 1 4-4 4 4 0 1 1 0 8 2.83 2.83 0 0 1-4-4"/><path d="M17.8 7.2a4 4 0 0 0-3.6 0"/><path d="M6.2 7.2a4 4 0 0 1 3.6 0"/><path d="M17.8 16.8a4 4 0 0 0-3.6 0"/><path d="M6.2 16.8a4 4 0 0 1 3.6 0"/><path d="M12 12v-2"/><path d="M12 18v-2"/><path d="M12 8V6"/><path d="m14.5 12.5 1-1"/><path d="M9.5 12.5 8.5 11.5"/><path d="m14.5 11.5-1-1"/><path d="m9.5 11.5 1-1"/></svg>);
const SettingsIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l-.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>);
const MenuIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);
const SunIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>);
const MoonIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>);
const LoaderIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} animate-spin`} aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>);
const ChevronDownIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>);
const GlobeIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);

// --- STATIC DATA ---
const districtData = { 'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Dindori', 'Betul'], 'Tripura': ['West Tripura', 'North Tripura', 'South Tripura', 'Dhalai', 'Unakoti', 'Khowai', 'Gomati', 'Sepahijala'], 'Odisha': ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Sundargarh', 'Mayurbhanj', 'Koraput', 'Malkangiri'], 'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Adilabad', 'Khammam', 'Mahbubnagar', 'Medak'] };
const stateLanguageMap = { 'Tripura': {code: 'bn', name: 'Bengali'}, 'Odisha': {code: 'or', name: 'Odia'}, 'Telangana': {code: 'te', name: 'Telugu'}};
const allRecordsData = [ { id: 'IFR-MP-0123', holder: 'Ram Singh', village: 'Salapura, Dindori', state: 'Madhya Pradesh', type: 'IFR', status: 'Granted' }, { id: 'CFR-OD-0089', holder: 'Jharigaon Community', village: 'Jharigaon, Koraput', state: 'Odisha', type: 'CFR', status: 'Pending' }, { id: 'IFR-TR-0456', holder: 'Sunita Devi', village: 'Korbong, Dhalai', state: 'Tripura', type: 'IFR', status: 'Rejected'}, { id: 'IFR-TS-0789', holder: 'Lachiram Gond', village: 'Jainoor, Adilabad', state: 'Telangana', type: 'IFR', status: 'Granted' }, { id: 'CFR-MP-0011', holder: 'Baiga Community', village: 'Bajag, Dindori', state: 'Madhya Pradesh', type: 'CFR', status: 'Granted' }, { id: 'IFR-OD-0321', holder: 'Soma Majhi', village: 'Kalimela, Malkangiri', state: 'Odisha', type: 'IFR', status: 'Pending' }, { id: 'IFR-MP-0124', holder: 'Gita Bai', village: 'Shahpur, Betul', state: 'Madhya Pradesh', type: 'IFR', status: 'Rejected' }, { id: 'CFR-TR-0023', holder: 'Reang Community', village: 'Ambassa, Dhalai', state: 'Tripura', type: 'CFR', status: 'Pending' }, { id: 'IFR-TS-0790', holder: 'Raju Naik', village: 'Aswaraopeta, Khammam', state: 'Telangana', type: 'IFR', status: 'Granted' }, { id: 'IFR-OD-0322', holder: 'Manglu Kisan', village: 'Bonai, Sundargarh', state: 'Odisha', type: 'IFR', status: 'Granted' }, { id: 'CFR-TS-0015', holder: 'Koya Tribe', village: 'Bhadrachalam, Khammam', state: 'Telangana', type: 'CFR', status: 'Pending' }, { id: 'IFR-TR-0457', holder: 'Biplab Jamatia', village: 'Amarpur, Gomati', state: 'Tripura', type: 'IFR', status: 'Granted' }, { id: 'IFR-MP-1021', holder: 'Ramesh Yadav', village: 'Berasia, Bhopal', state: 'Madhya Pradesh', type: 'IFR', status: 'Pending' }, { id: 'CFR-OD-0134', holder: 'Dongria Kondh Community', village: 'Rayagada, Koraput', state: 'Odisha', type: 'CFR', status: 'Granted' }, { id: 'IFR-TS-1155', holder: 'Komaram Bheem', village: 'Asifabad, Adilabad', state: 'Telangana', type: 'IFR', status: 'Rejected' } ];

// --- MOCK API SERVICE ---
const api = {
    getDashboardStats: () => new Promise(resolve => {
        setTimeout(() => {
            resolve({
                digitizedRecords: 1254321, digitizedRecordsChange: "+15k",
                villagesMapped: 4820, villagesMappedChange: "+120",
                assetsIdentified: 8598745, assetsIdentifiedChange: "+500k",
                grievancesLogged: 1245, grievancesLoggedChange: "+58"
            });
        }, 1500); // Simulate network delay
    }),
    getFraRecords: () => new Promise(resolve => {
        setTimeout(() => resolve(allRecordsData), 1000);
    }),
};

// --- HOOKS ---
const useCountUp = (end, duration = 1500) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (end === null || end === undefined) return;
        let frame = 0;
        const totalFrames = Math.round(duration / (1000 / 60));
        const easeOutQuad = t => t * (2 - t);
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            setCount(Math.round(end * progress));
            if (frame === totalFrames) clearInterval(counter);
        }, 1000 / 60);
        return () => clearInterval(counter);
    }, [end, duration]);
    return count.toLocaleString();
};

// --- REUSABLE & SKELETON COMPONENTS ---
const Modal = ({ title, content, onClose, isLoading, triggerRef }) => { /* ... existing code ... */ const { t } = useTranslations(); const modalRef = useRef(null); const closeButtonRef = useRef(null); useEffect(() => { const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); if (event.key === 'Tab') { const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'); const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey) { if (document.activeElement === first) { last.focus(); event.preventDefault(); } } else { if (document.activeElement === last) { first.focus(); event.preventDefault(); } } } }; document.addEventListener('keydown', handleKeyDown); if (closeButtonRef.current) closeButtonRef.current.focus(); return () => { document.removeEventListener('keydown', handleKeyDown); if (triggerRef.current) triggerRef.current.focus(); }; }, [onClose, triggerRef]); return (<div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"><div ref={modalRef} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"><div className="flex justify-between items-center p-4 border-b border-black/10 dark:border-white/10"><h3 id="modal-title" className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3><button ref={closeButtonRef} onClick={onClose} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" aria-label="Close dialog">&times;</button></div><div className="p-6 overflow-y-auto">{isLoading ? (<div className="flex flex-col items-center justify-center h-48" aria-live="polite"><LoaderIcon className="w-12 h-12 text-blue-500" /><p className="mt-4 text-gray-600 dark:text-gray-300">{t('generating')}</p></div>) : (<div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{content}</div>)}</div></div></div>);};
const Sidebar = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => { /* ... existing code ... */ const { t } = useTranslations(); const navItems = [ { id: 'overview', label: t('overview'), icon: HomeIcon }, { id: 'fra_atlas', label: t('fra_atlas'), icon: MapIcon }, { id: 'data_management', label: t('data_management'), icon: DatabaseIcon }, { id: 'asset_mapping', label: t('asset_mapping'), icon: LayersIcon }, { id: 'dss', label: t('dss'), icon: BrainCircuitIcon }, { id: 'community', label: t('community'), icon: UsersIcon}, { id: 'settings', label: t('settings'), icon: SettingsIcon }, ]; const NavLink = ({ item }) => (<a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); if (isOpen) setIsOpen(false); }} className={`flex items-center px-4 py-3 text-base rounded-lg transition-all duration-300 transform hover:scale-105 group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${ currentPage === item.id ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}><item.icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:rotate-6" /><span className="font-medium">{item.label}</span></a>); return (<><div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} aria-hidden={!isOpen}></div><aside aria-label="Main Navigation" className={`fixed top-0 left-0 h-full w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-black/20 p-4 transform transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center mb-10 px-2"><MapIcon className="w-10 h-10 text-blue-500" /><h1 className="text-xl font-bold ml-3 text-gray-800 dark:text-white">{t('app_title')}</h1></div><nav><ul className="flex flex-col space-y-3">{navItems.map(item => <li key={item.id}><NavLink item={item} /></li>)}</ul></nav></aside></>); };
const Header = ({ currentPage, onMenuClick, theme, toggleTheme }) => { /* ... existing code ... */ const { t, language, setLanguage } = useTranslations(); const pageTitles = { overview: t('overview_title'), fra_atlas: t('fra_atlas_title'), data_management: t('data_management_title'), asset_mapping: t('asset_mapping_title'), dss: t('dss_title'), community: t('community_title'), settings: t('settings_title') }; const langNames = { en: 'English', hi: 'हिंदी', bn: 'বাংলা', or: 'ଓଡିଆ', te: 'తెలుగు' }; return (<header className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg shadow-md sticky top-0 z-20 border-b border-black/5 dark:border-white/5"><div className="flex items-center"><button onClick={onMenuClick} className="md:hidden text-gray-600 dark:text-gray-300 mr-4 p-2 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" aria-label="Open navigation menu"><MenuIcon className="w-6 h-6" /></button><h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white" tabIndex={-1}>{pageTitles[currentPage]}</h2></div><div className="flex items-center space-x-2"><div className="relative"><label htmlFor="lang-select" className="sr-only">{t('language')}</label><select id="lang-select" value={language} onChange={e => setLanguage(e.target.value)} className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 bg-transparent appearance-none cursor-pointer pr-8">{Object.keys(langNames).map(code => <option key={code} value={code} className="text-black dark:text-white bg-white dark:bg-gray-800">{langNames[code]}</option>)}</select></div><button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}</button><img src="https://placehold.co/40x40/6366f1/ffffff?text=U" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-blue-500" /></div></header>);};
const StatCard = ({ title, value, icon: Icon, change, color = 'blue' }) => { /* ... existing code ... */ const { t } = useTranslations(); const animatedValue = useCountUp(value); return (<div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-${color}-500/50`}><div className="flex items-center space-x-4"><div className={`p-3 bg-gradient-to-br from-${color}-100 to-${color}-200 dark:from-${color}-900/70 dark:to-${color}-800/70 rounded-full`}><Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} /></div><div><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p><p className="text-3xl font-bold text-gray-800 dark:text-white">{animatedValue}</p></div></div>{change && <p className={`text-sm font-semibold mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change} {t('this_month')}</p>}</div>);};
const StatCardSkeleton = ({ color = 'gray' }) => (<div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg animate-pulse`}><div className="flex items-center space-x-4"><div className={`p-3 bg-${color}-200 dark:bg-${color}-700 rounded-full w-14 h-14`}></div><div className="flex-1"><div className={`h-4 bg-${color}-200 dark:bg-${color}-700 rounded w-3/4 mb-2`}></div><div className={`h-8 bg-${color}-200 dark:bg-${color}-700 rounded w-1/2`}></div></div></div><div className={`h-4 bg-${color}-200 dark:bg-${color}-700 rounded w-1/3 mt-2`}></div></div>);
const Globe = () => { /* ... existing code ... */ return <div className="w-full h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-4 overflow-hidden"><div role="img" aria-label="Animated globe showing target states" className="relative w-64 h-64 md:w-80 md:h-80"><div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-pulse-slow"></div><div className="absolute inset-2 border border-blue-400/20 rounded-full animate-pulse-slower"></div><div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full animate-spin-slow shadow-2xl shadow-blue-500/40"><div className="absolute w-2/3 h-2/3 bg-green-400/30 rounded-full top-1/4 left-1/4 blur-lg opacity-50"></div></div>{[{ name: 'Madhya Pradesh', lat: 23.47, lon: 77.94 }, { name: 'Tripura', lat: 23.76, lon: 91.49 }, { name: 'Odisha', lat: 20.95, lon: 85.09 }, { name: 'Telangana', lat: 18.11, lon: 79.01 }].map(s => (<div key={s.name} className="absolute w-3 h-3 bg-yellow-300 rounded-full shadow-lg" style={{ top: `${50 - s.lat / 2}%`, left: `${50 + s.lon / 4}%`, transform: 'translate(-50%, -50%)' }}><div className="absolute -inset-1 border border-yellow-300 rounded-full animate-ping"></div><span className="sr-only">Marker for {s.name}</span></div>))}</div></div>; };
const AccordionItem = ({ title, children }) => { const [isOpen, setIsOpen] = useState(false); return (<div className="border-b dark:border-gray-700"><button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"><span className="flex-1">{title}</span><ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button><div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><div className="p-4 text-gray-600 dark:text-gray-400">{children}</div></div></div></div>); };
const ToggleSwitch = ({ id, label, checked, onChange }) => (<label htmlFor={id} className="flex items-center justify-between cursor-pointer"><span className="text-gray-700 dark:text-gray-300">{label}</span><div className="relative"><input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only peer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"/><div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></div></label>);

// --- PAGE CONTENT COMPONENTS ---
const OverviewContent = () => { /* ... existing code ... */ const { t } = useTranslations(); const [stats, setStats] = useState(null); const [isLoading, setIsLoading] = useState(true); useEffect(() => { const fetchStats = async () => { setIsLoading(true); const data = await api.getDashboardStats(); setStats(data); setIsLoading(false); }; fetchStats(); }, []); if (isLoading) { return ( <div className="p-6"> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> <StatCardSkeleton color="blue" /> <StatCardSkeleton color="green" /> <StatCardSkeleton color="yellow" /> <StatCardSkeleton color="red" /> </div> </div> ); } return ( <div className="p-6 animate-fade-in"> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> <StatCard title={t('digitized_records')} value={stats.digitizedRecords} icon={DatabaseIcon} change={stats.digitizedRecordsChange} color="blue" /> <StatCard title={t('villages_mapped')} value={stats.villagesMapped} icon={MapIcon} change={stats.villagesMappedChange} color="green"/> <StatCard title={t('assets_identified')} value={stats.assetsIdentified} icon={LayersIcon} change={stats.assetsIdentifiedChange} color="yellow"/> <StatCard title={t('grievances_logged')} value={stats.grievancesLogged} icon={UsersIcon} change={stats.grievancesLoggedChange} color="red"/> </div> <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"> <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('overview_title')}</h3> <Globe /> </div> </div> );};

const TimelineSlider = ({ startDate, endDate, onDateChange }) => {
    const { t } = useTranslations();
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);

    const handleStartChange = (e) => {
        const newStart = e.target.value;
        if (newStart < end) {
            setStart(newStart);
            onDateChange(newStart, end);
        }
    };

    const handleEndChange = (e) => {
        const newEnd = e.target.value;
        if (newEnd > start) {
            setEnd(newEnd);
            onDateChange(start, newEnd);
        }
    };
    
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-4 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
            <h5 className="text-center font-semibold mb-2">{t('timeline_control')}</h5>
            <div className="flex items-center justify-around">
                <div className="flex flex-col items-center">
                    <label htmlFor="start-date" className="text-sm font-medium">{t('start_date')}</label>
                    <input type="month" id="start-date" value={start} onChange={handleStartChange} className="p-1 rounded bg-gray-200 dark:bg-gray-700"/>
                </div>
                <div className="text-2xl font-thin mx-4">-</div>
                 <div className="flex flex-col items-center">
                    <label htmlFor="end-date" className="text-sm font-medium">{t('end_date')}</label>
                    <input type="month" id="end-date" value={end} onChange={handleEndChange} className="p-1 rounded bg-gray-200 dark:bg-gray-700"/>
                </div>
            </div>
        </div>
    );
}

const FRAAtlasContent = () => { 
    const { t, setLanguage } = useTranslations();
    const [selectedState, setSelectedState] = useState('Madhya Pradesh');
    const [is3DMode, setIs3DMode] = useState(false);
    const [showChangeDetection, setShowChangeDetection] = useState(false);
    const [timelineDates, setTimelineDates] = useState({ start: '2020-01', end: '2025-01' });

    const districts = districtData[selectedState] || [];
    const localLang = stateLanguageMap[selectedState];
    const handleDateChange = (start, end) => setTimelineDates({ start, end });

    return ( 
        <div className="p-6 h-full flex flex-col animate-fade-in">
            <div className="flex-grow flex bg-white dark:bg-gray-800 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="w-1/4 max-w-sm p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">{t('filters_layers')}</h3>
                    {localLang && <button onClick={() => setLanguage(localLang.code)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4">{t('switch_to_lang')} {localLang.name}</button>}
                    
                    <div className="mb-6">
                        <label htmlFor="state-select" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('state')}</label>
                        <select id="state-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-blue-500">{Object.keys(districtData).map(state => <option key={state} value={state}>{state}</option>)}</select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="district-select" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('village_district').split(',')[1].trim()}</label>
                        <select id="district-select" className="w-full p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-blue-500">{districts.map(district => <option key={district} value={district}>{district}</option>)}</select>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('map_layers')}</h4>
                        <div className="space-y-3">
                            <ToggleSwitch id="layer-village" label={t('village_boundaries')} />
                            <ToggleSwitch id="layer-ifr" label={t('ifr_claims')} />
                            <ToggleSwitch id="layer-cfr" label={t('cfr_claims')} />
                            <ToggleSwitch id="layer-landuse" label={t('land_use')} />
                            <ToggleSwitch id="layer-water" label={t('water_bodies')} />
                            <ToggleSwitch id="layer-field-reports" label={t('field_reports')} />
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t dark:border-gray-700">
                         <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('advanced_ai_layers')}</h4>
                         <div className="space-y-3">
                             <ToggleSwitch id="layer-potential-claims" label={t('potential_claims')} />
                             <ToggleSwitch id="layer-change-detection" label={t('change_detection')} checked={showChangeDetection} onChange={() => setShowChangeDetection(!showChangeDetection)}/>
                         </div>
                    </div>
                </div>

                <div role="application" aria-label="Interactive map" className="flex-1 flex items-center justify-center bg-gray-200/50 dark:bg-gray-900/50 rounded-r-2xl relative">
                    <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-1.5 rounded-full flex items-center space-x-2 shadow-lg">
                        <button onClick={() => setIs3DMode(false)} className={`px-3 py-1 rounded-full text-sm font-semibold ${!is3DMode ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}>2D</button>
                        <button onClick={() => setIs3DMode(true)} className={`px-3 py-1 rounded-full text-sm font-semibold ${is3DMode ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}><GlobeIcon className="w-5 h-5 inline-block mr-1"/>3D</button>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-lg">[Interactive WebGIS Map Placeholder]</p>
                    
                    {showChangeDetection && <TimelineSlider startDate={timelineDates.start} endDate={timelineDates.end} onDateChange={handleDateChange} />}
                </div>
            </div>
        </div> 
    );
};

const DataManagementContent = () => { /* ... existing code ... */ const { t } = useTranslations(); const [isModalOpen, setIsModalOpen] = useState(false); const [selectedRecord, setSelectedRecord] = useState(null); const [summary, setSummary] = useState(''); const [isSummarizing, setIsSummarizing] = useState(false); const summaryTriggerRef = useRef(null); const [stateFilter, setStateFilter] = useState('All'); const [statusFilter, setStatusFilter] = useState('All'); const [allRecords, setAllRecords] = useState([]); useEffect(() => { api.getFraRecords().then(data => setAllRecords(data)); }, []); const filteredRecords = allRecords.filter(record => (stateFilter === 'All' || record.state === stateFilter) && (statusFilter === 'All' || record.status === statusFilter)); const handleGenerateSummary = async (record, event) => { summaryTriggerRef.current = event.target; setSelectedRecord(record); setIsModalOpen(true); setIsSummarizing(true); await new Promise(resolve => setTimeout(resolve, 2000)); const mockApiResponse = `**Summary for Claim ID: ${record.id}**\n\nThis is an **${record.type}** claim for **${record.holder}** from **${record.village}, ${record.state}**. The current status of the claim is **${record.status}**.`; setSummary(mockApiResponse); setIsSummarizing(false); }; const getStatusClass = (status) => ({ 'Granted': 'bg-green-500 text-green-700 dark:text-green-300', 'Pending': 'bg-yellow-500 text-yellow-700 dark:text-yellow-300', 'Rejected': 'bg-red-500 text-red-700 dark:text-red-300' }[status] || 'bg-gray-500 text-gray-700 dark:text-gray-300'); return (<div className="p-6 animate-fade-in">{isModalOpen && <Modal title={`${t('ai_summary_for')} ${selectedRecord.id}`} content={summary} onClose={() => setIsModalOpen(false)} isLoading={isSummarizing} triggerRef={summaryTriggerRef} />}<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"><div className="sm:flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">{t('digitized_records')}</h3><button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">{t('upload_docs')}</button></div><div className="flex flex-wrap gap-4 my-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><div><label htmlFor="state-filter" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('filter_by_state')}</label><select id="state-filter" value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="p-2 rounded-md bg-white dark:bg-gray-600 border-transparent focus:ring-2 focus:ring-blue-500"><option value="All">{t('all')}</option>{Object.keys(districtData).map(s => <option key={s} value={s}>{s}</option>)}</select></div><div><label htmlFor="status-filter" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('filter_by_status')}</label><select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 rounded-md bg-white dark:bg-gray-600 border-transparent focus:ring-2 focus:ring-blue-500"><option value="All">{t('all')}</option><option>Granted</option><option>Pending</option><option>Rejected</option></select></div></div><div className="overflow-x-auto"><table className="w-full text-left"><caption className="sr-only">Table of Forest Rights Act claims</caption><thead><tr className="border-b-2 border-gray-200 dark:border-gray-700"><th scope="col" className="p-4">{t('claim_id')}</th><th scope="col" className="p-4">{t('holder')}</th><th scope="col" className="p-4">{t('village_district')}</th><th scope="col" className="p-4">{t('state')}</th><th scope="col" className="p-4">{t('status')}</th><th scope="col" className="p-4">{t('actions')}</th></tr></thead><tbody>{filteredRecords.map(record => (<tr key={record.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"><td className="p-4 font-mono">{record.id}</td><td className="p-4">{record.holder}</td><td className="p-4">{record.village}</td><td className="p-4">{record.state}</td><td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20 ${getStatusClass(record.status)}`}>{record.status}</span></td><td className="p-4"><button onClick={(e) => handleGenerateSummary(record, e)} className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-md text-sm font-semibold hover:bg-blue-200 dark:hover:bg-blue-900 transition-all transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">✨<span className="sr-only">{t('gen_summary')} {record.id}</span><span aria-hidden="true"> {t('gen_summary')}</span></button></td></tr>))}</tbody></table>{filteredRecords.length === 0 && <p className="text-center py-8 text-gray-500">{t('no_records_match')}</p>}</div></div></div>);};
const AssetMappingContent = () => { /* ... existing code ... */ const {t} = useTranslations(); return (<div className="p-6 animate-fade-in"><div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"><h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('asset_mapping_title')}</h3><p className="text-gray-600 dark:text-gray-300">Visualize capital and social assets for FRA-holding villages identified from high-resolution satellite imagery.</p><div className="mt-4 h-[60vh] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"><p className="text-gray-500 dark:text-gray-400">[Asset Map Viewer Placeholder]</p></div></div></div>) };
const DecisionSupportContent = () => { /* ... existing code ... */ const { t } = useTranslations(); const [recommendation, setRecommendation] = useState(null); const [report, setReport] = useState(''); const [isGeneratingReport, setIsGeneratingReport] = useState(false); const sampleRecommendations = [ { village: "Salapura, Dindori (Madhya Pradesh)", issue: "Low Water Index & Limited Agricultural Land", schemes: ["jjm", "mgnrega", "pmkisan"] }, { village: "Kalimela, Malkangiri (Odisha)", issue: "High soil erosion & low crop yield", schemes: ["pmksy", "nfsm"] }, { village: "Korbong, Dhalai (Tripura)", issue: "Lack of access to markets for non-timber products", schemes: ["vandhan", "pmgsy"] }, { village: "Jainoor, Adilabad (Telangana)", issue: "Poor educational infrastructure", schemes: ["ssa", "emrs"] } ]; const findRecommendations = () => { setRecommendation(sampleRecommendations[Math.floor(Math.random() * sampleRecommendations.length)]); setReport(''); }; const handleGenerateReport = async () => { if (!recommendation) return; setIsGeneratingReport(true); setReport(''); await new Promise(resolve => setTimeout(resolve, 3000)); const mockApiResponse = `### Intervention Strategy Report: ${recommendation.village}\n\n**1. Executive Summary**\nThis report outlines a targeted intervention strategy for ${recommendation.village}, addressing the critical challenges of **${recommendation.issue}**. By strategically layering schemes like **${recommendation.schemes.map(s => t(s)).join(', ')}**, we can significantly improve livelihood security and resource availability for the local forest-dwelling communities.`; setReport(mockApiResponse); setIsGeneratingReport(false); }; return ( <div className="p-6 animate-fade-in"> <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"> <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('dss_engine_title')}</h3> <p className="text-gray-600 dark:text-gray-300 mb-6">{t('dss_engine_desc')}</p> <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl"> <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"> <div><label htmlFor="asset-type-select" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Asset Type</label><select id="asset-type-select" className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-600 border-transparent focus:ring-2 focus:ring-blue-500"><option>Low Water Index</option><option>No Agricultural Land</option><option>Limited Forest Cover</option></select></div> <div><label htmlFor="scheme-select" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Target Scheme</label><select id="scheme-select" className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-600 border-transparent focus:ring-2 focus:ring-blue-500"><option>All</option><option>PM-KISAN</option><option>Jal Jeevan Mission</option><option>MGNREGA</option></select></div> <button onClick={findRecommendations} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 w-full md:w-auto shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">{t('find_recommendations')}</button> </div> </div> <div aria-live="polite"> {recommendation && ( <div className="mt-6 animate-fade-in-slow"> <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('results')}</h4> <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"> <p><strong>{t('village')}:</strong> {recommendation.village}</p> <p><strong>{t('issue')}:</strong> {recommendation.issue}</p> <div className="mt-4"> <h5 className="font-semibold mb-2">{t('recommended_schemes')}</h5> <div className="border dark:border-gray-700 rounded-lg overflow-hidden"> {recommendation.schemes.map(schemeKey => ( <AccordionItem key={schemeKey} title={t(schemeKey)}> <p>{t(`${schemeKey}_desc`)}</p> </AccordionItem> ))} </div> </div> <div className="mt-4"> <button onClick={handleGenerateReport} disabled={isGeneratingReport} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"> {isGeneratingReport ? <><LoaderIcon className="w-5 h-5 mr-2"/> {t('generating_report')}</> : `✨ ${t('gen_strategy_report')}`} </button> </div> </div> </div> )} {isGeneratingReport && <p className="sr-only">Generating strategy report. Please wait.</p>} {report && (<div className="mt-6 animate-fade-in-slow"><h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('ai_strategy')}</h4><div className="p-4 border dark:border-gray-700 rounded-lg prose dark:prose-invert max-w-none whitespace-pre-wrap">{report}</div></div>)} </div> </div> </div> );};
const CommunityEngagementContent = () => { /* ... existing code ... */ const {t} = useTranslations(); const grievances = [{ id: 'GRV-451', village: 'Salapura, Dindori (MP)', issue: 'Incorrect land parcel mapping', status: 'In Progress', progress: 60 }, { id: 'GRV-452', village: 'Korbong, Dhalai (TR)', issue: 'Delay in patta issuance', status: 'Resolved', progress: 100 }, { id: 'GRV-453', village: 'Jharigaon, Koraput (OD)', issue: 'Dispute over CFR boundary', status: 'New', progress: 10 }, { id: 'GRV-454', village: 'Jainoor, Adilabad (TS)', issue: 'Lack of drinking water facility', status: 'In Progress', progress: 40 }]; const meetings = [{ id: 1, village: 'Aswaraopeta, Khammam (TS)', date: '2025-09-15', topic: 'Verification of new IFR claims' }, { id: 2, village: 'Bajag, Dindori (MP)', date: '2025-09-12', topic: 'Community Forest Resource management plan' }, { id: 3, village: 'Amarpur, Gomati (TR)', date: '2025-09-10', topic: 'Awareness drive for FRA provisions' }]; return (<div className="p-6 animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"><h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('grievance_tracker')}</h3><div className="space-y-4">{grievances.map(g => (<div key={g.id} className="p-4 border dark:border-gray-700 rounded-lg"><div className="flex justify-between items-center mb-2"><p className="font-semibold">{g.issue}</p><span className={`px-2 py-1 text-xs font-semibold rounded-full ${g.status === 'Resolved' ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300' : g.status === 'New' ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{g.status}</span></div><p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{g.village} ({g.id})</p><div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700" role="progressbar" aria-valuenow={g.progress} aria-valuemin="0" aria-valuemax="100"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${g.progress}%` }}></div></div></div>))}</div></div><div className="space-y-6"><div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"><h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('recent_meetings')}</h3><ul className="space-y-3">{meetings.map(m => <li key={m.id} className="text-sm"><p className="font-semibold">{m.village}</p><p className="text-gray-600 dark:text-gray-300">{m.topic} - <span className="text-gray-500 dark:text-gray-400">{m.date}</span></p></li>)}</ul></div><div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"><h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('community_feedback')}</h3><p className="text-gray-500 dark:text-gray-400">[Chart/Summary Placeholder]</p></div></div></div>);};
const SettingsContent = () => { const {t} = useTranslations(); return (<div className="p-6 animate-fade-in"><div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"><h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('settings_title')}</h3><p className="text-gray-600 dark:text-gray-300">Configure API keys, user roles, and notification preferences.</p></div></div>) };

// --- MAIN APP COMPONENT ---
const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    return (<LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>);
};

export default function App() {
    return (<LanguageProvider><AppComponent /></LanguageProvider>);
}

function AppComponent() {
    const { t } = useTranslations();
    const [currentPage, setCurrentPage] = useState('overview');
    
    // This line now reads the theme from the browser's memory
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const pageTitles = { overview: t('overview_title'), fra_atlas: t('fra_atlas_title'), data_management: t('data_management_title'), asset_mapping: t('asset_mapping_title'), dss: t('dss_title'), community: t('community_title'), settings: t('settings_title') };
    
    useEffect(() => { 
        document.title = `${pageTitles[currentPage]} - ${t('app_title')}`; 
    }, [currentPage, t, pageTitles]);
    
    // This block now also saves the theme to the browser's memory
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const renderContent = () => {
        switch (currentPage) {
            case 'overview': return <OverviewContent />;
            case 'fra_atlas': return <FRAAtlasContent />;
            case 'data_management': return <DataManagementContent />;
            case 'asset_mapping': return <AssetMappingContent />;
            case 'dss': return <DecisionSupportContent />;
            case 'community': return <CommunityEngagementContent />;
            case 'settings': return <SettingsContent />;
            default: return <OverviewContent />;
        }
    };

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300`}>
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header currentPage={currentPage} onMenuClick={() => setSidebarOpen(true)} theme={theme} toggleTheme={toggleTheme} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dots-pattern">
                    <h1 className="sr-only">{pageTitles[currentPage]}</h1>
                    <div aria-live="polite" className="sr-only">Navigated to {pageTitles[currentPage]} page.</div>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

