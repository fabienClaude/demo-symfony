import React, { useState } from 'react';
import axios from 'axios';

const REQUIRED_FIELDS = ['name', 'owner', 'address', 'city', 'zipcode', 'shoptype'];
function ShopCard({ shop }) {
    return (
        <div className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start gap-4">
                <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                        {shop.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">{shop.city}</p>
                </div>
            </div>

            <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                    <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="truncate">{shop.address}</span>
                </div>
            </dl>
        </div>
    );
}

function AddShopModal({ open, onClose, onSave, types, addurl }) {
	const shopState = { name: '', owner: '', address: '', city: '', zipcode: '', shoptype: '' };
    const [form, setForm] = useState(shopState);
    const [fieldErrors, setFieldErrors] = useState({});

    if (!open) return null;

    const handleChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        // Efface l'erreur du champ dès que l'utilisateur corrige
        setFieldErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const validate = () => {
        const errors = {};
        REQUIRED_FIELDS.forEach((field) => {
            if (!form[field].trim()) {
                errors[field] = 'Ce champ est obligatoire.';
            }
        });
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();   
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setLoading(true);
    	setApiError('');
        try {
	        const response = await axios.post(addurl, form);
	        onSave(response.data);
	        setForm(shopState);
	        setFieldErrors({});
	        setLoading(false);
	    } catch (error) {
	        setApiError(error.response?.data?.message || 'Erreur lors de l\'ajout du magasin.');
	        setLoading(false);
	    }
    };

    const handleClose = () => {
        setForm(shopState);
        setFieldErrors({});
        onClose();
    };

    const inputClass = (field) =>
        `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            fieldErrors[field]
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500/20'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Ajouter un magasin
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Renseignez les informations du point de vente.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Fermer"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Nom du magasin <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange('name')}
                            placeholder="Ex : Épicerie du Marché"
                            aria-invalid={Boolean(fieldErrors.name)}
                            className={inputClass('name')}
                        />
                        {fieldErrors.name && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Propriétaire du magasin <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.owner}
                            onChange={handleChange('owner')}
                            placeholder="Ex : Michel Durand"
                            aria-invalid={Boolean(fieldErrors.owner)}
                            className={inputClass('owner')}
                        />
                        {fieldErrors.owner && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.owner}</p>
                        )}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Adresse <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.address}
                            onChange={handleChange('address')}
                            placeholder="12 rue Sainte-Catherine"
                            aria-invalid={Boolean(fieldErrors.address)}
                            className={inputClass('address')}
                        />
                        {fieldErrors.address && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Code postal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={form.zipcode}
                                onChange={handleChange('zipcode')}
                                placeholder="31200"
                                aria-invalid={Boolean(fieldErrors.zipcode)}
                                className={inputClass('zipcode')}
                            />
                            {fieldErrors.zipcode && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.zipcode}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Ville <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={form.city}
                                onChange={handleChange('city')}
                                placeholder="Bordeaux"
                                aria-invalid={Boolean(fieldErrors.city)}
                                className={inputClass('city')}
                            />
                            {fieldErrors.city && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600"
                        >
                            Ajouter le magasin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default function ShopManager(props) {
    const [shops, setShops] = useState(props.shops || []);
    const types = props.types || [];
    const addurl = props.addurl || "";
    const [modalOpen, setModalOpen] = useState(false);

    const handleAddShop = (shop) => { 
        setShops((prev) => [...prev, shop]);
        setModalOpen(false);
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Magasins</h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        {shops.length} magasin{shops.length > 1 ? 's' : ''} référencé{shops.length > 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Ajouter un magasin
                </button>
            </div>

            {shops.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                    <p className="text-sm text-slate-500">Aucun magasin pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {shops.map((shop) => (
                        <ShopCard key={shop.id} shop={shop} />
                    ))}
                </div>
            )}

            <AddShopModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleAddShop}
                types={types}
                addurl={addurl}
            />
        </div>
    );
}
