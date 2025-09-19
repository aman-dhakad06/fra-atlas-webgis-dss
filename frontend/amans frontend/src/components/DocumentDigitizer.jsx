import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from './ThemeProvider.jsx';

// --- ICONS ---
const UploadIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 3a1 1 0 0 1 .5.5v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 .5-.5h7z"/>
        <path d="M9 7h6"/>
        <path d="M9 12h3"/>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
    </svg>
);

const ScanIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
        <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
        <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
        <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
        <path d="M8 12h8"/>
        <path d="M10 16h4"/>
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

const EditIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);

const LoaderIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} animate-spin`}>
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
);

const DocumentDigitizer = ({ onDigitizedData }) => {
    const theme = useTheme();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [currentStep, setCurrentStep] = useState('upload'); // upload, processing, review, complete
    const [isEditing, setIsEditing] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Mock AI OCR service - will be replaced with actual OCR integration
    const performOCR = async (files) => {
        setIsProcessing(true);
        setCurrentStep('processing');
        
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Return empty data structure - to be replaced with actual OCR results
        const mockExtractedData = {
            claimId: '',
            claimType: '',
            village: '',
            district: '',
            state: '',
            pattalHolder: '',
            areaInAcres: '',
            surveyNumber: '',
            applicationDate: '',
            status: '',
            gramSabhaResolution: '',
            forestDivision: '',
            landType: '',
            coordinates: {
                latitude: '',
                longitude: ''
            },
            documentQuality: 'Good',
            confidence: 0,
            extractedText: 'No text extracted - integrate with OCR service'
        };
        
        setExtractedData(mockExtractedData);
        setIsProcessing(false);
        setCurrentStep('review');
        
        return mockExtractedData;
    };

    // Handle file upload
    const handleFiles = useCallback(async (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => 
            file.type.startsWith('image/') || file.type === 'application/pdf'
        );
        
        if (validFiles.length === 0) {
            alert('Please upload valid image or PDF files');
            return;
        }
        
        setUploadedFiles(validFiles);
        await performOCR(validFiles);
    }, []);

    // Drag and drop handlers
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    // Handle input change
    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    const onInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    // Handle data editing
    const handleFieldEdit = (field, value) => {
        setExtractedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Complete digitization
    const handleComplete = () => {
        setCurrentStep('complete');
        if (onDigitizedData) {
            onDigitizedData(extractedData);
        }
        
        // Reset after delay
        setTimeout(() => {
            setCurrentStep('upload');
            setUploadedFiles([]);
            setExtractedData(null);
            setIsEditing(false);
        }, 3000);
    };

    // Reset process
    const handleReset = () => {
        setCurrentStep('upload');
        setUploadedFiles([]);
        setExtractedData(null);
        setIsEditing(false);
        setIsProcessing(false);
    };

    const renderUploadArea = () => (
        <div className="space-y-6">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                    ${dragActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : `border-gray-300 dark:border-gray-600 ${theme.hover}`
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={onInputChange}
                    className="hidden"
                />
                
                <UploadIcon className={`mx-auto h-12 w-12 ${theme.textMuted} mb-4`} />
                <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
                    Upload FRA Claim Documents
                </h3>
                <p className={`${theme.textMuted} mb-4`}>
                    Drop your scanned FRA claim forms here, or click to browse
                </p>
                <p className={`text-sm ${theme.textMuted}`}>
                    Supports: JPG, PNG, PDF (Max 10MB each)
                </p>
            </div>
            
            <div className={`${theme.cardBg} p-4 rounded-lg border ${theme.border}`}>
                <h4 className={`font-semibold ${theme.text} mb-2 flex items-center`}>
                    <ScanIcon className="w-5 h-5 mr-2 text-blue-500" />
                    AI OCR Capabilities
                </h4>
                <ul className={`text-sm ${theme.textMuted} space-y-1`}>
                    <li>• Reads handwritten and printed text</li>
                    <li>• Extracts claim details (Village, Holder, Area, Status)</li>
                    <li>• Identifies form fields automatically</li>
                    <li>• Validates extracted data</li>
                    <li>• Supports multiple Indian languages</li>
                </ul>
            </div>
        </div>
    );

    const renderProcessing = () => (
        <div className="text-center space-y-6">
            <div className={`${theme.cardBg} p-8 rounded-xl border ${theme.border}`}>
                <LoaderIcon className={`mx-auto h-16 w-16 text-blue-500 mb-4`} />
                <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>
                    AI is Reading Your Documents
                </h3>
                <p className={`${theme.textMuted} mb-4`}>
                    Processing {uploadedFiles.length} document(s) with advanced OCR...
                </p>
                
                <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4`}>
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
                
                <div className="text-sm space-y-1">
                    <p className={`${theme.textMuted}`}>✓ Image preprocessing complete</p>
                    <p className={`${theme.textMuted}`}>✓ Text detection in progress</p>
                    <p className={`${theme.textMuted}`}>• Field extraction starting...</p>
                </div>
            </div>
        </div>
    );

    const renderReview = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className={`text-xl font-semibold ${theme.text}`}>
                    Review Extracted Data
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.hover} ${theme.text} flex items-center gap-2`}
                    >
                        <EditIcon className="w-4 h-4" />
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        onClick={handleReset}
                        className={`px-4 py-2 rounded-lg ${theme.textMuted} ${theme.hover}`}
                    >
                        Upload New
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Extracted Data Form */}
                <div className={`${theme.cardBg} p-6 rounded-xl border ${theme.border}`}>
                    <h4 className={`font-semibold ${theme.text} mb-4 flex items-center`}>
                        <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
                        Extracted Information
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            extractedData?.confidence >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            extractedData?.confidence >= 70 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                            {extractedData?.confidence}% confident
                        </span>
                    </h4>
                    
                    <div className="space-y-4">
                        {/* Form Fields */}
                        {[
                            { key: 'claimId', label: 'Claim ID', type: 'text' },
                            { key: 'claimType', label: 'Claim Type', type: 'select', options: ['IFR', 'CFR'] },
                            { key: 'pattalHolder', label: 'Patta Holder', type: 'text' },
                            { key: 'village', label: 'Village', type: 'text' },
                            { key: 'district', label: 'District', type: 'text' },
                            { key: 'state', label: 'State', type: 'text' },
                            { key: 'areaInAcres', label: 'Area (Acres)', type: 'number' },
                            { key: 'surveyNumber', label: 'Survey Number', type: 'text' },
                            { key: 'applicationDate', label: 'Application Date', type: 'date' },
                            { key: 'status', label: 'Status', type: 'select', options: ['Approved', 'Pending', 'Under Review', 'Rejected'] },
                            { key: 'gramSabhaResolution', label: 'Gram Sabha Resolution', type: 'text' },
                            { key: 'forestDivision', label: 'Forest Division', type: 'text' },
                            { key: 'landType', label: 'Land Type', type: 'select', options: ['Forest Land', 'Revenue Land', 'Grazing Land'] }
                        ].map(field => (
                            <div key={field.key} className="space-y-1">
                                <label className={`text-sm font-medium ${theme.textMuted}`}>
                                    {field.label}
                                </label>
                                {isEditing ? (
                                    field.type === 'select' ? (
                                        <select
                                            value={extractedData?.[field.key] || ''}
                                            onChange={(e) => handleFieldEdit(field.key, e.target.value)}
                                            className={`w-full p-2 rounded-lg ${theme.inputBg} ${theme.text} border ${theme.border}`}
                                        >
                                            {field.options?.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={extractedData?.[field.key] || ''}
                                            onChange={(e) => handleFieldEdit(field.key, e.target.value)}
                                            className={`w-full p-2 rounded-lg ${theme.inputBg} ${theme.text} border ${theme.border}`}
                                        />
                                    )
                                ) : (
                                    <div className={`p-2 rounded-lg ${theme.isDark ? 'bg-gray-700' : 'bg-gray-100'} ${theme.text}`}>
                                        {extractedData?.[field.key] || 'Not extracted'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Original Document & Raw Text */}
                <div className="space-y-4">
                    {/* Document Preview */}
                    <div className={`${theme.cardBg} p-4 rounded-xl border ${theme.border}`}>
                        <h4 className={`font-semibold ${theme.text} mb-3`}>Document Preview</h4>
                        {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className={`p-3 rounded-lg ${theme.isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
                                        <span className={`text-sm ${theme.text} truncate`}>{file.name}</span>
                                        <span className={`text-xs ${theme.textMuted}`}>
                                            {(file.size / 1024 / 1024).toFixed(1)} MB
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Raw Extracted Text */}
                    <div className={`${theme.cardBg} p-4 rounded-xl border ${theme.border}`}>
                        <h4 className={`font-semibold ${theme.text} mb-3`}>Raw Extracted Text</h4>
                        <div className={`p-3 rounded-lg ${theme.isDark ? 'bg-gray-700' : 'bg-gray-100'} text-sm font-mono ${theme.text} max-h-40 overflow-y-auto`}>
                            {extractedData?.extractedText || 'No text extracted'}
                        </div>
                    </div>

                    {/* Confidence & Quality Metrics */}
                    <div className={`${theme.cardBg} p-4 rounded-xl border ${theme.border}`}>
                        <h4 className={`font-semibold ${theme.text} mb-3`}>Quality Metrics</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className={`text-sm ${theme.textMuted}`}>OCR Confidence:</span>
                                <span className={`text-sm font-semibold ${
                                    extractedData?.confidence >= 90 ? 'text-green-500' :
                                    extractedData?.confidence >= 70 ? 'text-yellow-500' : 'text-red-500'
                                }`}>
                                    {extractedData?.confidence}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${theme.textMuted}`}>Document Quality:</span>
                                <span className={`text-sm font-semibold ${theme.text}`}>
                                    {extractedData?.documentQuality}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${theme.textMuted}`}>Processing Time:</span>
                                <span className={`text-sm font-semibold ${theme.text}`}>2.3s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    onClick={handleReset}
                    className={`px-6 py-3 rounded-lg border ${theme.border} ${theme.hover} ${theme.text}`}
                >
                    Cancel
                </button>
                <button
                    onClick={handleComplete}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
                >
                    <CheckIcon className="w-4 h-4" />
                    Save to Database
                </button>
            </div>
        </div>
    );

    const renderComplete = () => (
        <div className="text-center space-y-6">
            <div className={`${theme.cardBg} p-8 rounded-xl border ${theme.border}`}>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>
                    Document Successfully Digitized!
                </h3>
                <p className={`${theme.textMuted} mb-4`}>
                    Your FRA claim document has been processed and saved to the database.
                </p>
                
                <div className={`p-4 rounded-lg ${theme.isDark ? 'bg-blue-900/20' : 'bg-blue-50'} text-left`}>
                    <h4 className={`font-semibold ${theme.text} mb-2`}>Summary:</h4>
                    <p className={`text-sm ${theme.textMuted}`}>
                        <strong>Claim ID:</strong> {extractedData?.claimId}<br />
                        <strong>Holder:</strong> {extractedData?.pattalHolder}<br />
                        <strong>Village:</strong> {extractedData?.village}, {extractedData?.district}<br />
                        <strong>Area:</strong> {extractedData?.areaInAcres} acres<br />
                        <strong>Status:</strong> {extractedData?.status}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className={`${theme.cardBg} rounded-2xl shadow-xl border ${theme.border} overflow-hidden`}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>
                        📝 Document Digitization Hub
                    </h2>
                    <p className={`${theme.textMuted}`}>
                        AI-powered scanning and digitization of FRA claim forms
                    </p>
                    
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mt-6 space-x-8">
                        {[
                            { id: 'upload', label: 'Upload', icon: UploadIcon },
                            { id: 'processing', label: 'AI Processing', icon: ScanIcon },
                            { id: 'review', label: 'Review & Edit', icon: EditIcon },
                            { id: 'complete', label: 'Complete', icon: CheckIcon }
                        ].map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    currentStep === step.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                        : ['processing', 'review', 'complete'].includes(currentStep) && index < ['upload', 'processing', 'review', 'complete'].indexOf(currentStep)
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                    <step.icon className={`w-5 h-5 ${
                                        currentStep === step.id
                                            ? 'text-blue-500'
                                            : ['processing', 'review', 'complete'].includes(currentStep) && index < ['upload', 'processing', 'review', 'complete'].indexOf(currentStep)
                                            ? 'text-green-500'
                                            : theme.textMuted
                                    }`} />
                                </div>
                                <span className={`ml-2 text-sm font-medium ${
                                    currentStep === step.id ? theme.text : theme.textMuted
                                }`}>
                                    {step.label}
                                </span>
                                {index < 3 && (
                                    <div className={`w-8 h-0.5 mx-4 ${
                                        ['processing', 'review', 'complete'].includes(currentStep) && index < ['upload', 'processing', 'review', 'complete'].indexOf(currentStep)
                                            ? 'bg-green-500'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-6">
                    {currentStep === 'upload' && renderUploadArea()}
                    {currentStep === 'processing' && renderProcessing()}
                    {currentStep === 'review' && renderReview()}
                    {currentStep === 'complete' && renderComplete()}
                </div>
            </div>
        </div>
    );
};

export default DocumentDigitizer;