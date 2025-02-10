import { Box, TextField, InputAdornment, IconButton, MenuItem, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { districts } from './districts';

// Nepal districts list



export default function ProductionSearchFilters({ 
  onSearch, 
  searchTerm, 
  onDistrictChange, 
  district,
  setSearchTrigger,
  isSearching = false // Add this prop
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm); // This will now trigger the API call
  };
  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}
    >
      <TextField
        sx={{ flex: 2 }}
        variant="outlined"
        placeholder="Search by item name or description..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value, false)} // Pass false to indicate this is not a final search
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
      <Button
      sx={{ height: "46px"}} 
        variant="contained" 
        type="submit"
        disabled={isSearching}
        startIcon={<SearchIcon />}
        onClick={() => setSearchTrigger(Math.random())}
      >
        Search
      </Button>
    </Box>
  );
}