import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function ProductionSearchFilters({ onSearch, searchTerm, onFilterChange }) {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        fullWidth
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
    </Box>
  );
}