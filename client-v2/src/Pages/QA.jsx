import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { postsFetchRoute } from '../apiRoutes';
import { QuestionAnswer, Person, Schedule, Add } from '@mui/icons-material';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Stack,
  Divider,
  Fab
} from '@mui/material';

import { 
  TextField, 
  InputAdornment, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Paper
} from '@mui/material';
import { Search } from '@mui/icons-material';

// import { QuestionAnswer, Person, Schedule } from '@mui/icons-material';
import { getRelativeTimeString } from './toolkit';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}

export function QA() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
const [sortBy, setSortBy] = useState('recent');
const [debouncedSearchTerm] = useDebounce(searchTerm, 500);


  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCardClick = (postId) => {
    navigate(`/dashboard/qa/${postId}`);
  };

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) {
        params.append('search_term', debouncedSearchTerm);
      }
      if (sortBy) {
        params.append('sort_by', sortBy);
      }
  
      const response = await fetch(`${postsFetchRoute}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [debouncedSearchTerm, sortBy]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder="Search questions..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Sort By</InputLabel>
      <Select
        value={sortBy}
        label="Sort By"
        onChange={(e) => setSortBy(e.target.value)}
      >
        <MenuItem value="recent">Most Recent</MenuItem>
        <MenuItem value="title">Title</MenuItem>
        <MenuItem value="replies">Most Replies</MenuItem>
      </Select>
    </FormControl>
  </Box>
</Paper>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Questions & Answers
      </Typography>
      <Stack spacing={1}>
        {posts.map((post) => (
          <Card
            key={post.id}
            onClick={() => handleCardClick(post.id)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 3,
                bgcolor: 'action.hover',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 'medium' }}>
                  {post.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getRelativeTimeString(post.posted_at)}
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 1,
                  fontSize: '0.875rem'
                }}
              >
                {post.description}
              </Typography>
  
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1 }}>
                  {post.keywords.split(',').slice(0, 3).map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword.trim()}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: '20px',
                        '& .MuiChip-label': { 
                          px: 1,
                          fontSize: '0.75rem'
                        }
                      }}
                    />
                  ))}
                  {post.keywords.split(',').length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      +{post.keywords.split(',').length - 3} more
                    </Typography>
                  )}
                </Box>
                
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Person sx={{ fontSize: '0.875rem' }} />
                    <Typography variant="caption">
                      {post.first_name} {post.last_name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <QuestionAnswer sx={{ fontSize: '0.875rem' }} />
                    <Typography variant="caption">
                      {post.reply_count}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
      
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate('/dashboard/qa/new-post')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24
        }}
      >
        <Add />
      </Fab>
    </Container>
  );
}