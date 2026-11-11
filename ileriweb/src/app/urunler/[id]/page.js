"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { FaClock, FaFire, FaStar, FaHeart, FaCartPlus } from "react-icons/fa6";

export default function UrunDetay() {
  const params = useParams();
  const [yemek, setYemek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function veriCek() {
      if (!params?.id) return;
      const { data } = await supabase
        .from("product2")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (data) setYemek(data);
      setLoading(false);
    }

    async function oturumKontrol() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    }

    veriCek();
    oturumKontrol();
  }, [params, supabase]);

  const sepeteEkle = () => {
    const mevcutSepet = JSON.parse(localStorage.getItem("gusto_sepet")) || [];
    const yeniSepet = [...mevcutSepet, yemek];
    localStorage.setItem("gusto_sepet", JSON.stringify(yeniSepet));
    alert(`${yemek.isim} sepete eklendi!`);
  };

  const favoriEkle = () => {
    const mevcutFav = JSON.parse(localStorage.getItem("gusto_favoriler")) || [];
    if (!mevcutFav.some(item => item.id === yemek.id)) {
      const yeniFav = [...mevcutFav, yemek];
      localStorage.setItem("gusto_favoriler", JSON.stringify(yeniFav));
      alert(`${yemek.isim} favorilere eklendi!`);
    } else {
      alert("Bu ürün zaten favorilerinizde ekli!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Yemek hazırlanıyor...</div>;
  if (!yemek) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Yemek bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row mb-8">
          <div className="md:w-1/2 h-[400px]">
            <img src={yemek.image} alt={yemek.isim} className="w-full h-full object-cover" />
          </div>
          
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">{yemek.isim}</h1>
              <div className="flex items-center gap-1 bg-yellow-50 px-4 py-2 rounded-full text-yellow-600 font-bold text-sm">
                <FaStar /> {yemek.rating} <span className="text-gray-400 font-normal ml-1">({yemek.review_count})</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8 border-y border-gray-50 py-4">
              <div className="flex items-center gap-2"><FaClock className="text-gray-400"/> {yemek.prep_time_minutes}dk Hazırlık</div>
              <div className="flex items-center gap-2"><FaClock className="text-orange-400"/> {yemek.cook_time_minutes}dk Pişirme</div>
              <div className="flex items-center gap-2"><FaFire className="text-red-400"/> {yemek.calories_per_serving} Kalori</div>
              <div className="bg-gray-100 px-3 py-1 rounded-full font-medium">{yemek.difficulty}</div>
              <div className="bg-gray-100 px-3 py-1 rounded-full font-medium">{yemek.cuisine} Mutfağı</div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="text-4xl font-black text-orange-600">{Math.floor(yemek.id * 3 + 80)} ₺</div>
              <div className="flex gap-4">
                {user && (
                  <>
                    <button onClick={favoriEkle} className="p-4 bg-white border border-gray-200 rounded-2xl hover:text-red-500 transition shadow-sm text-gray-400" title="Favorilere Ekle">
                      <FaHeart size={20} />
                    </button>
                    <button onClick={sepeteEkle} className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition shadow-md flex items-center gap-3">
                      <FaCartPlus size={20} /> Sepete Ekle
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Malzemeler</h2>
            <ul className="space-y-3">
              {yemek.ingredients?.map((malzeme, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  {malzeme}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Nasıl Yapılır?</h2>
            <ol className="space-y-6">
              {yemek.instructions?.map((adim, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 mt-1 leading-relaxed">{adim}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
}