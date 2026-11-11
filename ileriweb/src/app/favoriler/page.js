"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaArrowLeft, FaTrash, FaCartPlus } from "react-icons/fa6";

export default function FavorilerSayfasi() {
  const [favoriler, setFavoriler] = useState([]);

  useEffect(() => {
    const kayitliFavs = JSON.parse(localStorage.getItem("gusto_favoriler")) || [];
    setFavoriler(kayitliFavs);
  }, []);

  const favoriSil = (id) => {
    const yeniFavs = favoriler.filter(item => item.id !== id);
    setFavoriler(yeniFavs);
    localStorage.setItem("gusto_favoriler", JSON.stringify(yeniFavs));
  };

  const sepeteEkle = (yemek, e) => {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    const mevcutSepet = JSON.parse(localStorage.getItem("gusto_sepet")) || [];
    const yeniSepet = [...mevcutSepet, yemek];
    localStorage.setItem("gusto_sepet", JSON.stringify(yeniSepet));
    alert(`${yemek.isim} sepete eklendi!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <FaHeart className="text-red-500" /> Favori Lezzetlerim
          </h1>
          <Link href="/urunler" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2">
            <FaArrowLeft /> Alışverişe Devam Et
          </Link>
        </div>

        {favoriler.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-xl text-gray-500 font-medium mb-4">Favori listeniz henüz boş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriler.map((yemek) => (
              <div key={yemek.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                <div className="h-48 relative overflow-hidden">
                  <img src={yemek.image} alt={yemek.isim} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <button onClick={() => favoriSil(yemek.id)} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow text-red-500 hover:text-red-700 transition z-10"><FaTrash size={14}/></button>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{yemek.isim}</h3>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span className="font-extrabold text-lg text-gray-800">{Math.floor(yemek.id * 3 + 80)} ₺</span>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => sepeteEkle(yemek, e)} className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition" title="Sepete Ekle">
                        <FaCartPlus size={14} />
                      </button>
                      <Link href={`/urunler/${yemek.id}`} className="text-orange-600 bg-orange-50 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-100 transition">İncele</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}