"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FaUtensils, FaMagnifyingGlass, FaHouse, FaBox, FaHeart, FaUserPlus, FaArrowRightToBracket, FaCartShopping, FaArrowRightFromBracket } from "react-icons/fa6";

export default function Navbar() {
  const [arama, setArama] = useState("");
  const [user, setUser] = useState(null);
  const [sepetSayisi, setSepetSayisi] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  
  useEffect(() => {
    // Oturum Kontrolü
    async function oturumKontrol() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    }
    oturumKontrol();

    // Sepet Sayısını Anlık Takip Etme
    const sepetKontrol = setInterval(() => {
      const mevcutSepet = JSON.parse(localStorage.getItem("gusto_sepet")) || [];
      setSepetSayisi(mevcutSepet.length);
    }, 500); // Saniyede 2 kez sepeti kontrol eder (anında güncellenmesi için)

    return () => clearInterval(sepetKontrol);
  }, [supabase]);

  const cikisYap = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const aramaYap = (e) => {
    e.preventDefault();
    if (arama.trim()) {
      router.push(`/urunler?q=${arama}`);
    } else {
      router.push(`/urunler`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="flex items-center gap-2 text-orange-600 hover:opacity-80 transition">
            <FaUtensils className="text-2xl" />
            <span className="text-xl font-bold text-gray-800">GustoFood</span>
          </Link>

          <div className="flex-1 max-w-xs mx-8 hidden sm:block">
            <form onSubmit={aramaYap} className="relative flex items-center">
              <FaMagnifyingGlass className="absolute left-3 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Yemek ara..."
                value={arama}
                onChange={(e) => setArama(e.target.value)}
                className="w-full bg-gray-100 border-none text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-orange-500 outline-none block pl-9 pr-3 py-2 transition"
              />
            </form>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
              <FaHouse className="text-xl mb-1" />
              <span className="text-[10px] font-medium">Anasayfa</span>
            </Link>
            <Link href="/urunler" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
              <FaBox className="text-xl mb-1" />
              <span className="text-[10px] font-medium">Ürünler</span>
            </Link>

            {user ? (
              <>
                <Link href="/favoriler" className="flex flex-col items-center text-gray-500 hover:text-red-500 transition">
                  <FaHeart className="text-xl mb-1" />
                  <span className="text-[10px] font-medium">Favoriler</span>
                </Link>
                
                {/* SEPET İKONU VE BALONCUK */}
                <Link href="/sepet" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
                  <div className="relative mb-1">
                    <FaCartShopping className="text-xl" />
                    {sepetSayisi > 0 && (
                      <span className="absolute -top-2 -right-3 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                        {sepetSayisi}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">Sepet</span>
                </Link>

                <button onClick={cikisYap} className="flex flex-col items-center text-gray-500 hover:text-red-600 transition">
                  <FaArrowRightFromBracket className="text-xl mb-1" />
                  <span className="text-[10px] font-medium">Çıkış Yap</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/kayit" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
                  <FaUserPlus className="text-xl mb-1" />
                  <span className="text-[10px] font-medium">Kayıt Ol</span>
                </Link>
                <Link href="/giris" className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition">
                  <FaArrowRightToBracket className="text-xl mb-1" />
                  <span className="text-[10px] font-medium">Giriş Yap</span>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}