"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrash, FaArrowLeft, FaBagShopping, FaCircleCheck } from "react-icons/fa6";

export default function SepetSayfasi() {
  const [sepet, setSepet] = useState([]);
  const [siparisOnaylandi, setSiparisOnaylandi] = useState(false);

  useEffect(() => {
    const kayitliSepet = JSON.parse(localStorage.getItem("gusto_sepet")) || [];
    setSepet(kayitliSepet);
  }, []);

  const urunSil = (silinecekIndex) => {
    const yeniSepet = sepet.filter((_, index) => index !== silinecekIndex);
    setSepet(yeniSepet);
    localStorage.setItem("gusto_sepet", JSON.stringify(yeniSepet));
  };

  const siparisiTamamla = () => {
    setSepet([]); 
    localStorage.removeItem("gusto_sepet"); 
    setSiparisOnaylandi(true); 
  };

  // HESAPLAMA GÜNCELLENDİ: Formülümüz her ürün için çalışarak toplam fiyatı buluyor
  const toplamFiyat = sepet.reduce((toplam, item) => toplam + Math.floor(item.id * 3 + 80), 0); 

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <FaBagShopping className="text-orange-600" /> Sepetim
          </h1>
          <Link href="/urunler" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-2">
            <FaArrowLeft /> Alışverişe Devam Et
          </Link>
        </div>

        {siparisOnaylandi ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <FaCircleCheck className="text-green-500 text-7xl mb-6" />
            <h2 className="text-3xl font-black text-gray-800 mb-4">Siparişiniz Alındı!</h2>
            <p className="text-lg text-gray-500 font-medium mb-8 max-w-md">
              Lezzet dolu siparişiniz hazırlanmak üzere mutfağa iletildi. Bizi tercih ettiğiniz için teşekkür ederiz.
            </p>
            <Link href="/urunler" className="inline-block bg-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-md">
              Diğer Lezzetlere Göz At
            </Link>
          </div>
        ) : sepet.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-xl text-gray-500 font-medium mb-4">Sepetinizde henüz ürün bulunmuyor.</p>
            <Link href="/urunler" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-md">
              Menüyü Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {sepet.map((yemek, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                  <img src={yemek.image} alt={yemek.isim} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{yemek.isim}</h3>
                    <p className="text-gray-500 text-sm">{yemek.cuisine} Mutfağı</p>
                    <span className="font-black text-orange-600 text-base">{Math.floor(yemek.id * 3 + 80)} ₺</span>
                  </div>
                  <button onClick={() => urunSil(index)} className="text-gray-400 hover:text-red-500 p-2 transition">
                    <FaTrash size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Sipariş Özeti</h2>
              <div className="flex justify-between mb-2 text-gray-600 font-medium">
                <span>Ara Toplam</span>
                <span>{toplamFiyat} ₺</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-600 font-medium">
                <span>Teslimat</span>
                <span className="text-green-600 font-bold">Ücretsiz</span>
              </div>
              <div className="flex justify-between mb-6 text-lg font-black text-gray-800 border-t pt-4">
                <span>Toplam</span>
                <span className="text-orange-600">{toplamFiyat} ₺</span>
              </div>
              <button onClick={siparisiTamamla} className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 transition shadow-md">
                Siparişi Tamamla
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}