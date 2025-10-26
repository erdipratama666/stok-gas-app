// import React from 'react';
// import { Package, TrendingUp, TrendingDown } from 'lucide-react';

// interface SummaryCardsProps {
//   stokTabungIsi: number;
//   stokTabungKosong: number;
//   riwayat?: any[]; // Opsional jika belum dipakai
// }

// const SummaryCards: React.FC<SummaryCardsProps> = ({ 
//   stokTabungIsi = 0,      // ✅ Default value
//   stokTabungKosong = 0,   // ✅ Default value
//   riwayat = []            // ✅ Default value
// }) => {
//   // ✅ Validasi dan konversi ke number untuk mencegah NaN
//   const tabungIsi = Number(stokTabungIsi) || 0;
//   const tabungKosong = Number(stokTabungKosong) || 0;
//   const totalTabung = tabungIsi + tabungKosong;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//       {/* Total Tabung */}
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-gray-600 font-semibold">Total Tabung</h3>
//           <Package className="text-blue-600" size={32} />
//         </div>
//         <p className="text-4xl font-bold text-gray-800">{totalTabung}</p>
//         <p className="text-sm text-gray-500 mt-2">Tabung keseluruhan</p>
//       </div>

//       {/* Tabung Isi */}
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-gray-600 font-semibold">Tabung Isi</h3>
//           <TrendingUp className="text-green-600" size={32} />
//         </div>
//         <p className="text-4xl font-bold text-green-600">{tabungIsi}</p>
//         <p className="text-sm text-gray-500 mt-2">Siap distribusi</p>
//       </div>

//       {/* Tabung Kosong */}
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-gray-600 font-semibold">Tabung Kosong</h3>
//           <TrendingDown className="text-orange-600" size={32} />
//         </div>
//         <p className="text-4xl font-bold text-orange-600">{tabungKosong}</p>
//         <p className="text-sm text-gray-500 mt-2">Perlu pengisian</p>
//       </div>
//     </div>
//   );
// };

// export default SummaryCards;