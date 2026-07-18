import React, { useState } from 'react';
import axios from 'axios';

const REQUIRED_FIELDS = ['name', 'owner', 'address', 'city', 'zipcode', 'shoptype'];

function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

function FormField ({label, value, onChange, placeholder, errorname,inputClass,inputType, data}) {
    const fieldData = data || [];
    const fieldPlaceholder = placeholder || "";
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">                
                {label} <span className="text-red-500">*</span>
            </label>
            {inputType == "input" && (
                <input
                    type="text"
                    required
                    value={value}
                    onChange={onChange}
                    placeholder={fieldPlaceholder}
                    aria-invalid={Boolean(errorname)}
                    className={inputClass}
                />
            )}
            {inputType == "select" && (
                 <select
                    required
                    value={value}
                    onChange={onChange}
                    aria-invalid={Boolean(errorname)}
                    className={inputClass}
                >
                    <option value="" disabled>
                        Sélectionnez un type
                    </option>
                    {fieldData.map((value) => (
                        <option key={value.id ?? value} value={value.id ?? value}>
                            {value.value ?? value}
                        </option>
                    ))}
                </select>
            )}
            
            {errorname && (
                <p className="mt-1 text-xs text-red-600">{errorname}</p>
            )}
        </div>
    );
}

export default function AddShopModal({ open, onClose, onSave, types, addurl, csrfToken }) {
    const shopState = { name: '', owner: '', address: '', city: '', zipcode: '', shoptype: '' };
    const [form, setForm] = useState(shopState);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formOk, setFormOk] = useState('');

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
            if (!form[field]) {
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
        setFormError('');
        setFormOk('');
        try {
            const response = await axios.post(addurl, { ...form, _token: csrfToken });
            onSave(response?.data?.shop || []);
            setForm(shopState);
            setFormOk(response?.data?.message || 'Magasin ajouté');
            setFieldErrors({});
            setLoading(false);
            await timeout(1000);
        } catch (error) {
            setFormError(error.response?.data?.message || 'Erreur lors de l\'ajout du magasin.');
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
                    <FormField
                        label='Nom du magasin'
                        value={form.name}
                        onChange={handleChange('name')}
                        placeholder="Ex : Épicerie du Marché"
                        errorname={fieldErrors.name}
                        inputClass={inputClass('name')}
                        inputType="input"
                    />
                    <FormField
                        label='Propriétaire du magasin'
                        value={form.owner}
                        onChange={handleChange('owner')}
                        placeholder="Ex : Michel Durand"
                        errorname={fieldErrors.owner}
                        inputClass={inputClass('owner')}
                        inputType="input"
                    />
                    <FormField
                        label='Adresse'
                        value={form.address}
                        onChange={handleChange('address')}
                        placeholder="12 rue Sainte-Catherine"
                        errorname={fieldErrors.address}
                        inputClass={inputClass('address')}
                        inputType="input"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            label='Code postal'
                            value={form.zipcode}
                            onChange={handleChange('zipcode')}
                            placeholder="31200"
                            errorname={fieldErrors.zipcode}
                            inputClass={inputClass('zipcode')}
                            inputType="input"
                        />
                        <FormField
                            label='Ville'
                            value={form.city}
                            onChange={handleChange('city')}
                            placeholder="Bordeaux"
                            errorname={fieldErrors.city}
                            inputClass={inputClass('city')}
                            inputType="input"
                        />
                    </div>
                    <FormField
                        label='Type de magasin'
                        value={form.shoptype}
                        onChange={handleChange('shoptype')}
                        errorname={fieldErrors.shoptype}
                        inputClass={inputClass('shoptype')}
                        inputType="select"
                        data={types}
                    />

                    {formError && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                            {formError}
                        </p>
                    )}

                    {formOk && (
                        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
                            {formOk}
                        </p>
                    )}
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Ajout en cours...' : 'Ajouter le magasin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}