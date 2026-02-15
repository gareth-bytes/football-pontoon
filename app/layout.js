import '../styles/win95.css';

export const metadata = {
  title: 'Football Pontoon',
  description: 'Pick 4 teams. Count their goals. Get to 21 without going bust!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
