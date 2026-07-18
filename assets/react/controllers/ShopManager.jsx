import React, { useState } from 'react';
import AddShopModal from '../components/ShopModal.jsx';
import ImportShopModal from '../components/ImportModal.jsx';

function ShopCard({ shop }) {
    return (
        <div className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start gap-4">
                <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                        {shop.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">{shop.owner}</p>
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
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="truncate">{shop.zipcode} {shop.city}</span>
                </div>
            </dl>
        </div>
    );
}

export default function ShopManager(props) {
    const [shops, setShops] = useState(props.shops || []);
    const [urls, setUrls] = useState(props.urls || []);
    const types = props.types || [];
    const [modalShopOpen, setModalShopOpen] = useState(false);   
    const [modalImportOpen, setModalImportOpen] = useState(false);    
    const csrfTokenShop = props.csrftokenshop || ""; 
    const csrfTokenImport = props.csrftokenimport || "";
    const handleAddShop = (shop) => { 
        setShops((prev) => [...prev, shop]);
        setModalShopOpen(false);
    };

    const handleImportShop = () => { 
        setModalImportOpen(false);
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
                    onClick={() => setModalImportOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    Importer plusieurs magasins
                </button>
                <button
                    type="button"
                    onClick={() => setModalShopOpen(true)}
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
                open={modalShopOpen}
                onClose={() => setModalShopOpen(false)}
                onSave={handleAddShop}
                types={types}
                addurl={urls.addurl}
                csrfToken={csrfTokenShop}
            />

            <ImportShopModal
                open={modalImportOpen}
                onClose={() => setModalImportOpen(false)}
                onSave={handleImportShop}
                templateurl={urls.templateurl}
                importurl={urls.importurl}
                shoptypes={urls.shoptypes}
                csrfToken={csrfTokenImport}
            />
        </div>
    );
}
