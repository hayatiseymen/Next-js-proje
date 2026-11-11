"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { FaStar, FaHeart, FaCartPlus } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

function UrunlerIcerik() {
  const [tumYemekler, setTumYemekler] = useState([]);
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const aramaKelimesi = searchParams.get("q")?.toLowerCase() || "";
  const supabase = createClient();

  useEffect(() => {
    async function veriCek() {
      const { data } = await supabase.from("product2").select("*");
      if (data) setTumYemekler(data);
    }
    
    async function oturumKontrol() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    }

    veriCek();
    oturumKontrol();
  }, [supabase]);

  const sepeteEkle = (yemek, e) => {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    const mevcutSepet = JSON.parse(localStorage.getItem("gusto_sepet")) || [];
    const yeniSepet = [...mevcutSepet, yemek];
    localStorage.setItem("gusto_sepet", JSON.stringify(yeniSepet));
    alert(`${yemek.isim} sepete eklendi!`);
  };

  const favoriEkle = (yemek, e) => {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    const mevcutFav = JSON.parse(localStorage.getItem("gusto_favoriler")) || [];
    if (!mevcutFav.some(item => item.id === yemek.id)) {
      const yeniFav = [...mevcutFav, yemek];
      localStorage.setItem("gusto_favoriler", JSON.stringify(yeniFav));
      alert(`${yemek.isim} favorilere eklendi!`);
    } else {
      alert("Bu ürün zaten favorilerinizde ekli!");
    }
  };

  const filtrelenmisYemekler = tumYemekler.filter((yemek) =>
    yemek.isim.toLowerCase().includes(aramaKelimesi)
  );

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} />);
    }
    return stars;
  };

  return (
    <>
      <div className="flex justify-between items-end mb-8 border-b pb-4">
         <h1 className="text-3xl font-bold text-gray-800">
           {aramaKelimesi ? `"${aramaKelimesi}" Sonuçları` : "Tüm Menü"}
         </h1>
         <span className="text-gray-500 font-medium">{filtrelenmisYemekler.length} ürün bulundu</span>
      </div>
      
      {tumYemekler.length === 0 ? (
        <div className="text-center py-10 font-medium text-gray-500">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtrelenmisYemekler.map((yemek) => (
            <div key={yemek.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group">
              <div className="h-48 relative overflow-hidden">
                 <img src={yemek.image} alt={yemek.isim} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                {user && (
                  <button onClick={(e) => favoriEkle(yemek, e)} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:text-red-500 transition text-gray-400 z-10"><FaHeart size={14}/></button>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight line-clamp-1">{yemek.isim}</h3>
                  <div className="flex items-center gap-1 text-[10px] mb-3">
                     {renderStars(yemek.rating)} <span className="text-gray-400 ml-1">({yemek.review_count})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-4 border-t border-gray-50">
                  <span className="font-extrabold text-lg text-gray-800">{Math.floor(yemek.id * 3 + 80)} ₺</span>
                  <div className="flex items-center gap-2">
                    {user && (
                      <button onClick={(e) => sepeteEkle(yemek, e)} className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition" title="Sepete Ekle"><FaCartPlus size={14} /></button>
                    )}
                    <Link href={`/urunler/${yemek.id}`} className="text-orange-600 bg-orange-50 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-100 transition">İncele</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function UrunlerSayfasi() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-10">Yükleniyor...</div>}>
          <UrunlerIcerik />
        </Suspense>
      </div>
    </div>
  );
}