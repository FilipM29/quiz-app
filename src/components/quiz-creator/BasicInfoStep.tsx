import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { QuizBasicInfo } from '../../types/quiz-creation';

interface BasicInfoStepProps {
  basicInfo: QuizBasicInfo;
  onUpdate: (info: QuizBasicInfo) => void;
}

export const BasicInfoStep = ({ basicInfo, onUpdate }: BasicInfoStepProps) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof QuizBasicInfo, value: string) => {
    const updatedInfo = { ...basicInfo, [field]: value };
    onUpdate(updatedInfo);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: keyof QuizBasicInfo, value: string) => {
    let error = '';

    switch (field) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required';
        } else if (value.length < 3) {
          error = 'Title must be at least 3 characters';
        } else if (value.length > 200) {
          error = 'Title must be less than 200 characters';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        } else if (value.length < 10) {
          error = 'Description must be at least 10 characters';
        } else if (value.length > 1000) {
          error = 'Description must be less than 1000 characters';
        }
        break;
      case 'category':
        if (!value) {
          error = 'Category is required';
        }
        break;
      case 'pictureUrl':
        if (value && !isValidUrl(value)) {
          error = 'Please enter a valid URL';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleBlur = (field: keyof QuizBasicInfo) => {
    validateField(field, basicInfo[field] as string);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Basic Quiz Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Start by providing the basic details about your quiz. You can always
        modify these later.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Quiz Title */}
        <TextField
          label="Quiz Title"
          value={basicInfo.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          error={!!errors.title}
          helperText={errors.title || 'Give your quiz an engaging title'}
          fullWidth
          required
          inputProps={{ maxLength: 200 }}
        />

        {/* Quiz Description */}
        <TextField
          label="Quiz Description"
          value={basicInfo.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          error={!!errors.description}
          helperText={errors.description || 'Describe what your quiz is about'}
          fullWidth
          required
          multiline
          rows={3}
          inputProps={{ maxLength: 1000 }}
        />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Category */}
          <FormControl sx={{ minWidth: 200 }} error={!!errors.category}>
            <InputLabel>Category *</InputLabel>
            <Select
              value={basicInfo.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              label="Category *"
              disabled={categoriesLoading}>
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.category}
              </Typography>
            )}
          </FormControl>

          {/* Quiz Type */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Quiz Type</InputLabel>
            <Select
              value={basicInfo.quizType}
              onChange={(e) => handleChange('quizType', e.target.value)}
              label="Quiz Type">
              <MenuItem value="SLIDES">Slides</MenuItem>
            </Select>
          </FormControl>

          {/* Difficulty */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={basicInfo.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              label="Difficulty">
              <MenuItem value="EASY">Easy</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HARD">Hard</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Cover Image URL */}
        <TextField
          label="Cover Image URL (Optional)"
          value={basicInfo.pictureUrl || ''}
          onChange={(e) => handleChange('pictureUrl', e.target.value)}
          onBlur={() => handleBlur('pictureUrl')}
          error={!!errors.pictureUrl}
          helperText={
            errors.pictureUrl ||
            'Add a cover image to make your quiz more appealing'
          }
          fullWidth
          placeholder="https://example.com/image.jpg"
        />

        {/* Image Preview */}
        {basicInfo.pictureUrl && !errors.pictureUrl && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Preview:
            </Typography>
            <Box
              component="img"
              src={basicInfo.pictureUrl}
              alt="Quiz cover preview"
              sx={{
                maxWidth: '100%',
                maxHeight: 200,
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
              onError={() =>
                setErrors((prev) => ({
                  ...prev,
                  pictureUrl: 'Failed to load image'
                }))
              }
            />
          </Box>
        )}

        {/* Visibility Setting */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Quiz Visibility
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={basicInfo.quizVisibility === 'PUBLIC'}
                onChange={(e) =>
                  handleChange(
                    'quizVisibility',
                    e.target.checked ? 'PUBLIC' : 'PRIVATE'
                  )
                }
              />
            }
            label={
              basicInfo.quizVisibility === 'PUBLIC'
                ? 'Public (Anyone can find and play)'
                : 'Private (Only you can access)'
            }
          />
        </Box>

        {/* File Upload Helper */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Tip:</strong> For best results, use images that are 16:9
            aspect ratio (e.g., 1920x1080px). You can upload images to services
            like Imgur, Cloudinary, or Google Drive and use the public URL.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};
