import { Box, Typography, Paper, Skeleton, LinearProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { _hostname } from '../apiRoutes';

export default function ProductionStatsPanel() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(_hostname+'/api/production-stats?limit=5');
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

  if (error) {
    console.log(error);
    return (
      <Paper sx={{ p: 2, bgcolor: 'error.lighter' }}>
        <Typography color="error" variant="body2">
          Error loading stats
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        p: 2,
        position: 'sticky',
        top: 16,
        maxHeight: 'calc(100vh - 32px)',
        overflowY: 'auto',
        border: '1px solid #333',
      }}
      elevation={0}
    >
      <Typography variant="h6" gutterBottom>
        Top Production Items
      </Typography>
      
      {loading ? (
        [...Array(5)].map((_, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        ))
      ) : (
        stats.map((item,i) => (
          <Box key={item.rank} sx={{ mb: 2, pb: 2, borderBottom: i==stats.length-1?"":'1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1
                }}
              >
                {item.rank}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                {item.item_name}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {item.total_monthly_demand.toLocaleString()} kg/month
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.producer_count} producer{item.producer_count !== 1 ? 's' : ''}
            </Typography>
          </Box>
        ))
      )}
    </Paper>
  );
}

