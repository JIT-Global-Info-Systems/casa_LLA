// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
 
// const DateFilter = ({
//   startDate,
//   endDate,
//   onDateChange,
//   className = "",
//   showLabels = true
// }) => {
//   const [localStartDate, setLocalStartDate] = useState(startDate || "");
//   const [localEndDate, setLocalEndDate] = useState(endDate || "");
 
//   // Get today's date in YYYY-MM-DD format
//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };
 
//   const maxDate = getTodayDate();
 
//   // Get the minimum of two date strings (earlier date)
//   const getMinDate = (date1, date2) => {
//     if (!date1) return date2;
//     if (!date2) return date1;
//     return date1 < date2 ? date1 : date2;
//   };
 
//   // Update local state when props change
//   useEffect(() => {
//     if (startDate !== undefined) setLocalStartDate(startDate);
//     if (endDate !== undefined) setLocalEndDate(endDate);
//   }, [startDate, endDate]);

//   const handleStartDateChange = (e) => {
//     const value = e.target.value;

//     // Validation: If end date exists, start date should not be after end date
//     if (localEndDate && value && new Date(value) > new Date(localEndDate)) {
//       return; // Prevent setting start date after end date
//     }

//     setLocalStartDate(value);
//     if (onDateChange) {
//       onDateChange({ startDate: value, endDate: localEndDate });
//     }
//   };

//   const handleEndDateChange = (e) => {
//     const value = e.target.value;

//     // Validation: If start date exists, end date should not be before start date
//     if (localStartDate && value && new Date(value) < new Date(localStartDate)) {
//       return; // Prevent setting end date before start date
//     }

//     setLocalEndDate(value);
//     if (onDateChange) {
//       onDateChange({ startDate: localStartDate, endDate: value });
//     }
//   };

//   return (
//     <div className={`flex items-center gap-3 ${className}`}>
//       <div className="flex items-center gap-2">
//         <div className="flex flex-col gap-1">
//           {showLabels && (
//             <Label htmlFor="start-date" className="text-xs text-slate-500 whitespace-nowrap">
//               Start Date
//             </Label>
//           )}
//           <Input
//             id="start-date"
//             type="date"
//             value={localStartDate}
//             onChange={handleStartDateChange}
//             max={localEndDate ? getMinDate(localEndDate, maxDate) : maxDate}
//             className="h-9 w-[140px] text-sm"
//           />
//         </div>
//         {/* <span className="text-slate-400">–</span> */}
//         <div className="flex flex-col gap-1">
//           {showLabels && (
//             <Label htmlFor="end-date" className="text-xs text-slate-500 whitespace-nowrap">
//               End Date
//             </Label>
//           )}
//           <Input
//             id="end-date"
//             type="date"
//             value={localEndDate}
//             onChange={handleEndDateChange}
//             min={localStartDate || undefined}
//             max={maxDate}
//             className="h-9 w-[140px] text-sm"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default DateFilter;
 
 

// 'use client'
 
import { useState } from 'react'
import { Calendar } from '@/components/ui/calender'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
 
const DateFilter = ({
  startDate,
  endDate,
  onDateChange,
  className = "",
}) => {
  const [dateRange, setDateRange] = useState(() => {
    if (startDate && endDate) {
      return {
        from: new Date(startDate),
        to: new Date(endDate)
      };
    }
    return {
      from: new Date(2025, 5, 4),
      to: new Date(2025, 5, 17)
    };
  });
 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
 
  const handleDateSelect = (newRange) => {
    console.log('Date selected:', newRange);
    setDateRange(newRange);
    if (onDateChange && newRange) {
      const formattedDates = {
        startDate: newRange.from ? newRange.from.toISOString().split('T')[0] : '',
        endDate: newRange.to ? newRange.to.toISOString().split('T')[0] : ''
      };
      onDateChange(formattedDates);
    }
    // Close calendar after selection
    setIsCalendarOpen(false);
  };
 
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
 
  const formatDateDisplay = () => {
    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
    } else if (dateRange.from) {
      return dateRange.from.toLocaleDateString();
    }
    return 'Select date range';
  };
 
  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={toggleCalendar}
        className="w-60 justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formatDateDisplay()}
      </Button>
     
      {isCalendarOpen && (
        <div className="absolute top-full mt-1 z-50 bg-white border rounded-lg shadow-lg">
          <Calendar
            mode='range'
            selected={dateRange}
            defaultMonth={dateRange?.from}
            onSelect={handleDateSelect}
            className='rounded-lg border w-60 shadow-md !bg-white [&[data-slot=card-content]]:!bg-white [&[data-slot=popover-content]]:!bg-white'
          />
        </div>
      )}
    </div>
  );
};
 
export default DateFilter;
 