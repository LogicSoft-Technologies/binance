import "./globals.css";

export const metadata = {
  title: "Binance Support Management Tool",
  description: "A tool to assist with Binance support tasks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
