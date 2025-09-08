import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import logger from './utils/logger';

const theme = createTheme({});

function App() {
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [longUrl, setLongUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShortenUrl = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    if (!longUrl) {
      setError('Original URL is required.');
      setIsLoading(false);
      logger.error('Attempted to shorten URL without a valid URL.', 'shortener-form');
      return;
    }

    // Validate validity input
    const validityInMinutes = validity ? parseInt(validity, 10) : 30;
    if (isNaN(validityInMinutes)) {
      setError('Validity must be a number in minutes.');
      setIsLoading(false);
      logger.error('Invalid validity input.', 'shortener-form');
      return;
    }

    try {
      const payload = {
        longUrl: longUrl,
        validity: validityInMinutes,
      };
      if (customCode) {
        payload.customCode = customCode;
      }

      const response = await fetch('http://localhost:4000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to shorten URL on the server.');
      }

      const newShortenedUrl = {
        id: Date.now(),
        original: result.longUrl,
        shortened: result.shortUrl,
        validity: result.validity || validityInMinutes,
      };

      setShortenedUrls([...shortenedUrls, newShortenedUrl]);
      setLongUrl('');
      setValidity('');
      setCustomCode('');

      logger.info('URL shortened successfully.', 'shortener-form');

    } catch (err) {
      setError(`An error occurred: ${err.message}`);
      logger.error(`An error occurred: ${err.message}`, 'shortener-form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            React URL Shortener
          </Typography>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Shorten a URL
            </Typography>
            <Box component="form" onSubmit={handleShortenUrl}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Original URL"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Validity (in minutes)"
                    type="number"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    placeholder="30"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode (Optional)"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                  />
                </Grid>
                {error && (
                  <Grid item xs={12}>
                    <Typography color="error">{error}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Shorten URL'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Shortened Links
            </Typography>
            {shortenedUrls.length === 0 ? (
              <Typography color="text.secondary">No links shortened yet.</Typography>
            ) : (
              <Grid container spacing={2}>
                {shortenedUrls.map((link) => (
                  <Grid item xs={12} key={link.id}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        **Short Link:**{' '}
                        <a href={link.shortened} target="_blank" rel="noopener noreferrer">
                          {link.shortened}
                        </a>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        **Original URL:** {link.original}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        **Validity:** {link.validity} minutes
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;