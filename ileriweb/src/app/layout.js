import './globals.css';
import Navbar from '../component/Navbar';

export const metadata = {
  title: 'İleri Web',
  description: 'Proje',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}