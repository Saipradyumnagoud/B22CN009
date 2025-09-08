import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// You will need to import your logging utility here
// import logger from './utils/logger';

const theme = createTheme({
  // You can customize the theme here
});

function App() {
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [longUrl, setLongUrl] = useState('');
  const [validity, setValidity] = useState(30);
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');

  const handleShortenUrl = async (event) => {
    event.preventDefault();
    setError('');

    // --- Client-side validation ---
    if (!longUrl) {
      setError('Original URL is required.');
      return;
    }
    // You can add more robust URL validation here
    // e.g., using a regex or a library like 'is-url'

    // --- API Call Simulation ---
    // In a real application, you would make an API call to your backend here.
    // Replace this simulation with your actual fetch or axios call.
    try {
      const newShortenedUrl = {
        id: Date.now(), // Unique ID
        original: longUrl,
        shortened: `http://localhost:3000/mock_${Math.random().toString(36).substring(2, 7)}`,
        validity: validity,
      };

      // Add the new URL to the list
      setShortenedUrls([...shortenedUrls, newShortenedUrl]);

      // Reset form fields
      setLongUrl('');
      setValidity(30);
      setCustomCode('');

      // Use your custom logger here instead of console.log
      // logger.info('URL shortened successfully.', { original: longUrl, shortened: newShortenedUrl.shortened });

    } catch (err) {
      setError('An error occurred. Please try again.');
      // logger.error('Failed to shorten URL.', { details: err.message });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            React URL Shortener
          </Typography>

          {/* URL Shortening Form */}
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
                  >
                    Shorten URL
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Display of Shortened URLs */}
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