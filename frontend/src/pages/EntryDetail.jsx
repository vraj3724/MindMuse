import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { format } from 'date-fns';
import { entryService } from '../services/api';

function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        if (!id) {
          throw new Error('No entry ID provided');
        }
        
        const response = await entryService.getById(id);
        if (!response) {
          throw new Error('Entry not found');
        }
        
        setEntry(response);
        console.log("📋 Entry fetched in detail page:", response);
      } catch (error) {
        console.error('Error fetching entry:', error);
        if (error.response?.status === 404) {
          setError('Entry not found. It may have been deleted or you may not have permission to view it.');
        } else if (error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/auth'), 2000);
        } else {
          setError(error.message || 'Failed to load entry. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await entryService.delete(id);
      setDeleteDialogOpen(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError(error.message || 'Failed to delete entry. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      joy: 'success',
      surprise: 'info',
      neutral: 'default',
      sadness: 'error',
      fear: 'warning',
      anger: 'error',
      disgust: 'error'
    };
    return emotionColors[emotion] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!entry) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Entry not found
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            {entry.title || 'Untitled Entry'}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ mr: 2 }}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {format(new Date(entry.date), 'MMMM d, yyyy • h:mm a')}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {entry.content}
          </Typography>
        </Box>

        {entry.mood && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI Analysis
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Overall Mood:
                </Typography>
                <Chip
                  label={`${entry.mood} (${(entry.confidence * 100).toFixed(1)}%)`}
                  color={getMoodColor(entry.mood)}
                  sx={{ mr: 1 }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Primary Emotion:
                </Typography>
                <Chip
                  label={entry.primary_emotion}
                  color={getEmotionColor(entry.primary_emotion)}
                  sx={{ mr: 1 }}
                />
              </Box>
              {entry.secondary_emotions && entry.secondary_emotions.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Other Detected Emotions:
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {entry.secondary_emotions.map((emotion, index) => (
                      <Chip
                        key={index}
                        label={`${emotion.emotion} (${(emotion.score * 100).toFixed(1)}%)`}
                        color={getEmotionColor(emotion.emotion)}
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

{entry.ai_recommendations && (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" gutterBottom>
      AI Recommendations
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
      {entry.ai_recommendations}
    </Typography>
  </Box>
)}
            </Stack>
          </Box>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Entry</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this entry? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default EntryDetail; 