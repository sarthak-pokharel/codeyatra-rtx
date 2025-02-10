import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import { businessDemandsStatsRoute } from '../apiRoutes';

export default function BusinessDemandsStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(businessDemandsStatsRoute);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error" variant="body2">
          Error loading stats
        </Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={2}
      sx={{
        p: 2,
        height: '100%',
        backgroundColor: 'background.paper'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
        Top Business Demands
      </Typography>
      <List disablePadding>
        {stats.map((item, index) => (
          <Box key={index}>
            <ListItem 
              disablePadding 
              sx={{ 
                py: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, width: '100%' }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    minWidth: 24,
                    color: index < 3 ? 'primary.main' : 'text.secondary',
                    fontWeight: index < 3 ? 'bold' : 'regular'
                  }}
                >
                  #{item.rank}
                </Typography>
                <ListItemText
                  primary={item.item_name}
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    fontWeight: 'medium'
                  }}
                />
              </Box>
              <Box sx={{ pl: 3, width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Demand: {item.total_monthly_demand} kg/month
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Demands: {item.demand_count}
                </Typography>
                <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {item.demanding_districts.slice(0, 3).map((district, idx) => (
                    <Chip
                      key={idx}
                      label={district}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                  {item.demanding_districts.length > 3 && (
                    <Chip
                      label={`+${item.demanding_districts.length - 3} more`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>
            </ListItem>
            {index < stats.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Paper>
  );
}