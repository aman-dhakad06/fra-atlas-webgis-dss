import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import TargetedStatesDisplay from './components/TargetedStatesDisplay.jsx';
import IndiaMap from './components/IndiaMap.jsx';
import FRAAtlas from './components/FRAAtlas.jsx';
import { ThemeProvider, useTheme } from './components/ThemeProvider.jsx';
import DocumentDigitizer from './components/DocumentDigitizer.jsx';
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
        
        // Document Digitization
        digitize_documents: 'Digitize Documents',
        document_digitization: 'Document Digitization',
        ai_powered: 'AI-Powered',
        digital_records: 'Digital Records',
        upload_fra_documents: 'Upload FRA Claim Documents',
        drop_documents_here: 'Drop your scanned FRA claim forms here, or click to browse',
        supports_formats: 'Supports: JPG, PNG, PDF (Max 10MB each)',
        ai_ocr_capabilities: 'AI OCR Capabilities',
        reads_handwritten: '• Reads handwritten and printed text',
        extracts_claim_details: '• Extracts claim details (Village, Holder, Area, Status)',
        identifies_form_fields: '• Identifies form fields automatically',
        validates_data: '• Validates extracted data',
        supports_languages: '• Supports multiple Indian languages',
        ai_reading_documents: 'AI is Reading Your Documents',
        processing_documents: 'Processing {count} document(s) with advanced OCR...',
        review_extracted_data: 'Review Extracted Data',
        extracted_information: 'Extracted Information',
        confident: 'confident',
        document_preview: 'Document Preview',
        raw_extracted_text: 'Raw Extracted Text',
        quality_metrics: 'Quality Metrics',
        ocr_confidence: 'OCR Confidence:',
        document_quality: 'Document Quality:',
        processing_time: 'Processing Time:',
        save_to_database: 'Save to Database',
        document_successfully_digitized: 'Document Successfully Digitized!',
        claim_processed_saved: 'Your FRA claim document has been processed and saved to the database.',
        summary: 'Summary:',
        new: 'NEW',
        today: 'today',
        cancel: 'Cancel',
        edit: 'Edit',
        save: 'Save',
        upload_new: 'Upload New',
        claim_id: 'Claim ID',
        claim_type: 'Claim Type',
        patta_holder: 'Patta Holder',
        area_acres: 'Area (Acres)',
        survey_number: 'Survey Number',
        application_date: 'Application Date',
        gram_sabha_resolution: 'Gram Sabha Resolution',
        forest_division: 'Forest Division',
        land_type: 'Land Type',
        not_extracted: 'Not extracted',
        
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
const districtData = { 
    'Madhya Pradesh': [
        'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 
        'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 
        'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 
        'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 
        'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 
        'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Rajgarh', 
        'Raisen', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 
        'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 
        'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
    ], 
    'Tripura': [
        'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 
        'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'
    ], 
    'Odisha': [
        'Angul', 'Balasore', 'Bargarh', 'Bhadrak', 'Bolangir', 'Boudh',
        'Cuttack', 'Debagarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 
        'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal',
        'Kendrapara', 'Keonjhar', 'Khordha', 'Koraput', 'Malkangiri',
        'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri',
        'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
    ], 
    'Telangana': [
        'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad',
        'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal',
        'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad',
        'Mahabubnagar', 'Mahbubnagar', 'Mancherial', 'Medak', 
        'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
        'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 
        'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Suryapet',
        'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban',
        'Yadadri Bhuvanagiri'
    ] 
};
const stateLanguageMap = { 'Tripura': {code: 'bn', name: 'Bengali'}, 'Odisha': {code: 'or', name: 'Odia'}, 'Telangana': {code: 'te', name: 'Telugu'}};
// Sample data will be replaced with API calls
const allRecordsData = [];

// Mock API service - will be replaced with actual backend integration
const api = {
    getDashboardStats: () => new Promise(resolve => {
        setTimeout(() => {
            resolve({
                digitizedRecords: 0, digitizedRecordsChange: "+0",
                villagesMapped: 0, villagesMappedChange: "+0",
                assetsIdentified: 0, assetsIdentifiedChange: "+0",
                grievancesLogged: 0, grievancesLoggedChange: "+0"
            });
        }, 1500);
    }),
    getFraRecords: () => new Promise(resolve => {
        setTimeout(() => resolve([]), 1000);
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
const Modal = ({ title, content, onClose, isLoading, triggerRef }) => {
    const { t } = useTranslations();
    const theme = useTheme();
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        modalRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (triggerRef.current) triggerRef.current.focus();
        };
    }, [onClose, triggerRef]);
    
    return (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div ref={modalRef} className={`${theme.isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-scale-in`}>
                <div className={`flex justify-between items-center p-4 border-b ${theme.isDark ? 'border-white/10' : 'border-black/10'}`}>
                    <h3 id="modal-title" className={`text-xl font-bold ${theme.text}`}>{title}</h3>
                    <button 
                        ref={closeButtonRef} 
                        onClick={onClose} 
                        className={`p-2 rounded-full ${theme.textMuted} ${theme.isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'} focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`} 
                        aria-label="Close dialog"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center py-8">
                            <LoaderIcon className={`w-8 h-8 ${theme.textMuted} mb-4`} />
                            <p className={theme.textMuted}>{t('generating')}</p>
                        </div>
                    ) : (
                        <div 
                            className={`prose prose-sm max-w-none ${theme.isDark ? 'prose-invert' : ''} ${theme.text}`}
                            dangerouslySetInnerHTML={{ __html: content?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ isOpen, setIsOpen, currentPage, setCurrentPage }) => {
    const { t } = useTranslations();
    const theme = useTheme();
    const navItems = [
        { id: 'overview', label: t('overview'), icon: HomeIcon },
        { id: 'fra_atlas', label: t('fra_atlas'), icon: MapIcon },
        { id: 'data_management', label: t('data_management'), icon: DatabaseIcon },
        { id: 'asset_mapping', label: t('asset_mapping'), icon: LayersIcon },
        { id: 'dss', label: t('dss'), icon: BrainCircuitIcon },
        { id: 'community', label: t('community'), icon: UsersIcon },
        { id: 'settings', label: t('settings'), icon: SettingsIcon }
    ];
    
    const NavLink = ({ item }) => (
        <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); setIsOpen(false); }} 
            className={`group flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${currentPage === item.id ? `${theme.isDark ? 'bg-blue-900/50' : 'bg-blue-100'} ${theme.isDark ? 'text-blue-300' : 'text-blue-700'} shadow-md` : `${theme.textMuted} ${theme.hoverCard}`}`}
            role="button" 
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { setCurrentPage(item.id); setIsOpen(false); } }}
            aria-label={`Navigate to ${item.label}`}
        >
            <item.icon className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:rotate-6" />
            <span className="font-medium">{item.label}</span>
        </a>
    );
    
    return (
        <>
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                 onClick={() => setIsOpen(false)} aria-hidden={!isOpen}></div>
            <aside aria-label="Main Navigation" 
                   className={`fixed top-0 left-0 h-full w-72 ${theme.cardBg} backdrop-blur-xl ${theme.border} border-r p-4 transform transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center mb-10 px-2">
                    <MapIcon className="w-10 h-10 text-blue-500" />
                    <h1 className={`text-xl font-bold ml-3 ${theme.text}`}>{t('app_title')}</h1>
                </div>
                <nav>
                    <ul className="flex flex-col space-y-3">
                        {navItems.map(item => <li key={item.id}><NavLink item={item} /></li>)}
                    </ul>
                </nav>
            </aside>
        </>
    ); 
};

const Header = ({ currentPage, onMenuClick, theme, toggleTheme }) => {
    const { t, language, setLanguage } = useTranslations();
    const themeColors = useTheme();
    
    const pageTitles = {
        overview: t('overview_title'),
        fra_atlas: t('fra_atlas_title'),
        data_management: t('data_management_title'),
        asset_mapping: t('asset_mapping_title'),
        dss: t('dss_title'),
        community: t('community_title'),
        settings: t('settings_title')
    };
    
    const langNames = {
        en: 'English',
        hi: 'हिंदी',
        bn: 'বাংলা',
        or: 'ଓଡିଆ',
        te: 'తెలుగు'
    };
    
    return (
        <header className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg shadow-md sticky top-0 z-20 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center">
                <button 
                    onClick={onMenuClick} 
                    className={`md:hidden ${themeColors.textMuted} mr-4 p-2 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`} 
                    aria-label="Open navigation menu"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h2 className={`text-xl md:text-2xl font-bold ${themeColors.text}`} tabIndex={-1}>
                    {pageTitles[currentPage]}
                </h2>
            </div>
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <label htmlFor="lang-select" className="sr-only">{t('language')}</label>
                    <select 
                        id="lang-select" 
                        value={language} 
                        onChange={e => setLanguage(e.target.value)} 
                        className={`p-2.5 rounded-full ${themeColors.hover} ${themeColors.textMuted} transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 bg-transparent appearance-none cursor-pointer pr-8`}
                    >
                        {Object.keys(langNames).map(code => 
                            <option key={code} value={code} className={`${themeColors.text} ${themeColors.inputBg}`}>
                                {langNames[code]}
                            </option>
                        )}
                    </select>
                </div>
                <button 
                    onClick={toggleTheme} 
                    className={`p-2.5 rounded-full ${themeColors.hover} ${themeColors.textMuted} transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`} 
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                >
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </button>
                <img 
                    src="https://placehold.co/40x40/6366f1/ffffff?text=U" 
                    alt="User Avatar" 
                    className="w-10 h-10 rounded-full border-2 border-blue-500" 
                />
            </div>
        </header>
    );
};

const StatCard = ({ title, value, icon: Icon, change, color = 'blue' }) => {
    const { t } = useTranslations();
    const theme = useTheme();
    const animatedValue = useCountUp(value);
    return (
        <div className={`${theme.cardBg} p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-${color}-500/50`}>
            <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-br from-${color}-100 to-${color}-200 dark:from-${color}-900/70 dark:to-${color}-800/70 rounded-full`}>
                    <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <div>
                    <p className={`text-sm ${theme.textMuted} font-medium`}>{title}</p>
                    <p className={`text-3xl font-bold ${theme.text}`}>{animatedValue}</p>
                </div>
            </div>
            {change && (
                <p className={`text-sm font-semibold mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {change} {t('this_month')}
                </p>
            )}
        </div>
    );
};
const StatCardSkeleton = ({ color = 'gray' }) => {
    const theme = useTheme();
    return (
        <div className={`${theme.cardBg} p-6 rounded-2xl shadow-lg animate-pulse`}>
            <div className="flex items-center space-x-4">
                <div className={`p-3 ${theme.isDark ? `bg-${color}-700` : `bg-${color}-200`} rounded-full w-14 h-14`}></div>
                <div className="flex-1">
                    <div className={`h-4 ${theme.isDark ? `bg-${color}-700` : `bg-${color}-200`} rounded w-3/4 mb-2`}></div>
                    <div className={`h-8 ${theme.isDark ? `bg-${color}-700` : `bg-${color}-200`} rounded w-1/2`}></div>
                </div>
            </div>
            <div className={`h-4 ${theme.isDark ? `bg-${color}-700` : `bg-${color}-200`} rounded w-1/3 mt-2`}></div>
        </div>
    );
};
const TargetedStatesContainer = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleStateClick = (state) => {
    setSelectedState(state);
    setShowDetails(true);
    console.log('State clicked:', state);
  };

  return (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-800/50 rounded-2xl overflow-hidden relative">
      <TargetedStatesDisplay
        onStateClick={handleStateClick}
        selectedStates={selectedState ? [selectedState] : []}
      />

      {/* State Details Modal */}
      {showDetails && selectedState && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 m-4 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {selectedState.name}
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close state details"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                {selectedState.description || 'Key target state for FRA implementation'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">
                    {selectedState.villages?.toLocaleString() || '4,820'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Villages Mapped</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-green-600 dark:text-green-400 font-semibold">
                    {selectedState.assets?.toLocaleString() || '8,598,745'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Assets Identified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme();
    return (
        <div className={`border-b ${theme.border}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`w-full flex justify-between items-center p-4 text-left font-semibold ${theme.textSecondary} hover:bg-gray-50 dark:hover:bg-gray-700/50`}
            >
                <span className="flex-1">{title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className={`p-4 ${theme.textMuted}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
const ToggleSwitch = ({ id, label, checked, onChange }) => {
    const theme = useTheme();
    return (
        <label htmlFor={id} className="flex items-center justify-between cursor-pointer">
            <span className={`${theme.textSecondary}`}>{label}</span>
            <div className="relative">
                <input 
                    type="checkbox" 
                    id={id} 
                    checked={checked} 
                    onChange={onChange} 
                    className="sr-only peer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                />
                <div className={`w-11 h-6 ${theme.isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </div>
        </label>
    );
};

// --- PAGE CONTENT COMPONENTS ---
const OverviewContent = () => {
    const { t } = useTranslations();
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const data = await api.getDashboardStats();
            setStats(data);
            setIsLoading(false);
        };
        fetchStats();
    }, []);
    
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCardSkeleton color="blue" />
                    <StatCardSkeleton color="green" />
                    <StatCardSkeleton color="yellow" />
                    <StatCardSkeleton color="red" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('digitized_records')} value={stats.digitizedRecords} icon={DatabaseIcon} change={stats.digitizedRecordsChange} color="blue" />
                <StatCard title={t('villages_mapped')} value={stats.villagesMapped} icon={MapIcon} change={stats.villagesMappedChange} color="green"/>
                <StatCard title={t('assets_identified')} value={stats.assetsIdentified} icon={LayersIcon} change={stats.assetsIdentifiedChange} color="yellow"/>
                <StatCard title={t('grievances_logged')} value={stats.grievancesLogged} icon={UsersIcon} change={stats.grievancesLoggedChange} color="red"/>
            </div>
            <div className={`mt-8 ${theme.cardBg} p-6 rounded-2xl shadow-xl`}>
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>{t('overview_title')}</h3>
                <TargetedStatesContainer />
            </div>
        </div>
    );
};

const TimelineSlider = ({ startDate, endDate, onDateChange }) => {
    const { t } = useTranslations();
    const theme = useTheme();
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
        <div className={`absolute bottom-0 left-0 right-0 ${theme.isDark ? 'bg-gray-900/70' : 'bg-white/70'} backdrop-blur-md p-4 border-t ${theme.border} animate-slide-up`}>
            <h5 className={`text-center font-semibold mb-2 ${theme.text}`}>{t('timeline_control')}</h5>
            <div className="flex items-center justify-around">
                <div className="flex flex-col items-center">
                    <label htmlFor="start-date" className={`text-sm font-medium ${theme.textMuted}`}>{t('start_date')}</label>
                    <input 
                        type="month" 
                        id="start-date" 
                        value={start} 
                        onChange={handleStartChange} 
                        className={`p-1 rounded ${theme.inputBg} ${theme.text}`}
                    />
                </div>
                <div className={`text-2xl font-thin mx-4 ${theme.text}`}>-</div>
                 <div className="flex flex-col items-center">
                    <label htmlFor="end-date" className={`text-sm font-medium ${theme.textMuted}`}>{t('end_date')}</label>
                    <input 
                        type="month" 
                        id="end-date" 
                        value={end} 
                        onChange={handleEndChange} 
                        className={`p-1 rounded ${theme.inputBg} ${theme.text}`}
                    />
                </div>
            </div>
        </div>
    );
}

const FRAAtlasContent = () => { 
    const { t, setLanguage } = useTranslations();
    const theme = useTheme();
    const [selectedState, setSelectedState] = useState('Madhya Pradesh');
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [showChangeDetection, setShowChangeDetection] = useState(false);
    const [timelineDates, setTimelineDates] = useState({ start: '2020-01', end: '2025-01' });
    const [mapLayers, setMapLayers] = useState({
        villageBoundaries: false,
        ifrClaims: true,
        cfrClaims: true,
        landUse: false,
        waterBodies: false,
        fieldReports: false,
        potentialClaims: false,
        changeDetection: false
    });
    const [focusedState, setFocusedState] = useState(null);
    const [selectedStatesForMap, setSelectedStatesForMap] = useState([]);

    const districts = districtData[selectedState] || [];
    const localLang = stateLanguageMap[selectedState];
    const handleDateChange = (start, end) => setTimelineDates({ start, end });
    
    // Handle state click from map
    const handleStateClick = (stateData) => {
        console.log('State clicked:', stateData);
        setFocusedState(stateData);
        setSelectedState(stateData.name);
        setSelectedStatesForMap([stateData]);
    };
    
    // Handle layer toggle
    const handleLayerToggle = (layerName, checked) => {
        setMapLayers(prev => ({
            ...prev,
            [layerName]: checked
        }));
    };
    
    // Handle change detection toggle
    const handleChangeDetectionToggle = () => {
        const newState = !showChangeDetection;
        setShowChangeDetection(newState);
        setMapLayers(prev => ({
            ...prev,
            changeDetection: newState
        }));
    };

    return ( 
        <div className="p-6 h-full flex flex-col animate-fade-in">
            <div className={`flex-grow flex ${theme.cardBg} rounded-2xl shadow-xl relative overflow-hidden`}>
                {/* Control Panel */}
                <div className={`w-1/4 max-w-sm p-4 border-r ${theme.border} overflow-y-auto`}>
                    <h3 className={`text-lg font-bold ${theme.text} mb-6`}>{t('filters_layers')}</h3>
                    
                    {/* Language Switch */}
                    {localLang && (
                        <button 
                            onClick={() => setLanguage(localLang.code)} 
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
                        >
                            {t('switch_to_lang')} {localLang.name}
                        </button>
                    )}
                    
                    {/* State Selection */}
                    <div className="mb-6">
                        <label htmlFor="state-select" className={`block text-sm font-medium ${theme.textMuted} mb-2`}>
                            {t('state')}
                        </label>
                        <select 
                            id="state-select" 
                            value={selectedState} 
                            onChange={(e) => {
                                setSelectedState(e.target.value);
                                setSelectedDistrict('All');
                                setFocusedState(null);
                            }} 
                            className={`w-full p-2.5 rounded-lg ${theme.inputBg} ${theme.text} border-transparent focus:ring-2 focus:ring-blue-500`}
                        >
                            {Object.keys(districtData).map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* District Selection */}
                    <div className="mb-6">
                        <label htmlFor="district-select" className={`block text-sm font-medium ${theme.textMuted} mb-2`}>
                            {t('village_district').split(',')[1]?.trim() || 'District'}
                        </label>
                        <select 
                            id="district-select" 
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className={`w-full p-2.5 rounded-lg ${theme.inputBg} ${theme.text} border-transparent focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="All">{t('all') || 'All'}</option>
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>

                    {/* Map Layers */}
                    <div className="mb-6">
                        <h4 className={`font-semibold ${theme.textSecondary} mb-3`}>{t('map_layers')}</h4>
                        <div className="space-y-3">
                            <ToggleSwitch 
                                id="layer-village" 
                                label={t('village_boundaries')} 
                                checked={mapLayers.villageBoundaries}
                                onChange={(e) => handleLayerToggle('villageBoundaries', e.target.checked)}
                            />
                            <ToggleSwitch 
                                id="layer-ifr" 
                                label={t('ifr_claims')} 
                                checked={mapLayers.ifrClaims}
                                onChange={(e) => handleLayerToggle('ifrClaims', e.target.checked)}
                            />
                            <ToggleSwitch 
                                id="layer-cfr" 
                                label={t('cfr_claims')} 
                                checked={mapLayers.cfrClaims}
                                onChange={(e) => handleLayerToggle('cfrClaims', e.target.checked)}
                            />
                            <ToggleSwitch 
                                id="layer-landuse" 
                                label={t('land_use')} 
                                checked={mapLayers.landUse}
                                onChange={(e) => handleLayerToggle('landUse', e.target.checked)}
                            />
                            <ToggleSwitch 
                                id="layer-water" 
                                label={t('water_bodies')} 
                                checked={mapLayers.waterBodies}
                                onChange={(e) => handleLayerToggle('waterBodies', e.target.checked)}
                            />
                            <ToggleSwitch 
                                id="layer-field-reports" 
                                label={t('field_reports')} 
                                checked={mapLayers.fieldReports}
                                onChange={(e) => handleLayerToggle('fieldReports', e.target.checked)}
                            />
                        </div>
                    </div>

                    {/* Advanced AI Layers */}
                    <div className={`pt-4 border-t ${theme.border}`}>
                         <h4 className={`font-semibold ${theme.textSecondary} mb-3`}>{t('advanced_ai_layers')}</h4>
                         <div className="space-y-3">
                             <ToggleSwitch 
                                 id="layer-potential-claims" 
                                 label={t('potential_claims')} 
                                 checked={mapLayers.potentialClaims}
                                 onChange={(e) => handleLayerToggle('potentialClaims', e.target.checked)}
                             />
                             <ToggleSwitch 
                                 id="layer-change-detection" 
                                 label={t('change_detection')} 
                                 checked={showChangeDetection} 
                                 onChange={handleChangeDetectionToggle}
                             />
                         </div>
                    </div>
                    
                    {/* Focused State Info */}
                    {focusedState && (
                        <div className={`mt-6 p-4 ${theme.isDark ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg border ${theme.isDark ? 'border-blue-800' : 'border-blue-200'}`}>
                            <h5 className={`font-semibold ${theme.text} mb-2`}>Selected State</h5>
                            <div className="text-sm">
                                <p className={`${theme.text} font-medium`}>{focusedState.name}</p>
                                <p className={`${theme.textMuted} text-xs`}>{focusedState.description}</p>
                                {focusedState.villages && (
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className={`${theme.textMuted}`}>Villages: </span>
                                            <span className={`${theme.text} font-medium`}>{focusedState.villages?.toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className={`${theme.textMuted}`}>Claims: </span>
                                            <span className={`${theme.text} font-medium`}>{focusedState.claims?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Map Container */}
                <div role="application" aria-label="Enhanced India map with FRA data" className={`flex-1 ${theme.isDark ? 'bg-gray-900/50' : 'bg-gray-200/50'} rounded-r-2xl relative`}>
                    {selectedState === 'Tripura' || selectedState === 'Madhya Pradesh' || selectedState === 'Odisha' || selectedState === 'Telangana' ? (
                        <FRAAtlas
                            selectedState={selectedState}
                            selectedDistrict={selectedDistrict}
                            mapLayers={mapLayers}
                            onClaimClick={(claim) => {
                                console.log('Claim clicked:', claim);
                                // Handle claim click - could open detailed view
                            }}
                            theme={theme}
                        />
                    ) : (
                        <IndiaMap
                            onStateClick={handleStateClick}
                            selectedStates={selectedStatesForMap}
                            focusState={focusedState}
                            mapLayers={mapLayers}
                            selectedStateFilter={selectedState}
                            selectedDistrictFilter={selectedDistrict}
                            theme={theme}
                            timelineData={timelineDates}
                        />
                    )}
                    
                    {/* Timeline Control for Change Detection */}
                    {showChangeDetection && (
                        <TimelineSlider 
                            startDate={timelineDates.start} 
                            endDate={timelineDates.end} 
                            onDateChange={handleDateChange} 
                        />
                    )}
                </div>
            </div>
            
            {/* Status Bar */}
            <div className={`mt-4 p-3 ${theme.cardBg} rounded-lg ${theme.shadow} text-sm`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className={`${theme.textMuted}`}>Active Layers:</span>
                        {Object.entries(mapLayers).filter(([_, active]) => active).map(([layer, _]) => (
                            <span key={layer} className={`px-2 py-1 ${theme.isDark ? 'bg-blue-900/30' : 'bg-blue-100'} ${theme.isDark ? 'text-blue-300' : 'text-blue-700'} rounded text-xs`}>
                                {layer.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                        ))}
                    </div>
                    <div className={`${theme.textMuted}`}>
                        Selected: {selectedState} {selectedDistrict !== 'All' ? `/ ${selectedDistrict}` : ''}
                    </div>
                </div>
            </div>
        </div> 
    );
};

const DataManagementContent = () => {
    const { t } = useTranslations();
    const theme = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const summaryTriggerRef = useRef(null);
    const [stateFilter, setStateFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [allRecords, setAllRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('records'); // 'records' or 'digitize'
    const [digitizedCount, setDigitizedCount] = useState(0);
    
    useEffect(() => {
        api.getFraRecords().then(data => setAllRecords(data));
    }, []);
    
    const filteredRecords = allRecords.filter(record => 
        (stateFilter === 'All' || record.state === stateFilter) && 
        (statusFilter === 'All' || record.status === statusFilter)
    );
    
    const handleGenerateSummary = async (record, event) => {
        try {
            console.log('Starting summary generation for record:', record);
            summaryTriggerRef.current = event.target;
            setSelectedRecord(record);
            setIsModalOpen(true);
            setIsSummarizing(true);
            setSummary(''); // Clear previous summary
            
            console.log('Modal state set, starting AI processing...');
            
            // Simulate AI processing with more realistic delay
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            console.log('AI processing complete, generating summary...');
            
            // Generate more detailed summary based on record data
            const mockApiResponse = `**AI Summary for Claim ID: ${record.id}**\n\n` +
                `**Claim Type:** ${record.type || 'Individual Forest Rights'}\n` +
                `**Patta Holder:** ${record.holder}\n` +
                `**Location:** ${record.village}, ${record.state}\n` +
                `**Current Status:** ${record.status}\n\n` +
                `**Analysis:** This ${record.type === 'CFR' ? 'Community Forest Rights' : 'Individual Forest Rights'} claim ` +
                `for **${record.holder}** is currently **${record.status.toLowerCase()}**. The claim covers land in ` +
                `**${record.village}** located in **${record.state}**. ` +
                `${record.status === 'Granted' ? 'The rights have been successfully granted and the patta holder can proceed with sustainable forest use.' : 
                  record.status === 'Pending' ? 'The claim is under review by the relevant authorities and requires further documentation or verification.' :
                  record.status === 'Rejected' ? 'The claim has been rejected. The applicant may appeal or resubmit with additional evidence.' :
                  'The claim is currently being processed and evaluated.'}`;
            
            console.log('Setting summary:', mockApiResponse);
            setSummary(mockApiResponse);
            setIsSummarizing(false);
            console.log('Summary generation complete');
        } catch (error) {
            console.error('Error generating summary:', error);
            setSummary('Error generating summary. Please try again.');
            setIsSummarizing(false);
        }
    };
    
    const handleDigitizedData = (data) => {
        // Add the digitized data to records
        const newRecord = {
            id: data.claimId,
            holder: data.pattalHolder,
            village: `${data.village}, ${data.district}`,
            state: data.state,
            type: data.claimType,
            status: data.status,
            isNewlyDigitized: true
        };
        
        setAllRecords(prev => [newRecord, ...prev]);
        setDigitizedCount(prev => prev + 1);
        
        // Show success notification
        setTimeout(() => {
            setActiveTab('records');
        }, 1000);
    };
    
    const getStatusClass = (status) => ({
        'Granted': 'bg-green-500 text-green-700 dark:text-green-300',
        'Pending': 'bg-yellow-500 text-yellow-700 dark:text-yellow-300',
        'Rejected': 'bg-red-500 text-red-700 dark:text-red-300',
        'Approved': 'bg-green-500 text-green-700 dark:text-green-300',
        'Under Review': 'bg-blue-500 text-blue-700 dark:text-blue-300'
    }[status] || `bg-gray-500 ${theme.textMuted}`);
    
    return (
        <div className="p-6 animate-fade-in">
            {console.log('Modal state:', { isModalOpen, selectedRecord: selectedRecord?.id, summary: summary?.substring(0, 50), isSummarizing })}
            {isModalOpen && selectedRecord && (
                <Modal 
                    title={`${t('ai_summary_for')} ${selectedRecord?.id || 'Unknown'}`} 
                    content={summary} 
                    onClose={() => {
                        console.log('Closing modal');
                        setIsModalOpen(false);
                        setSelectedRecord(null);
                        setSummary('');
                        setIsSummarizing(false);
                    }} 
                    isLoading={isSummarizing} 
                    triggerRef={summaryTriggerRef} 
                />
            )}
            
            {/* Tab Navigation */}
            <div className={`${theme.cardBg} rounded-2xl shadow-xl overflow-hidden`}>
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8 px-6" aria-label="Data Management Tabs">
                        <button
                            onClick={() => setActiveTab('records')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'records'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : `border-transparent ${theme.textMuted} hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600`
                            }`}
                        >
                            📊 Digital Records
                            {digitizedCount > 0 && (
                                <span className="ml-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    +{digitizedCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('digitize')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'digitize'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : `border-transparent ${theme.textMuted} hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600`
                            }`}
                        >
                            📝 Document Digitization
                            <span className="ml-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                AI-Powered
                            </span>
                        </button>
                    </nav>
                </div>
                
                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'records' ? (
                        /* Digital Records Tab */
                        <div>
                            <div className="sm:flex justify-between items-center mb-4">
                                <h3 className={`text-xl font-bold ${theme.text} mb-4 sm:mb-0`}>
                                    {t('digitized_records')}
                                    {digitizedCount > 0 && (
                                        <span className="ml-2 text-green-600 dark:text-green-400 text-base font-normal">
                                            (+{digitizedCount} today)
                                        </span>
                                    )}
                                </h3>
                                <button 
                                    onClick={() => setActiveTab('digitize')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 flex items-center gap-2"
                                >
                                    📝 Digitize Documents
                                </button>
                            </div>
                            
                            <div className={`flex flex-wrap gap-4 my-4 p-4 ${theme.isDark ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg`}>
                                <div>
                                    <label htmlFor="state-filter" className={`block text-sm font-medium ${theme.textMuted} mb-1`}>
                                        {t('filter_by_state')}
                                    </label>
                                    <select 
                                        id="state-filter" 
                                        value={stateFilter} 
                                        onChange={e => setStateFilter(e.target.value)} 
                                        className={`p-2 rounded-md ${theme.inputBg} ${theme.text} border-transparent focus:ring-2 focus:ring-blue-500`}
                                    >
                                        <option value="All">{t('all')}</option>
                                        {Object.keys(districtData).map(s => 
                                            <option key={s} value={s}>{s}</option>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="status-filter" className={`block text-sm font-medium ${theme.textMuted} mb-1`}>
                                        {t('filter_by_status')}
                                    </label>
                                    <select 
                                        id="status-filter" 
                                        value={statusFilter} 
                                        onChange={e => setStatusFilter(e.target.value)} 
                                        className={`p-2 rounded-md ${theme.inputBg} ${theme.text} border-transparent focus:ring-2 focus:ring-blue-500`}
                                    >
                                        <option value="All">{t('all')}</option>
                                        <option>Granted</option>
                                        <option>Pending</option>
                                        <option>Rejected</option>
                                        <option>Approved</option>
                                        <option>Under Review</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <caption className="sr-only">Table of Forest Rights Act claims</caption>
                                    <thead>
                                        <tr className={`border-b-2 ${theme.border}`}>
                                            <th scope="col" className={`p-4 ${theme.text}`}>{t('claim_id')}</th>
                                            <th scope="col" className={`p-4 ${theme.text}`}>{t('holder')}</th>
                                            <th scope="col" className={`p-4 ${theme.text}`}>{t('village_district')}</th>
                                            <th scope="col" className={`p-4 ${theme.text}`}>{t('state')}</th>
                                            <th scope="col" className={`p-4 ${theme.text}`}>{t('status')}</th>
                                            <th scope="col" className={`p-4 ${theme.text}`}>{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRecords.map(record => (
                                            <tr key={record.id} className={`border-b ${theme.border} ${theme.hover} transition-colors ${
                                                record.isNewlyDigitized ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
                                            }`}>
                                                <td className={`p-4 font-mono ${theme.text}`}>
                                                    {record.id}
                                                    {record.isNewlyDigitized && (
                                                        <span className="ml-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded-full">
                                                            NEW
                                                        </span>
                                                    )}
                                                </td>
                                                <td className={`p-4 ${theme.text}`}>{record.holder}</td>
                                                <td className={`p-4 ${theme.text}`}>{record.village}</td>
                                                <td className={`p-4 ${theme.text}`}>{record.state}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20 ${getStatusClass(record.status)}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <button 
                                                        onClick={(e) => {
                                                            console.log('Button clicked for record:', record);
                                                            alert(`Generating summary for ${record.id}`);
                                                            handleGenerateSummary(record, e);
                                                        }} 
                                                        className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-md text-sm font-semibold hover:bg-blue-200 dark:hover:bg-blue-900 transition-all transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                                    >
                                                        ✨
                                                        <span className="sr-only">{t('gen_summary')} {record.id}</span>
                                                        <span aria-hidden="true"> {t('gen_summary')}</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredRecords.length === 0 && (
                                    <p className={`text-center py-8 ${theme.textMuted}`}>
                                        {t('no_records_match')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Document Digitization Tab */
                        <DocumentDigitizer onDigitizedData={handleDigitizedData} />
                    )}
                </div>
            </div>
        </div>
    );
};
const AssetMappingContent = () => {
    const { t } = useTranslations();
    const theme = useTheme();
    return (
        <div className="p-6 animate-fade-in">
            <div className={`${theme.cardBg} p-6 rounded-2xl shadow-xl`}>
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                    {t('asset_mapping_title')}
                </h3>
                <p className={`${theme.textMuted}`}>
                    Visualize capital and social assets for FRA-holding villages identified from high-resolution satellite imagery.
                </p>
                <div className={`mt-4 h-[60vh] ${theme.isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                    <p className={`${theme.textMuted}`}>[Asset Map Viewer Placeholder]</p>
                </div>
            </div>
        </div>
    );
};
const DecisionSupportContent = () => {
    const { t } = useTranslations();
    const theme = useTheme();
    const [recommendation, setRecommendation] = useState(null);
    const [report, setReport] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    
    // Sample data removed - will be replaced with API calls
    const sampleRecommendations = [];
    
    const findRecommendations = async () => {
        // TODO: Replace with actual API call
        // const response = await api.getSchemeRecommendations();
        // setRecommendation(response.data);
        setRecommendation(null);
        setReport('');
    };
    
    const handleGenerateReport = async () => {
        if (!recommendation) return;
        setIsGeneratingReport(true);
        setReport('');
        
        try {
            // TODO: Replace with actual API call for report generation
            // const response = await api.generateInterventionReport(recommendation);
            // setReport(response.data.report);
            setReport('');
        } catch (error) {
            console.error('Error generating report:', error);
            setReport('');
        } finally {
            setIsGeneratingReport(false);
        }
    };
    
    return (
        <div className="p-6 animate-fade-in">
            <div className={`${theme.cardBg} p-6 rounded-2xl shadow-xl`}>
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                    {t('dss_engine_title')}
                </h3>
                <p className={`${theme.textMuted} mb-6`}>
                    {t('dss_engine_desc')}
                </p>
                <div className={`${theme.isDark ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label htmlFor="asset-type-select" className={`block text-sm font-medium ${theme.textMuted} mb-1`}>
                                Asset Type
                            </label>
                            <select 
                                id="asset-type-select" 
                                className={`w-full p-2.5 rounded-lg ${theme.inputBg} ${theme.text} border-transparent focus:ring-2 focus:ring-blue-500`}
                            >
                                <option>Low Water Index</option>
                                <option>No Agricultural Land</option>
                                <option>Limited Forest Cover</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="scheme-select" className={`block text-sm font-medium ${theme.textMuted} mb-1`}>
                                Target Scheme
                            </label>
                            <select 
                                id="scheme-select" 
                                className={`w-full p-2.5 rounded-lg ${theme.inputBg} ${theme.text} border-transparent focus:ring-2 focus:ring-blue-500`}
                            >
                                <option>All</option>
                                <option>PM-KISAN</option>
                                <option>Jal Jeevan Mission</option>
                                <option>MGNREGA</option>
                            </select>
                        </div>
                        <button 
                            onClick={findRecommendations} 
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 w-full md:w-auto shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        >
                            {t('find_recommendations')}
                        </button>
                    </div>
                </div>
                <div aria-live="polite">
                    {recommendation && (
                        <div className="mt-6 animate-fade-in-slow">
                            <h4 className={`font-semibold ${theme.textSecondary} mb-2`}>
                                {t('results')}
                            </h4>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className={theme.text}>
                                    <strong>{t('village')}:</strong> {recommendation.village}
                                </p>
                                <p className={theme.text}>
                                    <strong>{t('issue')}:</strong> {recommendation.issue}
                                </p>
                                <div className="mt-4">
                                    <h5 className={`font-semibold mb-2 ${theme.text}`}>
                                        {t('recommended_schemes')}
                                    </h5>
                                    <div className={`border ${theme.border} rounded-lg overflow-hidden`}>
                                        {recommendation.schemes.map(schemeKey => (
                                            <AccordionItem key={schemeKey} title={t(schemeKey)}>
                                                <p>{t(`${schemeKey}_desc`)}</p>
                                            </AccordionItem>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button 
                                        onClick={handleGenerateReport} 
                                        disabled={isGeneratingReport} 
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    >
                                        {isGeneratingReport ? (
                                            <>
                                                <LoaderIcon className="w-5 h-5 mr-2"/> 
                                                {t('generating_report')}
                                            </>
                                        ) : (
                                            `✨ ${t('gen_strategy_report')}`
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isGeneratingReport && (
                        <p className="sr-only">Generating strategy report. Please wait.</p>
                    )}
                    {report && (
                        <div className="mt-6 animate-fade-in-slow">
                            <h4 className={`font-semibold ${theme.textSecondary} mb-2`}>
                                {t('ai_strategy')}
                            </h4>
                            <div className={`p-4 border ${theme.border} rounded-lg prose dark:prose-invert max-w-none whitespace-pre-wrap`}>
                                {report}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
const CommunityEngagementContent = () => {
    const { t } = useTranslations();
    const theme = useTheme();
    
    // Sample data - to be replaced with API integration
    const grievances = [
        // Grievance data will be loaded from backend API
    ];
    
    const meetings = [
        // Meeting data will be loaded from backend API
    ];
    
    return (
        <div className="p-6 animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${theme.cardBg} p-6 rounded-2xl shadow-xl`}>
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                    {t('grievance_tracker')}
                </h3>
                <div className="space-y-4">
                    {grievances.map(g => (
                        <div key={g.id} className={`p-4 border ${theme.border} rounded-lg`}>
                            <div className="flex justify-between items-center mb-2">
                                <p className={`font-semibold ${theme.text}`}>{g.issue}</p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    g.status === 'Resolved' 
                                        ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                                        : g.status === 'New' 
                                        ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
                                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                }`}>
                                    {g.status}
                                </span>
                            </div>
                            <p className={`text-sm ${theme.textMuted} mb-2`}>
                                {g.village} ({g.id})
                            </p>
                            <div 
                                className={`w-full ${theme.isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5`} 
                                role="progressbar" 
                                aria-valuenow={g.progress} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                            >
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${g.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-6">
                <div className={`${theme.cardBg} p-6 rounded-2xl shadow-xl`}>
                    <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                        {t('recent_meetings')}
                    </h3>
                    <ul className="space-y-3">
                        {meetings.map(m => (
                            <li key={m.id} className="text-sm">
                                <p className={`font-semibold ${theme.text}`}>{m.village}</p>
                                <p className={`${theme.textMuted}`}>
                                    {m.topic} - <span className={`${theme.textMuted}`}>{m.date}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`${theme.cardBg} p-6 rounded-2xl shadow-xl`}>
                    <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                        {t('community_feedback')}
                    </h3>
                    <p className={`${theme.textMuted}`}>[Chart/Summary Placeholder]</p>
                </div>
            </div>
        </div>
    );
};
const SettingsContent = () => {
    const { t } = useTranslations();
    const theme = useTheme();
    return (
        <div className="p-6 animate-fade-in">
            <div className={`${theme.cardBg} p-6 rounded-2xl shadow-xl`}>
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                    {t('settings_title')}
                </h3>
                <p className={`${theme.textMuted}`}>
                    Configure API keys, user roles, and notification preferences.
                </p>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    return (<LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>);
};

export default function App() {
    return (
        <LanguageProvider>
            <AppWithTheme />
        </LanguageProvider>
    );
}

function AppWithTheme() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            return savedTheme;
        }
        return 'light';
    });

    return (
        <ThemeProvider theme={theme}>
            <AppComponent theme={theme} setTheme={setTheme} />
        </ThemeProvider>
    );
}

function AppComponent({ theme, setTheme }) {
    const { t } = useTranslations();
    const themeContext = useTheme();
    const [currentPage, setCurrentPage] = useState('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const pageTitles = { overview: t('overview_title'), fra_atlas: t('fra_atlas_title'), data_management: t('data_management_title'), asset_mapping: t('asset_mapping_title'), dss: t('dss_title'), community: t('community_title'), settings: t('settings_title') };
    
    // Initialize theme on component mount
    useEffect(() => {
        const root = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Ensure the theme is applied immediately
        root.classList.remove('light', 'dark');
        root.classList.add(savedTheme);
        
        if (theme !== savedTheme) {
            setTheme(savedTheme);
        }
    }, []);
    
    useEffect(() => { 
        document.title = `${pageTitles[currentPage]} - ${t('app_title')}`; 
    }, [currentPage, t, pageTitles]);
    
    // Apply theme to document and save to localStorage
    useEffect(() => {
        const root = document.documentElement;
        
        // Remove both classes first
        root.classList.remove('light', 'dark');
        
        // Add the current theme class
        root.classList.add(theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        console.log('Theme applied:', theme, 'Classes:', root.classList.toString());
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            console.log('Toggling theme from', prevTheme, 'to', newTheme);
            return newTheme;
        });
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
        <div className={`flex h-screen font-sans transition-all duration-300 ${themeContext.bg} ${themeContext.text}`}>
            <Sidebar 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                isOpen={isSidebarOpen} 
                setIsOpen={setSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    currentPage={currentPage} 
                    onMenuClick={() => setSidebarOpen(true)} 
                    theme={theme} 
                    toggleTheme={toggleTheme}
                />
                <main className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${themeContext.bg}`}>
                    <h1 className="sr-only">{pageTitles[currentPage]}</h1>
                    <div aria-live="polite" className="sr-only">Navigated to {pageTitles[currentPage]} page.</div>
                    <div className={`${themeContext.text}`}>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}

