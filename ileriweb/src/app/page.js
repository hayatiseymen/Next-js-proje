"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { FaClock, FaStar, FaFire, FaHeart, FaChevronLeft, FaChevronRight, FaCartPlus } from "react-icons/fa6";

export default function Home() {
  const [slaytYemekler, setSlaytYemekler] = useState([]);
  const [vitrinYemekler, setVitrinYemekler] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function veriCek() {
      const { data } = await supabase.from("product2").select("*");
      if (data && data.length > 0) {
        // Slayt için rastgele 6 ürün seçiyoruz (noktalar çok kalabalık olmasın diye)
        const rastgele = [...data].sort(() => 0.5 - Math.random()).slice(0, 6);
        setSlaytYemekler(rastgele);
        const enIyiler = [...data].sort((a, b) => b.rating - a.rating).slice(0, 12);
        setVitrinYemekler(enIyiler);
      }
    }
    
    async function oturumKontrol() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    }

    veriCek();
    oturumKontrol();
  }, [supabase]);

  const sonrakiSlayt = () => {
    setCurrentIndex((prev) => (prev === slaytYemekler.length - 1 ? 0 : prev + 1));
  };

  const oncekiSlayt = () => {
    setCurrentIndex((prev) => (prev === 0 ? slaytYemekler.length - 1 : prev - 1));
  };

  // Otomatik kaydırma (Fare üzerindeyken duraklar)
  useEffect(() => {
    if (slaytYemekler.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      sonrakiSlayt();
    }, 5500);
    return () => clearInterval(interval);
  }, [slaytYemekler, isPaused]);

  const sepeteEkle = (yemek, e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const mevcutSepet = JSON.parse(localStorage.getItem("gusto_sepet")) || [];
    const yeniSepet = [...mevcutSepet, yemek];
    localStorage.setItem("gusto_sepet", JSON.stringify(yeniSepet));
    alert(`${yemek.isim} sepete eklendi!`);
  };

  const favoriEkle = (yemek, e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const mevcutFav = JSON.parse(localStorage.getItem("gusto_favoriler")) || [];
    if (!mevcutFav.some(item => item.id === yemek.id)) {
      const yeniFav = [...mevcutFav, yemek];
      localStorage.setItem("gusto_favoriler", JSON.stringify(yeniFav));
      alert(`${yemek.isim} favorilere eklendi!`);
    } else {
      alert("Bu ürün zaten favorilerinizde ekli!");
    }
  };

  if (slaytYemekler.length === 0) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* KAYMALI SLAYT (CAROUSEL) ALANI */}
        <div 
          className="relative mb-12 rounded-2xl shadow-sm border border-gray-100 overflow-hidden bg-white group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Kaydırıcı Şerit */}
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slaytYemekler.map((item) => (
              <div key={item.id} className="w-full flex-shrink-0 flex flex-col md:flex-row h-auto md:h-[400px]">
                
                {/* Sol Görsel Alanı */}
                <div className="md:w-[45%] h-64 md:h-full relative bg-gray-200">
                  <img src={item.image} alt={item.isim} className="w-full h-full object-cover" />
                </div>

                {/* Sağ İçerik Alanı */}
                <div className="md:w-[55%] p-8 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">{item.isim}</h1>
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full text-yellow-600 font-bold text-sm shrink-0">
                      <FaStar /> {item.rating}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 max-w-md line-clamp-2">
                    Bu lezzetli {item.cuisine} mutfağı tarifi, sadece 25 dakikada servise hazır.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-8 border-y border-gray-100 py-4">
                    <div className="flex items-center gap-2"><FaClock className="text-gray-400"/> {item.prep_time_minutes || "15"}dk Hazırlık</div>
                    <div className="flex items-center gap-2"><FaFire className="text-orange-400"/> {item.calories_per_serving || "300"} cal</div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-3xl font-black text-gray-800">{Math.floor(item.id * 3 + 80)} ₺</div>
                    <div className="flex items-center gap-3">
                      {user && (
                        <>
                          <button onClick={(e) => favoriEkle(item, e)} className="p-3 bg-white border border-gray-200 rounded-xl hover:text-red-500 transition shadow-sm text-gray-400" title="Favorilere Ekle"><FaHeart /></button>
                          <button onClick={(e) => sepeteEkle(item, e)} className="p-3 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition shadow-sm" title="Sepete Ekle"><FaCartPlus size={18} /></button>
                        </>
                      )}
                      <Link href={`/urunler/${item.id}`} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition shadow-md flex items-center gap-2">
                        Tarifi İncele <FaChevronRight className="text-xs"/>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Sağ / Sol Ok Butonları */}
          <button 
            onClick={oncekiSlayt} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md hover:bg-white text-gray-700 hover:text-orange-600 transition opacity-0 group-hover:opacity-100 z-10"
          >
            <FaChevronLeft />
          </button>
          <button 
            onClick={sonrakiSlayt} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-md hover:bg-white text-gray-700 hover:text-orange-600 transition opacity-0 group-hover:opacity-100 z-10"
          >
            <FaChevronRight />
          </button>

          {/* Alt Gösterge Noktaları (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {slaytYemekler.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-6 bg-orange-500" : "w-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ÖNE ÇIKANLAR LİSTESİ */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Öne Çıkan Lezzetler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vitrinYemekler.map((yemek) => (
              <div key={yemek.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group">
                <div className="h-44 relative overflow-hidden">
                  <Link href={`/urunler/${yemek.id}`}>
                    <img src={yemek.image} alt={yemek.isim} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </Link>
                  {user && (
                    <button onClick={(e) => favoriEkle(yemek, e)} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:text-red-500 transition text-gray-400 z-10"><FaHeart size={14}/></button>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">{yemek.isim}</h3>
                    <div className="flex items-center gap-1 text-[10px] mb-3">
                       {renderStars(yemek.rating)} <span className="text-gray-400 ml-1">({yemek.review_count})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                    <span className="font-extrabold text-lg text-gray-800">{Math.floor(yemek.id * 3 + 80)} ₺</span>
                    <div className="flex items-center gap-2">
                       {user && (
                         <button onClick={(e) => sepeteEkle(yemek, e)} className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition" title="Sepete Ekle"><FaCartPlus size={14} /></button>
                       )}
                       <Link href={`/urunler/${yemek.id}`} className="text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-100 transition">İncele</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}