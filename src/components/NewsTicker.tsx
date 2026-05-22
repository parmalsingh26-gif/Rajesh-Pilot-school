import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface Ticker {
  id: string;
  text: string;
  isActive: boolean;
}

export default function NewsTicker() {
  const [tickers, setTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    fetch('/api/tickers')
      .then((res) => res.json())
      .then((data) => setTickers(data));
  }, []);

  if (tickers.length === 0) return null;

  return (
    <div className="bg-red-700 text-white flex items-center overflow-hidden h-10 shadow-md">
      <div className="bg-red-800 px-4 h-full flex items-center gap-2 font-bold z-10 shrink-0 uppercase tracking-wider text-sm">
        <Bell size={16} className="animate-pulse" />
        Latest Flashes
      </div>
      <div className="flex-1 overflow-hidden relative h-full">
        <div className="absolute whitespace-nowrap animate-[marquee_30s_linear_infinite] flex items-center h-full">
          {tickers.map((ticker, index) => (
            <span key={ticker.id} className="mx-8 font-medium text-sm">
              {ticker.text}
              {index < tickers.length - 1 && <span className="mx-8 text-red-300">•</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
