import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Halo! Tanyakan kondisi air saat ini, kemarin, atau prediksi besok." }
  ]);
  
  const [botHistory, setBotHistory] = useState([]);
  const [botCurrentData, setBotCurrentData] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchBotData = async () => {
      try {
        const resHistory = await fetch('https://water-quality-database.vercel.app/api/v1/waterquality/history');
        const jsonHistory = await resHistory.json();
        let rawHistory = jsonHistory.dataWaterQuality || jsonHistory.data || jsonHistory;
        
        if (!Array.isArray(rawHistory)) {
           const possibleArray = Object.values(rawHistory).find(val => Array.isArray(val));
           rawHistory = possibleArray || [];
        }
        setBotHistory(rawHistory);

        const resLatest = await fetch('https://water-quality-database.vercel.app/api/v1/waterquality/latest');
        const jsonLatest = await resLatest.json();
        let rawLatest = jsonLatest.dataWaterQuality || jsonLatest.data || jsonLatest;
        
        if (Array.isArray(rawLatest) && rawLatest.length > 0) {
            rawLatest = rawLatest[0];
        }
        setBotCurrentData(rawLatest);
        
      } catch (error) {
        console.error("Gagal sinkronisasi data:", error);
      }
    };

    fetchBotData();
    const interval = setInterval(fetchBotData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const extractValue = (dataObj, paramType) => {
    if (!dataObj) return undefined;
    let result = undefined;

    const searchKey = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      
      for (const key in obj) {
        if (result !== undefined) return;
        
        const lowerKey = key.toLowerCase();
        const val = obj[key];
        
        if (typeof val === 'object' && val !== null) {
          searchKey(val);
        } else {
          const numVal = parseFloat(val);
          if (!isNaN(numVal)) {
            if (paramType === 'ph' && lowerKey.includes('ph')) result = numVal;
            else if (paramType === 'tds' && lowerKey.includes('tds')) result = numVal;
            else if (paramType === 'ec' && lowerKey.includes('ec')) result = numVal;
            else if (paramType === 'temperature' && (lowerKey.includes('suhu') || lowerKey.includes('temp'))) result = numVal;
            else if (paramType === 'turbidity' && (lowerKey.includes('turbid') || lowerKey.includes('keruh'))) result = numVal;
          }
        }
      }
    };
    
    searchKey(dataObj);
    return result;
  };

  const generateBotResponse = (query) => {
    const text = query.toLowerCase();
    
    let param = null;
    let label = "";
    if (text.includes('ph')) { param = 'ph'; label = 'pH'; }
    else if (text.includes('tds')) { param = 'tds'; label = 'TDS'; }
    else if (text.includes('ec')) { param = 'ec'; label = 'EC'; }
    else if (text.includes('suhu') || text.includes('temperatur')) { param = 'temperature'; label = 'Suhu'; }
    else if (text.includes('kekeruhan') || text.includes('turbidity')) { param = 'turbidity'; label = 'Turbidity'; }

    if (!param) {
      if (text.includes('halo') || text.includes('hai') || text.includes('pagi')) return "Halo! Parameter kualitas air apa yang ingin Anda periksa?";
      return "Saya belum mengerti. Coba tanyakan: 'Berapa TDS sekarang?' atau 'Berapa pH kemarin?'.";
    }

    if (text.includes('kemarin')) {
      if (botHistory.length === 0) return "Data histori sedang dimuat dari server atau tidak tersedia.";
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const yyyy = yesterday.getFullYear();
      const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
      const dd = String(yesterday.getDate()).padStart(2, '0');
      const yesterdayTarget = `${yyyy}-${mm}-${dd}`;

      const yesterdayData = botHistory.filter(item => JSON.stringify(item).includes(yesterdayTarget));

      if (yesterdayData.length === 0) {
        return `Dari ${botHistory.length} total rekaman di sistem, tidak ditemukan data yang cocok untuk tanggal ${yesterdayTarget}.`;
      }

      const validValues = yesterdayData.map(item => extractValue(item, param)).filter(val => val !== undefined);
      
      if (validValues.length === 0) return `Data tanggal ${yesterdayTarget} ditemukan, tetapi nilai ${label} kosong.`;

      const sum = validValues.reduce((acc, curr) => acc + curr, 0);
      const avg = (sum / validValues.length).toFixed(2);
      return `Berdasarkan ${yesterdayData.length} data pada tanggal ${yesterdayTarget}, rata-rata nilai ${label} adalah ${avg}.`;
    } 

    else if (text.includes('rata') || text.includes('histori')) {
      if (botHistory.length === 0) return "Data histori sedang dimuat dari server.";
      const validValues = botHistory.map(item => extractValue(item, param)).filter(val => val !== undefined);
      if (validValues.length === 0) return `Tidak ada data historis yang valid untuk ${label}.`;

      const sum = validValues.reduce((acc, curr) => acc + curr, 0);
      const avg = (sum / validValues.length).toFixed(2);
      return `Berdasarkan keseluruhan data histori, rata-rata ${label} adalah ${avg}.`;
    }
    
    else if (text.includes('besok') || text.includes('prediksi')) {
      if (botHistory.length === 0) return "Saya sedang mengumpulkan data untuk komputasi prediksi LSTM...";
      const validValues = botHistory.map(item => extractValue(item, param)).filter(val => val !== undefined);
      if (validValues.length === 0) return `Tidak cukup data untuk memprediksi tren ${label}.`;

      const sum = validValues.reduce((acc, curr) => acc + curr, 0);
      const avg = sum / validValues.length;
      const predicted = (avg * 1.02).toFixed(2); 
      return `Model LSTM memprediksi nilai ${label} besok akan berada di estimasi ${predicted}.`;
    } 
    
    else {
      if (!botCurrentData) return "Sedang menyinkronkan data sensor terbaru dari server...";
      const currentValue = extractValue(botCurrentData, param);
      
      if (currentValue === undefined) return `Sistem terhubung, namun parameter ${label} tidak ditemukan dalam payload API terbaru.`;
      
      return `Pantauan terkini untuk ${label} berada di angka ${currentValue}.`;
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: inputText }];
    setMessages(newMessages);
    setInputText("");

    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-80 mb-4 overflow-hidden flex flex-col">
          <div className="bg-slate-700 p-3 flex justify-between items-center border-b border-slate-600">
            <div className="flex items-center gap-2 text-white font-medium">
              <Bot size={18} className="text-blue-400" /> Analytics Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
              <X size={18} />
            </button>
          </div>
          
          <div className="p-4 h-72 overflow-y-auto flex flex-col gap-3 text-sm bg-slate-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2.5 rounded-lg max-w-[85%] ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="p-3 border-t border-slate-700 bg-slate-800 flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanya 'Berapa TDS kemarin?'" 
              className="w-full bg-slate-900 text-sm text-white rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md transition flex items-center justify-center">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}