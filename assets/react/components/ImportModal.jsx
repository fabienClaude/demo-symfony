import React, { useState } from 'react';
import axios from 'axios';

const REQUIRED_FIELDS = ['file'];

export default function ImportShopModal({ open, onClose, onSave, templateurl, importurl, shoptypes, csrfToken}) {

    const fileState = { file: null };
    const [form, setForm] = useState(fileState);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formOk, setFormOk] = useState('');

    if (!open) return null;

    const handleClose = () => {
        onClose();
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

    const handleFileChange = (field) => (e) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            const isCSV = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
            if (!isCSV) {
                setFieldErrors((prev) => ({ ...prev, [field]: 'Le fichier doit être un CSV.' }));
                e.target.value = '';
                setForm((f) => ({ ...f, [field]: null }));
                return;
            }
        }

        setForm((f) => ({ ...f, [field]: file }));
        // Efface l'erreur du champ dès que l'utilisateur corrige
        setFieldErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
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

        const formData = new FormData();
        formData.append('file', form.file);
        formData.append('_token', csrfToken);

        try {
            const response = await axios.post(importurl, formData);
            onSave();
            setForm(fileState);
            setFormOk(response?.data?.message || 'Import en cours de traitement');
            setFieldErrors({});
            setLoading(false);
        } catch (error) {
            setFormError(error.response?.data?.message || 'Erreur lors de l\'import.');
            setLoading(false);
        }
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
                            Importer des magasins
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Choissisez le fichier à importer. La structure doit être conforme au modèle.
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
                <div  className="flex items-start justify-between">
                    <a href={templateurl} className="mt-1 text-sm text-slate-500">
                       Télécharger le modèle
                    </a>
                </div>
                <div  className="flex items-start justify-between">
                    <a href={shoptypes} className="mt-1 text-sm text-slate-500">
                       Liste des types de magasins disponibles
                    </a>
                </div>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">                
                            Fichier <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            required
                            onChange={handleFileChange('file')}
                            aria-invalid={Boolean(fieldErrors.file)}
                            className={inputClass('file')}
                            accept=".csv,text/csv"
                        />
                        
                        {fieldErrors.file && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.file}</p>
                        )}
                    </div>
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
                            {loading ? 'Import en cours...' : 'Importer les magasins'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}