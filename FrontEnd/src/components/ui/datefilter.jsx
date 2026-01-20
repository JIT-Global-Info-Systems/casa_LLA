import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
 
const DateFilter = ({
  startDate,
  endDate,
  onDateChange,
  className = "",
  showLabels = true
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate || "");
  const [localEndDate, setLocalEndDate] = useState(endDate || "");
 
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
 
  const maxDate = getTodayDate();
 
  // Get the minimum of two date strings (earlier date)
  const getMinDate = (date1, date2) => {
    if (!date1) return date2;
    if (!date2) return date1;
    return date1 < date2 ? date1 : date2;
  };
 
  // Update local state when props change
  useEffect(() => {
    if (startDate !== undefined) setLocalStartDate(startDate);
    if (endDate !== undefined) setLocalEndDate(endDate);
  }, [startDate, endDate]);
 
  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setLocalStartDate(value);
    if (onDateChange) {
      onDateChange({ startDate: value, endDate: localEndDate });
    }
  };
 
  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setLocalEndDate(value);
    if (onDateChange) {
      onDateChange({ startDate: localStartDate, endDate: value });
    }
  };
 
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          {showLabels && (
            <Label htmlFor="start-date" className="text-xs text-slate-500 whitespace-nowrap">
              Start Date
            </Label>
          )}
          <Input
            id="start-date"
            type="date"
            value={localStartDate}
            onChange={handleStartDateChange}
            max={localEndDate ? getMinDate(localEndDate, maxDate) : maxDate}
            className="h-9 w-[140px] text-sm"
          />
        </div>
        <span className="text-slate-400">–</span>
        <div className="flex flex-col gap-1">
          {showLabels && (
            <Label htmlFor="end-date" className="text-xs text-slate-500 whitespace-nowrap">
              End Date
            </Label>
          )}
          <Input
            id="end-date"
            type="date"
            value={localEndDate}
            onChange={handleEndDateChange}
            min={localStartDate || undefined}
            max={maxDate}
            className="h-9 w-[140px] text-sm"
          />
        </div>
      </div>
    </div>
  );
};
 
export default DateFilter;
 
 