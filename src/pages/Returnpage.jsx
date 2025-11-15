import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {path.map((d, i) => <path key={i} d={d} />)}
    </svg>
);
const BoxIcon = (props) => (
  <Icon
    {...props}
    path={[
      'M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z',
      'M16 10H8',
      'M8 14h8',
    ]}
  />
);
const MapPinIcon = (props) => (
  <Icon
    {...props}
    path={[
      'M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
      'M12 2C7.03 2 3 6.03 3 11c0 5.52 9 13 9 13s9-7.48 9-13c0-4.97-4.03-9-9-9z',
    ]}
  />
);


const TruckIcon = (props) => (
  <Icon
    {...props}
    path={[
      'M5 18H3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h3c.6 0 1.1.3 1.4.8l2.5 4.5',
      'M22 12v5h-2',
      'M15 17.5a2.5 2.5 0 0 1-5 0',
      'M22 17.5a2.5 2.5 0 0 1-5 0',
      'M15 17.5H10',
      'M17 17.5v-10h-6.4l-2.7 4.9',
    ]}
  />
);
const WalletIcon = (props) => (
  <Icon
    {...props}
    path={[
      'M21 12V7H3v10h9',
      'M16 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      'M16 17v-1.5a.5.5 0 0 1 .5-.5h2',
    ]}
  />
);
const ChevronLeft = (props) => <Icon {...props} path={['m15 18-6-6 6-6']} />;
const CheckCircle = (props) => (
  <Icon {...props} path={['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M9 11l3 3L22 4']} />
);

// --- Constraint Compliant Components (Internal Definitions) ---

const MessageBox = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white font-body z-[100] transition-transform duration-300 transform translate-x-0";
    let colorClasses = "";

    switch (type) {
        case 'success':
            colorClasses = "bg-loopifyMain";
            break;
        case 'error':
            colorClasses = "bg-red-600";
            break;
        default:
            colorClasses = "bg-gray-700";
    }

    return (
        <div className={`${baseClasses} ${colorClasses}`} role="alert">
            <div className="flex justify-between items-start">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity">
                    &times;
                </button>
            </div>
        </div>
    );
};

// --- Data Constants (Retained) ---

const CATEGORIES = [
    { id: 'electronics', name: 'Electronics', icon: BoxIcon },
    { id: 'clothing', name: 'Clothing', icon: BoxIcon },
    { id: 'packaging', name: 'Packaging', icon: BoxIcon }
];

const ITEMS = {
    electronics: [
        { id: 'phone', name: 'Smartphone', img: 'https://placehold.co/150x150/2C7A4B/ffffff?text=Phone', reward: '30,000–150,000 MMK' },
        { id: 'laptop', name: 'Laptop', img: 'https://placehold.co/150x150/2C7A4B/ffffff?text=Laptop', reward: '80,000–400,000 MMK' }
    ],
    clothing: [
        { id: 'jeans', name: 'Jeans', img: 'https://placehold.co/150x150/2C7A4B/ffffff?text=Jeans', reward: '5,000–15,000 MMK' }
    ],
    packaging: [
        { id: 'cardboard', name: 'Cardboard', img: 'https://placehold.co/150x150/2C7A4B/ffffff?text=Cardboard', reward: '500 MMK/kg' }
    ]
};

const CONDITIONS = [
    { id: 'like-new', label: 'Like New' },
    { id: 'good', label: 'Good' },
    { id: 'worn', label: 'Worn' }
];

const DROPOFF_POINTS = [
    { name: 'City Mart Yangon', lat: 16.8400, lng: 96.1700 },
    { name: 'Ocean Mandalay', lat: 21.9833, lng: 96.0833 }
];

// --- Main Component ---

const ReturnPage = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: null, type: null });

    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [selected, setSelected] = useState({
        category: null,
        item: null,
        condition: null,
        method: null,
        dropoff: null,
        rewardType: 'credit'
    });

    const [shipping, setShipping] = useState({
        name: '', email: '', street: '', city: '', zip: '', country: 'MM'
    });

    const [shippingErrors, setShippingErrors] = useState({});

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const mapInitialized = useRef(false);

    // --- Computed State Logic ---

    const currentItems = ITEMS[selected.category] || [];
    const selectedItem = currentItems.find(i => i.id === selected.item) || {};

    const calculateReward = useCallback(() => {
        const itemData = ITEMS[selected.category]?.find(i => i.id === selected.item);
        const base = itemData?.reward || '0 MMK';
        if (base.includes('kg')) return base;

        const factor = { 'like-new': 1, 'good': 0.7, 'worn': 0.4 }[selected.condition] || 0;
        const numMatch = base.match(/[\d,]+/g);
        const num = parseInt(numMatch?.[0]?.replace(/,/g, '') || 0);

        return `${Math.round(num * factor).toLocaleString()} MMK`;
    }, [selected.category, selected.item, selected.condition]);

    const reward = calculateReward();
    const rewardAmount = reward.replace(' MMK', '').replace(/,/g, '');

    const selectedCondition = CONDITIONS.find(c => c.id === selected.condition) || {};

    const canProceed = useCallback((s) => {
        if (s === 1) {
            return selected.category && selected.item && selected.condition;
        }
        if (s === 2) {
            if (selected.method === 'dropoff') {
                return selected.dropoff;
            }
            if (selected.method === 'ship') {
                return shipping.name && shipping.email && shipping.street && shipping.city && shipping.zip;
            }
            return false;
        }
        return true;
    }, [selected, shipping]);

    const nextStep = () => {
        if (!canProceed(step)) return;

        if (step === 2 && selected.method === 'ship') {
            if (!validateShipping()) return;
        }

        setStep(step + 1);
    };
    
    const validateShipping = useCallback(() => {
        const errors = {};
        if (!shipping.name.trim()) errors.name = 'Full name is required';
        if (!shipping.email.trim()) errors.email = 'Email is required';
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(shipping.email.trim())) errors.email = 'Please enter a valid email address';
        if (!shipping.street.trim()) errors.street = 'Street address is required';
        if (!shipping.city.trim()) errors.city = 'City is required';
        if (!shipping.zip.trim()) errors.zip = 'ZIP code is required';
        else if (!/^\d{5}$/.test(shipping.zip.trim())) errors.zip = 'ZIP code must be 5 digits (e.g., 11181)';

        setShippingErrors(errors);
        return Object.keys(errors).length === 0;
    }, [shipping]);

    const handleShippingChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setShipping((prev) => ({ ...prev, [field]: value }));
        setShippingErrors((prev) => ({ ...prev, [field]: '' }));
    }, []);

    // Map related callbacks

    const updateSelectedMarker = useCallback((dropoff, openPopup = false) => {
        if (!mapInstanceRef.current || !dropoff) return;

        const map = mapInstanceRef.current;
        const { lat, lng, name } = dropoff;

        map.setView([lat, lng], 14);

        const popupContent = `<div class="p-4 text-center max-w-xs mx-auto">
            <div class="font-bold text-lg text-loopifyDark mb-2">${name}</div>
            <div class="inline-block px-4 py-2 bg-loopifyAccent/20 text-loopifyAccent rounded-full text-sm font-semibold">Selected ✓</div>
        </div>`;

        if (!markerRef.current) {
            markerRef.current = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'leaflet-marker-icon leaflet-zoom-hide',
                    html: `<div class="w-12 h-12 bg-gradient-to-br from-loopifyAccent to-loopifySecondary rounded-full shadow-2xl ring-4 ring-white/20 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">✓</span>
                    </div>`,
                    iconSize: [48, 48],
                    iconAnchor: [24, 48],
                    popupAnchor: [0, -36]
                })
            }).addTo(map);
        } else {
            markerRef.current.setLatLng([lat, lng]);
        }

        markerRef.current.setPopupContent(popupContent);

        if (openPopup) {
            markerRef.current.openPopup();
        }
    }, []);

    const handleDropoffSelection = useCallback((lat, lng, name) => {
        setSelected((prev) => ({ ...prev, dropoff: { name, lat, lng } }));
        updateSelectedMarker({ name, lat, lng }, true);
        mapInitialized.current = false;
    }, [updateSelectedMarker]);

    // Global click handler for dropoff buttons (event delegation)
    useEffect(() => {
        const handleSelectClick = (e) => {
            if (e.target.matches('.select-dropoff-btn')) {
                const lat = parseFloat(e.target.dataset.lat);
                const lng = parseFloat(e.target.dataset.lng);
                const name = e.target.dataset.name || '';
                if (lat && lng && name) {
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.closePopup();
                    }
                    handleDropoffSelection(lat, lng, name);
                }
            }
        };

        document.addEventListener('click', handleSelectClick);
        return () => {
            document.removeEventListener('click', handleSelectClick);
        };
    }, [handleDropoffSelection]);

    // Effect to update selected marker on back navigation or dropoff change
    useEffect(() => {
        if (step !== 2 || selected.method !== 'dropoff' || !selected.dropoff || !mapInstanceRef.current) return;

        const timer = setTimeout(() => {
            updateSelectedMarker(selected.dropoff, false);
        }, 350);

        return () => clearTimeout(timer);
    }, [step, selected.method, selected.dropoff, updateSelectedMarker]);

    const initMap = useCallback(() => {
        if (!mapRef.current) return;

        // Clean up previous map and marker
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
        if (markerRef.current) {
            markerRef.current = null;
        }

        const mapInstance = L.map(mapRef.current).setView([16.8400, 96.1700], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            subdomains: ['a', 'b', 'c'],
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        mapInstanceRef.current = mapInstance;

        // Force layout recalculation
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
                L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);
            }
        }, 300);

        // Pin icon
        const pinIcon = L.divIcon({
            className: "", // no default border
            html: `
                <div style="
                    width: 24px;
                    height: 24px;
                    background: #2C7A4B;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                "></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        // Add markers
        DROPOFF_POINTS.forEach((p) => {
            const safeName = p.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const popupContent = `<div class="p-4">
                <h3 class="font-semibold text-lg text-loopifyDark mb-4">${safeName}</h3>
                <button 
                    class="select-dropoff-btn w-full py-3 px-6 bg-gradient-to-r from-loopifyMain to-loopifySecondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    data-lat="${p.lat}" 
                    data-lng="${p.lng}" 
                    data-name="${safeName}"
                >
                    Select This Location
                </button>
            </div>`;
            const marker = L.marker([p.lat, p.lng], { icon: pinIcon }).addTo(mapInstance);
            marker.bindPopup(popupContent);
        });

        // Invalidate size immediately and after short delay
        mapInstance.invalidateSize();
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 150);
    }, []);

    // Initialize map only when dropoff method is selected and step is 2
    useEffect(() => {
        if (step === 2 && selected.method === 'dropoff' && !mapInitialized.current) {
            const timer = setTimeout(() => {
                if (typeof window.L !== 'undefined' && mapRef.current) {
                    initMap();
                    mapInitialized.current = true;
                }
            }, 350); // Wait for container to be fully rendered

            return () => clearTimeout(timer);
        }
    }, [step, selected.method, initMap]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            markerRef.current = null;
            mapInitialized.current = false;
        };
    }, []);

    // --- Handlers ---

    const onPhotoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            setPhoto(ev.target.result);
            setPhotoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const submitReturn = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            selected,
            shipping: selected.method === 'ship' ? shipping : 'N/A',
            rewardAmount,
            photo  // Base64 data (if uploaded)
        };

        try {
            console.log('Submitting Return Payload:', payload);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Generate printable HTML label
            const labelHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loopify Return Label</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
            line-height: 1.4; 
        }
        .label { 
            max-width: 280px; 
            margin: 0 auto; 
            background: #fff; 
            border-radius: 12px; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.12); 
            overflow: hidden; 
            border: 3px solid #2C7A4B; 
        }
        .header { 
            background: linear-gradient(135deg, #2C7A4B 0%, #4ba93a 100%); 
            color: white; 
            padding: 24px 20px; 
            text-align: center; 
        }
        .header h1 { margin: 0 0 4px 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 0; opacity: 0.95; font-size: 14px; }
        .section { padding: 0 20px 20px; }
        .item-section { 
            background: #f0f9f0; 
            border-left: 5px solid #2C7A4B; 
            padding: 20px; 
            margin: 0 20px 16px; 
            border-radius: 0 8px 8px 0; 
        }
        .item-section h3 { margin: 0 0 12px 0; color: #2C7A4B; font-size: 16px; font-weight: 600; }
        .item-name { font-size: 20px; font-weight: 600; color: #1a1a1a; margin: 0 0 6px 0; }
        .condition { font-size: 15px; color: #4a5568; background: white; padding: 4px 12px; border-radius: 20px; display: inline-block; font-weight: 500; }
        .reward-section { 
            background: linear-gradient(135deg, #e6fffa 0%, #c6f6d5 100%); 
            border: 3px solid #38a169; 
            text-align: center; 
            padding: 24px 20px; 
            margin: 0 20px 20px; 
            border-radius: 12px; 
        }
        .reward-amount { 
            font-size: 36px; 
            font-weight: 800; 
            color: #2C7A4B; 
            margin: 0 0 6px 0; 
            text-shadow: 0 2px 4px rgba(44,122,75,0.1); 
        }
        .reward-label { margin: 0; font-size: 15px; color: #38a169; font-weight: 600; }
        .address-section { 
            background: #fffbf0; 
            border: 2px dashed #ed8936; 
            padding: 18px; 
            border-radius: 10px; 
            margin: 0 20px 16px; 
            font-size: 14px; 
            line-height: 1.5; 
        }
        .address-title { 
            font-weight: 700; 
            color: #d97706; 
            margin: 0 0 12px 0; 
            text-align: center; 
            font-size: 15px; 
        }
        .address-lines { margin: 0; }
        .instructions { 
            background: #edf2f7; 
            padding: 18px 20px; 
            border-radius: 10px; 
            margin: 0 20px 0; 
            font-size: 13px; 
            color: #4a5568; 
            text-align: center; 
            line-height: 1.5; 
        }
        .instructions strong { color: #2d3748; }
        @media print { 
            body { padding: 5mm; background: white !important; } 
            .label { box-shadow: none !important; border-radius: 0 !important; max-width: none !important; margin: 0 !important; border: 2px solid #000 !important; }
            .header { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .reward-section { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .item-section { border-left-color: #000 !important; }
        }
    </style>
</head>
<body>
    <div class="label">
        <div class="header">
            <h1>Loopify Return Label</h1>
            <p>Official Processing Label</p>
        </div>
        <div class="section">
            <div class="item-section">
                <h3>Item Details</h3>
                <p class="item-name">${selectedItem.name}</p>
                <p class="condition">${selectedCondition.label}</p>
            </div>
            <div class="reward-section">
                <p class="reward-amount">${reward}</p>
                <p class="reward-label">Guaranteed Reward Credit</p>
            </div>
            ${selected.method === 'dropoff' ? `
            <div class="address-section">
                <p class="address-title">📍 Drop-off Location</p>
                <p class="address-lines">${selected.dropoff.name}</p>
            </div>
            <div class="instructions">
                <strong>How to use:</strong><br>
                Present this label at the partner store counter.<br>
                No additional packaging needed.
            </div>
            ` : `
            <div class="address-section">
                <p class="address-title">📤 From (Sender)</p>
                <p class="address-lines">${shipping.name}<br>${shipping.street}<br>${shipping.city}, ${shipping.zip}</p>
            </div>
            <div class="address-section">
                <p class="address-title">📥 To (Loopify Returns)</p>
                <p class="address-lines">Loopify Returns Department<br>123 Green Loop Street<br>Yangon 11181<br>Myanmar</p>
            </div>
            <div class="instructions">
                <strong>How to use:</strong><br>
                Print this page, cut out the label section,<br>
                and attach securely to your package.<br>
                Drop off at any post office or courier.
            </div>
            `}
        </div>
    </div>
    <script>
        window.addEventListener('load', () => {
            setTimeout(() => window.print(), 1000);
        }, { once: true });
    </script>
</body>
</html>`;

            const blob = new Blob([labelHTML], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'loopify-return-label.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setMessage({ text: '✅ Success! Your printable return label (HTML) has been downloaded. Open it in your browser to auto-print.', type: 'success' });
            setStep(4);

        } catch (err) {
            console.error('Submission Error:', err);
            setMessage({ text: 'Error processing return. Please try again.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // --- Step 4: Thank You ---
    if (step === 4) {
        return (
            <div className="min-h-screen bg-loopifyLight text-loopifyDark font-body flex flex-col">
                <div className="container mx-auto px-6 py-24 max-w-3xl flex-grow flex items-center justify-center">
                    <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border-t-8 border-loopifyMain animate-fade-in">
                        <CheckCircle className="w-20 h-20 text-loopifyMain mx-auto mb-8" />
                        <h2 className="text-4xl lg:text-5xl font-title font-bold text-loopifyDark mb-6">Return Confirmed!</h2>
                        <p className="text-lg text-loopifyMuted mb-8 max-w-2xl mx-auto">
                            Your return request for the <span className="font-semibold text-loopifyMain">{selectedItem.name}</span> has been successfully processed.
                        </p>
                        <div className="bg-loopifyLight/50 p-6 rounded-2xl border-l-4 border-loopifyAccent mb-8">
                            <p className="text-loopifyDark font-semibold text-center">
                                📄 <strong>Open <code className="bg-loopifySoft/60 px-3 py-1.5 rounded-lg font-mono text-sm font-bold inline-block mx-2">loopify-return-label.html</code></strong> in your browser
                            </p>
                            <p className="text-sm text-loopifyMuted text-center mt-2">
                                It will automatically prompt to print the label. Use it at your drop-off or shipping location.
                            </p>
                        </div>
                        <button 
                            onClick={() => setStep(1)} 
                            className="px-12 py-4 bg-loopifyAccent text-loopifyDark font-title font-bold rounded-xl hover:bg-loopifyAccent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Start a New Return
                        </button>
                    </div>
                </div>
                <MessageBox message={message.text} type={message.type} onClose={() => setMessage({ text: null, type: null })} />
            </div>
        );
    }

    // --- Main Wizard Steps (1, 2, 3) ---
    return (
        <div className="min-h-screen bg-loopifyLight text-loopifyDark font-body flex flex-col pt-16 p-10">
            <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16 max-w-5xl flex-grow">
                <form onSubmit={step === 3 ? submitReturn : (e) => e.preventDefault()} className="space-y-16">
                    <div className="min-h-[500px]">
                        {/* Step 1: Item Selection */}
                        {step === 1 && (
                            <section className="transition-opacity duration-500 ease-in-out space-y-10">
                                <h2 className="text-3xl md:text-4xl font-title font-semibold text-loopifyDark border-b pb-3 border-loopifySoft">1. Select Item & Condition</h2>

                                {/* Categories */}
                                <div className="p-6 bg-white rounded-2xl shadow-xl">
                                    <p className="text-lg font-semibold text-loopifyDark mb-4">Choose Category</p>
                                    <div className="flex flex-wrap gap-4">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelected({ ...selected, category: cat.id, item: null, condition: null })}
                                                className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md text-base
                                                    ${selected.category === cat.id
                                                        ? 'bg-loopifyMain text-white ring-4 ring-loopifySecondary/50'
                                                        : 'bg-loopifyLight text-loopifyDark hover:bg-loopifySoft/80 border border-loopifySoft'
                                                    }`}
                                            >
                                                <cat.icon className="w-5 h-5 inline mr-2" />
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Items & Condition */}
                                {selected.category && (
                                    <div className="grid lg:grid-cols-3 gap-6">
                                        {/* Items */}
                                        <div className="lg:col-span-2 p-6 bg-white rounded-2xl shadow-xl">
                                            <p className="text-lg font-semibold text-loopifyDark mb-4">Specific Item</p>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                {currentItems.map((item) => (
                                                    <label key={item.id} className="cursor-pointer block">
                                                        <input
                                                            type="radio"
                                                            name="item"
                                                            value={item.id}
                                                            checked={selected.item === item.id}
                                                            onChange={() => setSelected({ ...selected, item: item.id })}
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            className={`p-4 border-2 rounded-xl transition-all h-full flex items-center space-x-4
                                                                ${selected.item === item.id
                                                                    ? 'border-loopifyAccent bg-loopifyAccent/10 shadow-lg scale-[1.01]'
                                                                    : 'border-loopifySoft hover:border-loopifySecondary bg-loopifyLight'
                                                                }`}
                                                        >
                                                            <img 
                                                                onError={(e) => e.currentTarget.src = `https://placehold.co/64x64/E6F5EB/1F2937?text=No+Img`} 
                                                                src={item.img} 
                                                                alt={item.name} 
                                                                className="w-16 h-16 object-cover rounded-md mix-blend-multiply" 
                                                            />
                                                            <div>
                                                                <p className="font-semibold text-loopifyDark text-base font-title">{item.name}</p>
                                                                <p className="text-sm text-loopifyMuted">Potential Reward: <span className='font-bold text-loopifySecondary'>{item.reward.split('–')[0]} +</span></p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Condition */}
                                        {selected.item && (
                                            <div className="lg:col-span-1 p-6 bg-white rounded-2xl shadow-xl">
                                                <p className="font-semibold text-lg mb-4 text-loopifyDark">Item Condition</p>
                                                <div className="space-y-3">
                                                    {CONDITIONS.map((cond) => (
                                                        <label key={cond.id} className="block cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="condition"
                                                                value={cond.id}
                                                                checked={selected.condition === cond.id}
                                                                onChange={() => setSelected({ ...selected, condition: cond.id })}
                                                                className="sr-only"
                                                            />
                                                            <div
                                                                className={`p-4 border-2 rounded-lg transition-all h-full text-center
                                                                    ${selected.condition === cond.id
                                                                        ? 'border-loopifyMain bg-loopifyMain/10 font-semibold shadow-md ring-2 ring-loopifyMain/20'
                                                                        : 'border-loopifySoft hover:border-loopifyMuted'
                                                                    }`}
                                                            >
                                                                <span>{cond.label}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!canProceed(1)}
                                        className="px-10 py-4 bg-loopifyAccent text-loopifyDark font-title font-bold rounded-xl hover:bg-loopifyAccent/90 transition shadow-lg shadow-loopifyAccent/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                                    >
                                        Next: Collection Method
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* Step 2: Collection Method */}
                        {step === 2 && (
                            <section className="transition-opacity duration-500 ease-in-out space-y-10">
                                <h2 className="text-3xl md:text-4xl font-title font-semibold text-loopifyDark border-b pb-3 border-loopifySoft">2. Choose Collection Method & Details</h2>

                                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-xl">
                                    {/* Drop-off Option */}
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="method"
                                            value="dropoff"
                                            checked={selected.method === 'dropoff'}
                                            onChange={() => setSelected((prev) => ({ ...prev, method: 'dropoff', dropoff: null }))}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`p-6 border-2 rounded-2xl transition-all flex items-center space-x-4 bg-loopifyLight shadow-md
                                                ${selected.method === 'dropoff' 
                                                    ? 'border-loopifyMain ring-4 ring-loopifyMain/30 scale-105' 
                                                    : 'border-loopifySoft hover:border-loopifySecondary hover:scale-105'
                                                }`}
                                        >
                                            <div className="w-12 h-12 bg-loopifyMain/20 rounded-full flex items-center justify-center">
                                                <MapPinIcon className="w-6 h-6 text-loopifyMain" />
                                            </div>
                                            <div>
                                                <p className="font-title font-semibold text-lg text-loopifyDark">Drop-off at Partner Shop</p>
                                                <p className="text-sm text-loopifyMuted">Free. Instant label.</p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* Ship Option */}
                                    <label className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="method"
                                            value="ship"
                                            checked={selected.method === 'ship'}
                                            onChange={() => setSelected((prev) => ({ ...prev, method: 'ship', dropoff: null }))}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`p-6 border-2 rounded-2xl transition-all flex items-center space-x-4 bg-loopifyLight shadow-md
                                                ${selected.method === 'ship' 
                                                    ? 'border-loopifyMain ring-4 ring-loopifyMain/30 scale-105' 
                                                    : 'border-loopifySoft hover:border-loopifySecondary hover:scale-105'
                                                }`}
                                        >
                                            <div className="w-12 h-12 bg-loopifyMain/20 rounded-full flex items-center justify-center">
                                                <TruckIcon className="w-6 h-6 text-loopifyMain" />
                                            </div>
                                            <div>
                                                <p className="font-title font-semibold text-lg text-loopifyDark">Ship with Free Label</p>
                                                <p className="text-sm text-loopifyMuted">We cover shipping. Print label now.</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {/* Drop-off Map UI */}
                                {selected.method === 'dropoff' && (
                                    <div className="p-6 bg-white rounded-2xl shadow-xl">
                                        <h3 className="font-title font-semibold text-xl mb-6 text-loopifyDark">Select Drop-off Location</h3>
                                        {/* Scrollable Map Wrapper */}
                                        <div
                                            className="rounded-xl shadow-inner border border-loopifySoft/50 w-full relative overflow-auto z-0"
                                            style={{ height: "420px" }}
                                        >
                                            <div
                                                ref={mapRef}
                                                className="h-[1000px] w-[1000px]"
                                            />
                                        </div>
                                        <p className="mt-6 text-sm text-center font-semibold">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold transition-colors ${
                                                selected.dropoff 
                                                    ? 'bg-loopifyAccent/20 text-loopifyAccent ring-2 ring-loopifyAccent/30' 
                                                    : 'bg-loopifyMuted/20 text-loopifyMuted'
                                            }`}>
                                                {selected.dropoff ? `✓ ${selected.dropoff.name}` : 'Click a pin on the map to select'}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {/* Ship Address Form + Photo Upload */}
                                {selected.method === 'ship' && (
                                    <div className="p-6 bg-white rounded-2xl shadow-xl space-y-6">
                                        <h3 className="font-title font-semibold text-xl text-loopifyDark">Shipping Details</h3>

                                        {/* Name */}
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="Full Name" 
                                                value={shipping.name} 
                                                onChange={handleShippingChange('name')} 
                                                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                                                    shippingErrors.name
                                                        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                                                        : 'border-loopifySoft focus:border-loopifyMain focus:ring-loopifyMain/20'
                                                }`} 
                                            />
                                            {shippingErrors.name && (
                                                <p className="mt-2 text-sm font-medium text-red-500">{shippingErrors.name}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <input 
                                                type="email" 
                                                placeholder="Email (for label & tracking)" 
                                                value={shipping.email} 
                                                onChange={handleShippingChange('email')} 
                                                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                                                    shippingErrors.email
                                                        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                                                        : 'border-loopifySoft focus:border-loopifyMain focus:ring-loopifyMain/20'
                                                }`} 
                                            />
                                            {shippingErrors.email && (
                                                <p className="mt-2 text-sm font-medium text-red-500">{shippingErrors.email}</p>
                                            )}
                                        </div>

                                        {/* Street */}
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder="Street Address" 
                                                value={shipping.street} 
                                                onChange={handleShippingChange('street')} 
                                                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                                                    shippingErrors.street
                                                        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                                                        : 'border-loopifySoft focus:border-loopifyMain focus:ring-loopifyMain/20'
                                                }`} 
                                            />
                                            {shippingErrors.street && (
                                                <p className="mt-2 text-sm font-medium text-red-500">{shippingErrors.street}</p>
                                            )}
                                        </div>

                                        {/* City & ZIP */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="sm:col-span-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="City" 
                                                    value={shipping.city} 
                                                    onChange={handleShippingChange('city')} 
                                                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                                                        shippingErrors.city
                                                            ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                                                            : 'border-loopifySoft focus:border-loopifyMain focus:ring-loopifyMain/20'
                                                    }`} 
                                                />
                                                {shippingErrors.city && (
                                                    <p className="mt-2 text-sm font-medium text-red-500">{shippingErrors.city}</p>
                                                )}
                                            </div>
                                            <div>
                                                <input 
                                                    type="text" 
                                                    placeholder="ZIP" 
                                                    value={shipping.zip} 
                                                    onChange={handleShippingChange('zip')} 
                                                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                                                        shippingErrors.zip
                                                            ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                                                            : 'border-loopifySoft focus:border-loopifyMain focus:ring-loopifyMain/20'
                                                    }`} 
                                                />
                                                {shippingErrors.zip && (
                                                    <p className="mt-2 text-sm font-medium text-red-500">{shippingErrors.zip}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Photo Upload */}
                                        <div className="pt-6 border-t border-loopifySoft">
                                            <p className="font-semibold mb-4 text-loopifyDark">📸 Upload Item Photo (Optional, helps verification)</p>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                onChange={onPhotoSelect}
                                                className="block w-full text-sm text-loopifyMuted file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-loopifyMain/80 file:text-white hover:file:bg-loopifyMain file:transition-all file:shadow-sm hover:file:shadow-md cursor-pointer"
                                            />
                                            {photoPreview && (
                                                <div className="mt-6 flex justify-center">
                                                    <img
                                                        src={photoPreview}
                                                        alt="Return item preview"
                                                        className="w-40 h-40 object-cover rounded-xl shadow-xl border-2 border-loopifySoft/50 hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between pt-6">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(step - 1)} 
                                        className="px-8 py-3 text-loopifyMuted font-semibold flex items-center hover:text-loopifyDark transition-all duration-200 hover:scale-105"
                                    >
                                        <ChevronLeft className="mr-3 w-5 h-5" /> Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!canProceed(2)}
                                        className="px-12 py-4 bg-loopifyAccent text-loopifyDark font-title font-bold rounded-xl hover:bg-loopifyAccent/90 transition-all duration-300 shadow-lg shadow-loopifyAccent/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 disabled:scale-100"
                                    >
                                        Next: Review & Confirm
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <section className="transition-opacity duration-500 ease-in-out">
                                <h2 className="text-3xl md:text-4xl font-title font-semibold text-loopifyDark border-b pb-3 border-loopifySoft">3. Review and Confirm</h2>
                                <div className="bg-white p-8 rounded-3xl shadow-2xl space-y-8 mt-10">

                                    {/* Item Details */}
                                    <div className="border-b pb-8 border-loopifySoft">
                                        <h3 className="font-title font-bold text-2xl mb-6 text-loopifyDark">Recycling Item</h3>
                                        <div className="flex items-start space-x-6 bg-loopifyLight/70 p-6 rounded-xl">
                                            <img src={selectedItem.img} alt={selectedItem.name} className="w-24 h-24 object-contain rounded-lg border border-loopifySoft p-2 flex-shrink-0 mix-blend-multiply" />
                                            <div className="flex-grow">
                                                <p className="font-title font-bold text-2xl mb-2">{selectedItem.name}</p>
                                                <p className="text-sm text-loopifyMuted mb-3">Category: {CATEGORIES.find((c) => c.id === selected.category)?.name}</p>
                                                <p className="text-sm text-loopifyDark font-semibold">Condition: <span className="text-loopifySecondary font-bold">{selectedCondition.label}</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Return Method & Address */}
                                    <div className="border-b pb-8 border-loopifySoft">
                                        <h3 className="font-title font-bold text-2xl mb-6 text-loopifyDark">Collection Method</h3>
                                        <p className="font-semibold text-loopifyMain flex items-center text-xl mb-6">
                                            {selected.method === 'dropoff' ? (
                                                <>
                                                    <MapPinIcon className="w-6 h-6 mr-3 text-loopifyAccent" /> Drop-off at Partner Location
                                                </>
                                            ) : (
                                                <>
                                                    <TruckIcon className="w-6 h-6 mr-3 text-loopifyAccent" /> Prepaid Shipping Label
                                                </>
                                            )}
                                        </p>
                                        <div className="bg-loopifyLight/50 p-6 rounded-xl">
                                            <div className="text-base text-loopifyDark space-y-3 pl-0">
                                                {selected.method === 'dropoff' ? (
                                                    <p className="font-bold text-lg">
                                                        <MapPinIcon className="w-5 h-5 inline mr-2 text-loopifyAccent" />
                                                        {selected.dropoff?.name}
                                                    </p>
                                                ) : (
                                                    <>
                                                        <p><span className="font-medium">Name:</span> <span className="font-bold">{shipping.name}</span></p>
                                                        <p><span className="font-medium">Address:</span> <span className="font-mono">{shipping.street}, {shipping.city}, {shipping.zip}</span></p>
                                                        <p><span className="font-medium">Email:</span> <span className="font-mono">{shipping.email}</span></p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reward Summary */}
                                    <div className="pt-6 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-loopifyMain/10 to-loopifyAccent/10 p-8 rounded-2xl border-l-4 border-loopifyMain backdrop-blur-sm">
                                        <div className="text-left sm:text-center mb-6 sm:mb-0">
                                            <h3 className="font-title font-bold text-2xl flex items-center justify-center sm:justify-start">
                                                <WalletIcon className="w-8 h-8 mr-4 text-loopifyHighlight" /> Estimated Reward
                                            </h3>
                                            <p className="text-sm text-loopifyMuted mt-2">
                                                <span className="font-semibold text-loopifyDark">100% Guaranteed</span> amount after inspection.
                                            </p>
                                        </div>
                                        <p className="text-5xl lg:text-6xl font-title font-extrabold text-loopifyAccent leading-none">
                                            {reward}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(step - 1)} 
                                        className="px-8 py-4 text-loopifyMuted font-semibold flex items-center hover:text-loopifyDark transition-all duration-300 hover:scale-105"
                                    >
                                        <ChevronLeft className="mr-3 w-5 h-5" /> Edit Details
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-16 py-4 w-full sm:w-auto bg-gradient-to-r from-loopifyMain to-loopifySecondary text-white font-title font-bold rounded-xl hover:from-loopifyMain/90 hover:to-loopifySecondary/90 transition-all duration-300 shadow-lg shadow-loopifyMain/40 disabled:opacity-60 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center hover:shadow-xl hover:scale-105 disabled:scale-100 text-lg"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-4 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Finalizing...
                                            </>
                                        ) : (
                                            '✅ Confirm & Download Label'
                                        )}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </form>
            </div>
            
            <MessageBox
                message={message.text}
                type={message.type}
                onClose={() => setMessage({ text: null, type: null })}
            />
        </div>
    );
};

export default ReturnPage;