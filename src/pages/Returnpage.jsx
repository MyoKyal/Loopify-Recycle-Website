import React, { useState, useEffect, useRef, useCallback } from 'react';

// NOTE ON IMPORTS: In a standard React project, you would use:
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';


// --- Helper Components & Icons (Lucide) ---

const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {path.map((d, i) => <path key={i} d={d}/>)}
    </svg>
);
const BoxIcon = (props) => (<Icon {...props} path={["M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z", "M16 10H8", "M8 14h8"]}/>);
const MapPinIcon = (props) => (<Icon {...props} path={["M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M12 2C7.03 2 3 6.03 3 11c0 5.52 9 13 9 13s9-7.48 9-13c0-4.97-4.03-9-9-9z"]}/>);
const TruckIcon = (props) => (<Icon {...props} path={["M5 18H3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h3c.6 0 1.1.3 1.4.8l2.5 4.5", "M22 12v5h-2", "M15 17.5a2.5 2.5 0 0 1-5 0", "M22 17.5a2.5 2.5 0 0 1-5 0", "M15 17.5H10", "M17 17.5v-10h-6.4l-2.7 4.9"]}/>);
const WalletIcon = (props) => (<Icon {...props} path={["M21 12V7H3v10h9", "M16 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M16 17v-1.5a.5.5 0 0 1 .5-.5h2"]}/>);
const ChevronLeft = (props) => (<Icon {...props} path={["m15 18-6-6 6-6"]}/>);
const CheckCircle = (props) => (<Icon {...props} path={["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M9 11l3 3L22 4"]}/>);

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

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null); // Ref to hold the Leaflet map instance
    const markerRef = useRef(null); // Ref to hold the current Leaflet marker

    // --- Computed State Logic ---

    const currentItems = ITEMS[selected.category] || [];
    const selectedItem = currentItems.find(i => i.id === selected.item) || {};

    // Fixed dependency warning: Now depends on primitive values of selected for stability
    const calculateReward = useCallback(() => {
        const itemData = ITEMS[selected.category]?.find(i => i.id === selected.item);
        const base = itemData?.reward || '0 MMK';
        if (base.includes('kg')) return base;

        const factor = { 'like-new': 1, 'good': 0.7, 'worn': 0.4 }[selected.condition] || 0;
        // Extract the lowest numerical value from the range
        const numMatch = base.match(/[\d,]+/g);
        const num = parseInt(numMatch?.[0]?.replace(/,/g, '') || 0);

        return `${Math.round(num * factor).toLocaleString()} MMK`;
    }, [selected.category, selected.item, selected.condition]); // Correct dependencies

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
            return false; // If no method is selected
        }
        return true;
    }, [selected, shipping]);

    const nextStep = () => {
        if (canProceed(step)) {
            setStep(step + 1);
        }
    };

    // --- Handlers ---

    const onPhotoSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            setPhoto(ev.target.result);
            setPhotoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Fixed dependency warning: Uses stable setSelected and mapInstanceRef
    const handleDropoffSelection = useCallback((lat, lng, name) => {
        setSelected(prev => ({ ...prev, dropoff: { name, lat, lng } }));

        if (mapInstanceRef.current && window.L) {
            const L = window.L; // Local definition for L
            mapInstanceRef.current.setView([lat, lng], 14);

            // Update a central marker if needed
            if (!markerRef.current) {
                markerRef.current = L.marker([lat, lng], { draggable: false, icon: L.divIcon({ className: 'custom-div-icon', html: `<div class="bg-loopifyAccent w-8 h-8 rounded-full shadow-lg ring-4 ring-loopifyAccent/50 flex items-center justify-center text-white font-bold text-lg">!</div>`, iconSize: [32, 32], iconAnchor: [16, 32] }) }).addTo(mapInstanceRef.current);
            } else {
                markerRef.current.setLatLng([lat, lng]);
            }

            // Re-open popup on selected marker
            const popupContent = `<div class="font-body text-loopifyDark">
                <b class="font-title text-loopifyMain">${name}</b>
                <br/><small>Selected Drop-off Point</small>
            </div>`;

            markerRef.current.bindPopup(popupContent).openPopup();
        }
    }, [setSelected]); // Dependency fix

    // Fixed dependency warning: Uses stable dependencies (handleDropoffSelection is memoized)
    const initMap = useCallback(() => {
        // Check if L (Leaflet global object) is available and map hasn't been initialized
        if (typeof window.L === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

        const L = window.L; // Local definition for L

        const mapInstance = L.map(mapRef.current).setView([16.8400, 96.1700], 12); // Default to Yangon Area
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
        mapInstanceRef.current = mapInstance;

        // Create the custom icon (using a divIcon for better styling integration)
        // Fixed unused variable warnings by using lat and lng in the title
        const customIcon = (name, lat, lng) => L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="bg-loopifyMain w-4 h-4 rounded-full shadow-md ring-2 ring-white/80" title="${name} (${lat}, ${lng})"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        // Add markers for all points
        DROPOFF_POINTS.forEach(p => {
            const marker = L.marker([p.lat, p.lng], { icon: customIcon(p.name, p.lat, p.lng) }).addTo(mapInstance);

            // Raw HTML popup to use the handler (React's onClick won't work in raw Leaflet popup)
            const popupContent = `<div class="font-body text-loopifyDark">
                <b class="font-title text-loopifyMain">${p.name}</b>
                <br/>
                <button
                    class="text-loopifyAccent underline font-semibold text-sm mt-1"
                    id="select-dropoff-${p.lat}-${p.lng}"
                >
                    Select This Location
                </button>
            </div>`;

            marker.bindPopup(popupContent);

            // React/Leaflet integration workaround: Attach the click listener after the popup is opened
            marker.on('popupopen', () => {
                document.getElementById(`select-dropoff-${p.lat}-${p.lng}`)
                    ?.addEventListener('click', () => handleDropoffSelection(p.lat, p.lng, p.name));
            });

            marker.on('popupclose', () => {
                document.getElementById(`select-dropoff-${p.lat}-${p.lng}`)
                    ?.removeEventListener('click', () => handleDropoffSelection(p.lat, p.lng, p.name));
            });
        });

        setTimeout(() => mapInstance.invalidateSize(), 100);

    }, [handleDropoffSelection]); // Dependency fix: handleDropoffSelection is required here


    // Effect to handle map initialization on step 2 'dropoff' selection
    useEffect(() => {
        if (step === 2 && selected.method === 'dropoff') {
            // Check if Leaflet is loaded
            if (typeof window.L !== 'undefined') {
                initMap();
            } else {
                console.error("Leaflet (L) is not defined. Ensure Leaflet CDN is loaded in index.html.");
            }
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [step, selected.method, initMap]);


    const submitReturn = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            selected: selected,
            shipping: selected.method === 'ship' ? shipping : 'N/A',
            rewardAmount: rewardAmount,
            photo: photo // Base64 data (if uploaded)
        };

        try {
            // Simulate API call for generating a return label/QR code
            console.log('Submitting Return Payload:', payload);

            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate PDF Label Generation and Download (required function logic)
            const mockPdfContent = new TextEncoder().encode(`Return Label for ${shipping.name || selected.dropoff?.name}. Reward: ${reward}`);
            const mockBlob = new Blob([mockPdfContent], { type: 'application/pdf' });

            const url = URL.createObjectURL(mockBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'loopify-return-label.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setMessage({ text: 'Success! Your label has been downloaded.', type: 'success' });
            setStep(4); // Move to a 'Thank You' state

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
                <Navbar step={3} />
                <div className="container mx-auto px-6 py-24 max-w-3xl flex-grow flex items-center justify-center">
                    <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border-t-8 border-loopifyMain animate-fade-in">
                        <CheckCircle className="w-16 h-16 text-loopifyMain mx-auto mb-6"/>
                        <h2 className="text-4xl font-title font-bold text-loopifyDark mb-4">Return Confirmed!</h2>
                        <p className="text-lg text-loopifyMuted mb-6">
                            Your return request for the <span className='font-semibold text-loopifyMain'>{selectedItem.name}</span> has been successfully processed.
                        </p>
                        <p className="text-loopifyDark font-semibold">
                            Please use the downloaded label (or QR code) at your selected {selected.method === 'dropoff' ? 'drop-off location' : 'shipping center'}.
                        </p>
                        <button onClick={() => setStep(1)} className="mt-10 px-10 py-4 bg-loopifyAccent text-loopifyDark font-title font-bold rounded-xl hover:bg-loopifyAccent/90 transition shadow-lg">Start a New Return</button>
                    </div>
                </div>
                <Footer />
                <MessageBox message={message.text} type={message.type} onClose={() => setMessage({ text: null, type: null })} />
            </div>
        );
    }


    // --- Main Wizard Steps (1, 2, 3) ---
    return (
        <div className="min-h-screen bg-loopifyLight text-loopifyDark font-body flex flex-col">
            <Navbar step={step} />

            <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16 max-w-5xl flex-grow">
                <form onSubmit={step === 3 ? submitReturn : (e) => e.preventDefault()} className="space-y-16">

                    {/* Conditional Rendering for Steps */}
                    <div className="min-h-[500px]">
                        {/* Step 1: Item Selection */}
                        {step === 1 && (
                            <section className="transition-opacity duration-500 ease-in-out space-y-10">
                                <h2 className="text-3xl md:text-4xl font-title font-semibold text-loopifyDark border-b pb-3 border-loopifySoft">1. Select Item & Condition</h2>

                                {/* Categories */}
                                <div className="p-6 bg-white rounded-2xl shadow-xl">
                                    <p className="text-lg font-semibold text-loopifyDark mb-4">Choose Category</p>
                                    <div className="flex flex-wrap gap-4">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelected({ ...selected, category: cat.id, item: null, condition: null })}
                                                className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md text-base
                                                    ${selected.category === cat.id
                                                        ? 'bg-loopifyMain text-white ring-4 ring-loopifySecondary/50'
                                                        : 'bg-loopifyLight text-loopifyDark hover:bg-loopifySoft/80 border border-loopifySoft'
                                                    }`
                                                }
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
                                                {currentItems.map(item => (
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
                                                                }`
                                                            }
                                                        >
                                                            <img onError={(e) => e.currentTarget.src = `https://placehold.co/64x64/E6F5EB/1F2937?text=No+Img`} src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-md mix-blend-multiply" />
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
                                                    {CONDITIONS.map(cond => (
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
                                                                    }`
                                                                }
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
                                        className="px-10 py-4 bg-loopifyAccent text-loopifyDark font-title font-bold rounded-xl hover:bg-loopifyAccent/90 transition shadow-lg shadow-loopifyAccent/30 disabled:opacity-50 disabled:shadow-none"
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
                                            onChange={() => setSelected(prev => ({ ...prev, method: 'dropoff', dropoff: null }))}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`p-6 border-2 rounded-2xl transition-all flex items-center space-x-4 bg-loopifyLight shadow-md
                                                ${selected.method === 'dropoff' ? 'border-loopifyMain ring-4 ring-loopifyMain/30' : 'border-loopifySoft hover:border-loopifySecondary'}`
                                            }
                                        >
                                            <div className="w-12 h-12 bg-loopifyMain/20 rounded-full flex items-center justify-center">
                                                <MapPinIcon className="w-6 h-6 text-loopifyMain" />
                                            </div>
                                            <div>
                                                <p className="font-title font-semibold text-lg text-loopifyDark">Drop-off at Partner Shop</p>
                                                <p className="text-sm text-loopifyMuted">Free. Instant QR code label.</p>
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
                                            onChange={() => setSelected(prev => ({ ...prev, method: 'ship', dropoff: null }))}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`p-6 border-2 rounded-2xl transition-all flex items-center space-x-4 bg-loopifyLight shadow-md
                                                ${selected.method === 'ship' ? 'border-loopifyMain ring-4 ring-loopifyMain/30' : 'border-loopifySoft hover:border-loopifySecondary'}`
                                            }
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
                                    <div className="mt-6 p-6 bg-white rounded-2xl shadow-xl">
                                        <h3 className="font-title font-semibold text-xl mb-4 text-loopifyDark">Select Drop-off Location</h3>
                                        {/* The map div must be included here to be rendered for Leaflet to attach to */}
                                        <div ref={mapRef} id="map" className="h-[400px] rounded-xl shadow-inner border border-loopifySoft z-10 w-full"></div>
                                        <p className="mt-4 text-sm text-center font-semibold text-loopifyMuted">
                                            Selected: <span className={`font-title font-bold transition-colors ${selected.dropoff ? 'text-loopifyAccent' : 'text-loopifyMuted'}`}>{selected.dropoff ? selected.dropoff.name : 'Click on a pin to select a point'}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Ship Address Form + Photo Upload */}
                                {selected.method === 'ship' && (
                                    <div className="mt-6 p-6 bg-white rounded-2xl shadow-xl space-y-5">
                                        <h3 className="font-title font-semibold text-xl text-loopifyDark">Shipping Details</h3>
                                        <input type="text" placeholder="Full Name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} required className="w-full px-4 py-3 border border-loopifySoft rounded-lg focus:border-loopifyMain focus:ring focus:ring-loopifyMain/20 transition"/>
                                        <input type="email" placeholder="Email (for label & tracking)" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })} required className="w-full px-4 py-3 border border-loopifySoft rounded-lg focus:border-loopifyMain focus:ring focus:ring-loopifyMain/20 transition"/>
                                        <input type="text" placeholder="Street Address" value={shipping.street} onChange={e => setShipping({ ...shipping, street: e.target.value })} required className="w-full px-4 py-3 border border-loopifySoft rounded-lg focus:border-loopifyMain focus:ring focus:ring-loopifyMain/20 transition"/>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <input type="text" placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} required className="sm:col-span-2 px-4 py-3 border border-loopifySoft rounded-lg focus:border-loopifyMain focus:ring focus:ring-loopifyMain/20 transition"/>
                                            <input type="text" placeholder="ZIP" value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })} required className="px-4 py-3 border border-loopifySoft rounded-lg focus:border-loopifyMain focus:ring focus:ring-loopifyMain/20 transition"/>
                                        </div>

                                        {/* Photo Upload */}
                                        <div className="pt-4 border-t border-loopifySoft">
                                            <p className="font-semibold mb-2 text-loopifyDark">Upload Item Photo (Optional)</p>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                onChange={onPhotoSelect}
                                                className="block w-full text-sm text-loopifyMuted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-loopifySoft file:text-loopifyMain cursor-pointer"
                                            />
                                            {photoPreview && (
                                                <img
                                                    src={photoPreview}
                                                    alt="Return item preview"
                                                    className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md border-2 border-loopifySoft transition-transform hover:scale-[1.05]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between pt-4">
                                    <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 text-loopifyMuted font-semibold flex items-center hover:text-loopifyDark transition">
                                        <ChevronLeft className="mr-2 w-5 h-5"/> Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!canProceed(2)}
                                        className="px-10 py-4 bg-loopifyAccent text-loopifyDark font-title font-bold rounded-xl hover:bg-loopifyAccent/90 transition shadow-lg shadow-loopifyAccent/30 disabled:opacity-50 disabled:shadow-none"
                                    >
                                        Next: Review
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
                                    <div className="border-b pb-6 border-loopifySoft">
                                        <h3 className="font-title font-bold text-2xl mb-4 text-loopifyDark">Recycling Item</h3>
                                        <div className="flex items-center space-x-6 bg-loopifyLight/70 p-4 rounded-xl">
                                            <img src={selectedItem.img} alt={selectedItem.name} className="w-20 h-20 object-contain rounded-lg border border-loopifySoft p-1 mix-blend-multiply"/>
                                            <div>
                                                <p className="font-title font-bold text-xl">{selectedItem.name}</p>
                                                <p className="text-sm text-loopifyMuted">Category: {CATEGORIES.find(c => c.id === selected.category)?.name}</p>
                                                <p className="text-sm text-loopifyDark font-semibold">Condition: <span className="text-loopifySecondary">{selectedCondition.label}</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Return Method & Address */}
                                    <div className="border-b pb-6 border-loopifySoft">
                                        <h3 className="font-title font-bold text-2xl mb-4 text-loopifyDark">Collection Method</h3>
                                        <p className="font-semibold text-loopifyMain flex items-center text-lg">
                                            {selected.method === 'dropoff' ? (
                                                <><MapPinIcon className="w-6 h-6 mr-2 text-loopifyAccent" /> Drop-off at Partner Location</>
                                            ) : (
                                                <><TruckIcon className="w-6 h-6 mr-2 text-loopifyAccent" /> Prepaid Shipping Label</>
                                            )}
                                        </p>
                                        <div className="text-base mt-3 text-loopifyDark space-y-1 pl-8">
                                            {selected.method === 'dropoff' ? (
                                                <p>Location: <span className='font-bold text-loopifyDark'>{selected.dropoff?.name}</span></p>
                                            ) : (
                                                <>
                                                    <p>Recipient: <span className='font-bold text-loopifyDark'>{shipping.name}</span></p>
                                                    <p>Address: <span className='text-loopifyMuted'>{shipping.street}, {shipping.city}, {shipping.zip}</span></p>
                                                    <p>Email: <span className='text-loopifyMuted'>{shipping.email}</span></p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reward Summary */}
                                    <div className="pt-4 flex justify-between items-center bg-loopifyMain/10 p-6 rounded-xl border-l-4 border-loopifyMain">
                                        <div>
                                            <h3 className="font-title font-bold text-2xl text-loopifyDark flex items-center">
                                                <WalletIcon className="w-7 h-7 mr-3 text-loopifyHighlight" /> Estimated Reward
                                            </h3>
                                            <p className="text-sm text-loopifyMuted mt-1">
                                                <span className='font-semibold text-loopifyDark'>100% Guaranteed</span> amount, pending final check.
                                            </p>
                                        </div>
                                        <p className="text-5xl font-title font-extrabold text-loopifyAccent">
                                            {reward}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-between">
                                    <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 text-loopifyMuted font-semibold flex items-center hover:text-loopifyDark transition">
                                        <ChevronLeft className="mr-2 w-5 h-5"/> Edit Details
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-12 py-4 bg-loopifyMain text-white font-title font-bold rounded-xl hover:bg-loopifyMain/90 transition shadow-lg shadow-loopifyMain/40 disabled:opacity-60 disabled:shadow-none flex items-center justify-center"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Finalizing...
                                            </>
                                        ) : (
                                            'Confirm & Get Label'
                                        )}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </form>
            </div>
            <Footer />
            <MessageBox
                message={message.text}
                type={message.type}
                onClose={() => setMessage({ text: null, type: null })}
            />
        </div>
    );
};

export default ReturnPage;
