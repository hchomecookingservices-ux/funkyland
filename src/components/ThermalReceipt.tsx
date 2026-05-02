import React from 'react';
import { Invoice } from '../types';
import { Receipt } from 'lucide-react';
import { usePlayZone } from '../hooks/usePlayZone';

interface ThermalReceiptProps {
  invoice: Invoice | null;
}

export default function ThermalReceipt({ invoice }: ThermalReceiptProps) {
  const { businessProfile } = usePlayZone();
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  // Helper to find specific costs for the receipt layout
  const planItem = invoice.items.find(i => i.type === 'service');
  const smallSocks = invoice.items.find(i => i.id === 'SOCKS-S');
  const mediumSocks = invoice.items.find(i => i.id === 'SOCKS-M');
  const socksCost = (smallSocks?.amount || 0) + (mediumSocks?.amount || 0);

  // Categorize GST for breakdown
  const gstBreakdown = invoice.items.reduce((acc, item) => {
    const key = `GST @${item.gstSlab}% (${item.type === 'service' ? 'Plan' : 'Socks'})`;
    const itemGst = item.amount - (item.amount / (1 + item.gstSlab / 100));
    acc[key] = (acc[key] || 0) + itemGst;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white p-4 w-full max-w-[80mm] mx-auto text-slate-900 font-mono text-[9px] print:p-0 print:m-0 print:w-full">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100% !important;
            padding: 10mm;
            background: white !important;
          }
          .no-print { display: none !important; }
        }
      `}} />
      
      <div className="print-area space-y-3">
        <div className="text-center space-y-1">
          <div className="flex justify-center mb-1">
             <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
               {businessProfile.logo.startsWith('data:image') ? (
                 <img src={businessProfile.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
               ) : (
                 <div className="text-2xl">{businessProfile.logo}</div>
               )}
             </div>
          </div>
          <h1 className="text-lg font-black leading-none">{businessProfile.name}</h1>
          <p className="font-bold text-[8px]">{businessProfile.subName}</p>
          <p className="text-[7px] italic">{businessProfile.unitName}</p>
          <p className="leading-tight text-[7px] max-w-[150px] mx-auto">{businessProfile.address}</p>
          <p className="font-bold mt-1 text-[8px]">GST No: {businessProfile.gstNo}</p>
          <p className="text-[8px]">Mob: {businessProfile.mobile}</p>
        </div>

        <div className="border-t border-slate-300 pt-2 space-y-1">
          <div className="flex justify-between">
            <span>Bill No:</span>
            <span>Date: {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>{invoice.invoiceNumber}</span>
            <span>{new Date(invoice.date).getFullYear()}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer: <span className="font-bold uppercase">{invoice.customerName}</span></span>
            <span>Phone: {invoice.phoneNumber.slice(0,3)}***</span>
          </div>
        </div>

        <div className="border-y border-slate-300 py-1 flex justify-between font-bold uppercase text-[8px]">
          <span>Item</span>
          <span>Price</span>
        </div>

        <div className="space-y-1">
          {planItem && (
            <>
              <div className="flex justify-between">
                <span className="truncate max-w-[150px] font-bold">{planItem.description.split(' (')[0]}</span>
                <span>{(planItem.unitPrice * (1 + planItem.gstSlab/100)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[8px] text-slate-500">
                <span>No of Persons:</span>
                <span>{planItem.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Plan Amount:</span>
                <span className="font-bold">{(planItem.unitPrice * (1 + planItem.gstSlab/100)).toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span>Extra Charges:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between font-bold border-t border-slate-200 pt-1">
            <span>Subtotal:</span>
            <span>{planItem?.amount.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Socks Cost:</span>
            <span>{socksCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 pt-1 space-y-1">
          {Object.entries(gstBreakdown).map(([label, val]) => (
            <div key={label} className="flex justify-between text-[8px]">
              <span>{label}:</span>
              <span>{val.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold">
            <span>Total GST:</span>
            <span>{invoice.totalGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] font-black border-t border-slate-900 pt-1">
            <span>Grand Total:</span>
            <span>{invoice.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[8px]">
            <span>Discount:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Paid Amount:</span>
            <span>{invoice.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600 font-bold text-[8px]">
            <span>Balance:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Payment Mode:</span>
            <span className="font-bold uppercase">{invoice.paymentMode}</span>
          </div>
        </div>

        <div className="flex justify-between font-bold text-[8px] pt-1">
          <span>CGST:</span>
          <span>{(invoice.totalGST / 2).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-[8px]">
          <span>SGST:</span>
          <span>{(invoice.totalGST / 2).toFixed(2)}</span>
        </div>

        <div className="text-center text-[7px] pt-4 border-t border-dashed border-slate-300 space-y-1">
          <p>Thank you for visiting {businessProfile.name}!</p>
          <p>We hope to see you again.</p>
        </div>
      </div>

      <button 
        onClick={handlePrint}
        className="w-full py-4 mt-6 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all no-print flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20"
      >
        <Receipt size={18} />
        PRINT THERMAL RECEIPT
      </button>
    </div>
  );
}
