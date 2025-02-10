import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    Stack,
    IconButton
} from '@mui/material';
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';

import { Person, Schedule } from '@mui/icons-material';
import { getRelativeTimeString } from './toolkit';
import { createPostReplyRoute, postReplyFetchRoute, postsFetchRoute } from '../apiRoutes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export function QAThread() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [thread, setThread] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openReplyDialog, setOpenReplyDialog] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openReplyEditDialog, setOpenReplyEditDialog] = useState(false);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editKeywords, setEditKeywords] = useState('');



    useEffect(() => {
        fetchThread();
    }, [id]);
    const handleReturn = () => {
        navigate("/dashboard/qa");
    };
    const fetchThread = async () => {
        try {
            const response = await fetch(`${postsFetchRoute}/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch thread');
            }
            const data = await response.json();
            setThread(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

    if (!thread) {
        return (
            <Box p={4}>
                <Alert severity="info">Thread not found</Alert>
            </Box>
        );
    }

    const handleReplyOpen = () => {
        setOpenReplyDialog(true);
    };

    const handleReplyClose = () => {
        setOpenReplyDialog(false);
        setReplyContent('');
    };

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(createPostReplyRoute, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    of_post: Number(id),
                    token: localStorage.getItem("token"), 
                    content: replyContent.trim()
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to post reply');
            }

            // Refresh thread data to show new reply
            await fetchThread();
            handleReplyClose();
        } catch (error) {
            console.error('Error posting reply:', error);
            setError('Failed to post reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditOpen = () => {
        setEditTitle(post.title);
        setEditDescription(post.description);
        setEditKeywords(post.keywords);
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
        setEditTitle('');
        setEditDescription('');
        setEditKeywords('');
    };

    const handleReplyEditOpen = (reply) => {
        setEditContent(reply.content);
        setEditingReplyId(reply.id);
        setOpenReplyEditDialog(true);
    };

    const handleReplyEditClose = () => {
        setOpenReplyEditDialog(false);
        setEditContent('');
        setEditingReplyId(null);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`${postsFetchRoute}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    keywords: editKeywords,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            await fetchThread();
            handleEditClose();
        } catch (error) {
            console.error('Error updating post:', error);
            setError('Failed to update post');
        }
    };

    const handleReplyEditSubmit = async () => {
        try {
            const response = await fetch(`${postReplyFetchRoute}/${editingReplyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: editContent,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update reply');
            }

            await fetchThread();
            handleReplyEditClose();
        } catch (error) {
            console.error('Error updating reply:', error);
            setError('Failed to update reply');
        }
    };

    const { post, replies } = thread;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => handleReturn()}
        sx={{ mb: 3 }}
      >
        Back to List
      </Button>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {post.title}
                        </Typography>
                        {post.created_by === JSON.parse(localStorage.getItem("user")).id && ( // Replace 1 with actual user ID from auth
                            <IconButton onClick={handleEditOpen} size="small">
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Typography variant="body1" paragraph>
                        {post.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        {post.keywords.split(',').map((keyword, index) => (
                            <Chip
                                key={index}
                                label={keyword.trim()}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                            />
                        ))}
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'text.secondary'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person fontSize="small" />
                            <Typography variant="body2">
                                {post.first_name} {post.last_name}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule fontSize="small" />
                            <Typography variant="body2">
                                {getRelativeTimeString(post.posted_at)}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Replies ({replies.length})
            </Typography>
            <Stack spacing={2}>
                {replies.map((reply) => (
                    <Card key={reply.id} sx={{ bgcolor: 'grey.50' }}>
                        <CardContent>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" paragraph>
                                    {reply.content}
                                </Typography>
                                {reply.replied_by === JSON.parse(localStorage.getItem("user")).id && ( // Replace 1 with actual user ID from auth
                                    <IconButton onClick={() => handleReplyEditOpen(reply)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: 'text.secondary'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person fontSize="small" />
                                    <Typography variant="body2">
                                        {reply.first_name} {reply.last_name}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Schedule fontSize="small" />
                                    <Typography variant="body2">
                                        {getRelativeTimeString(reply.posted_at)}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleReplyOpen}
            >
                <ReplyIcon />
            </Fab>
            <Dialog
                open={openReplyDialog}
                onClose={handleReplyClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Post a Reply</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        placeholder="Write your reply here..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        sx={{ mt: 2 }}
                        disabled={isSubmitting}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReplyClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReplySubmit}
                        variant="contained"
                        disabled={!replyContent.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Posting...' : 'Post Reply'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditDialog}
                onClose={handleEditClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Post</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        sx={{ mb: 2, mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Keywords (comma-separated)"
                        value={editKeywords}
                        onChange={(e) => setEditKeywords(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button
                        onClick={handleEditSubmit}
                        variant="contained"
                        disabled={!editTitle.trim() || !editDescription.trim()}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openReplyEditDialog}
                onClose={handleReplyEditClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Reply</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        placeholder="Edit your reply..."
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReplyEditClose}>Cancel</Button>
                    <Button
                        onClick={handleReplyEditSubmit}
                        variant="contained"
                        disabled={!editContent.trim()}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}