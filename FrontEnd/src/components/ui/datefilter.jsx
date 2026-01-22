// 'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
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
