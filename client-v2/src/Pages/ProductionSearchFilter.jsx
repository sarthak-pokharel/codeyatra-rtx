import { Box, TextField, InputAdornment, IconButton, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Nepal districts list
const districts = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", 
  "Bara", "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", 
  "Dang", "Darchula", "Dhading", "Dhankuta", "Dhanusa", "Dolakha", "Dolpa", 
  "Doti", "Gorkha", "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla", 
  "Kailali", "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu", 
  "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung", "Mahottari", "Makwanpur", 
  "Manang", "Morang", "Mugu", "Mustang", "Myagdi", "Nawalparasi", "Nuwakot", 
  "Okhaldhunga", "Palpa", "Panchthar", "Parbat", "Parsa", "Pyuthan", "Ramechhap", 
  "Rasuwa", "Rautahat", "Rolpa", "Rukum", "Rupandehi", "Salyan", "Sankhuwasabha", 
  "Saptari", "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu", 
  "Sunsari", "Surkhet", "Syangja", "Tanahu", "Taplejung", "Terhathum", "Udayapur"
];

export default function ProductionSearchFilters({ onSearch, searchTerm, onDistrictChange, district }) {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        sx={{ flex: 2 }}
        variant="outlined"
        placeholder="Search by item name or description..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          )
        }}
      />
      <TextField
        sx={{ flex: 1 }}
        select
        label="District"
        value={district}
        onChange={(e) => onDistrictChange(e.target.value)}
        variant="outlined"
      >
        <MenuItem value="">All Districts</MenuItem>
        {districts.map((dist) => (
          <MenuItem key={dist} value={dist}>
            {dist}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}