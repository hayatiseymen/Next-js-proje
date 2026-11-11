"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function KayitOl() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleKayit = async (e) => {
    e.preventDefault();
    setHata("");
    
    const { error } = await supabase.auth.signUp({ email, password: sifre });
    
    if (error) {
      setHata(error.message);
    } else {
      // Kayıt olduktan sonra otomatik oturum açmasın diye çıkış yaptırıyoruz
      await supabase.auth.signOut();
      
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      router.push("/giris"); // Giriş sayfasına yönlendiriyor
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-black text-gray-800 mb-2 text-center">Hesap Oluştur</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">GustoFood dünyasına hemen katılın.</p>
        
        {hata && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-medium">{hata}</div>}

        <form onSubmit={handleKayit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">E-POSTA</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="ornek@email.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ŞİFRE</label>
            <input type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-md">Kayıt Ol</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Zaten hesabınız var mı? <Link href="/giris" className="text-orange-600 font-bold hover:underline">Giriş Yap</Link></p>
      </div>
    </div>
  );
}