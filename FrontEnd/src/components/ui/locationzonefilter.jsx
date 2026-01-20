// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const locations = [
//   { label: "Chennai", value: "chennai" },
//   { label: "Bangalore", value: "bangalore" },
//   { label: "Hyderabad", value: "hyderabad" },
// ];

// const zones = [
//   { label: "North Zone", value: "north" },
//   { label: "South Zone", value: "south" },
//   { label: "East Zone", value: "east" },
//   { label: "West Zone", value: "west" },
// ];

// const LocationZoneFilter = ({ filters, setFilters }) => {
//   return (
//     <div className="flex gap-4">
      
//       {/* Location Filter */}
//       <Select
//         value={filters.location}
//         onValueChange={(value) =>
//           setFilters((prev) => ({ ...prev, location: value }))
//         }
//       >
//         <SelectTrigger className="w-[180px]">
//           <SelectValue placeholder="Select Location" />
//         </SelectTrigger>
//         <SelectContent>
//           {locations.map((loc) => (
//             <SelectItem key={loc.value} value={loc.value}>
//               {loc.label}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Zone Filter */}
//       <Select
//         value={filters.zone}
//         onValueChange={(value) =>
//           setFilters((prev) => ({ ...prev, zone: value }))
//         }
//       >
//         <SelectTrigger className="w-[180px]">
//           <SelectValue placeholder="Select Zone" />
//         </SelectTrigger>
//         <SelectContent>
//           {zones.map((zone) => (
//             <SelectItem key={zone.value} value={zone.value}>
//               {zone.label}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//     </div>
//   );
// };

// export default LocationZoneFilter;
