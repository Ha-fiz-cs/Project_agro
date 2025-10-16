exports.notFound = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  // Handle mongoose cast errors (invalid IDs)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  res.status(500).json({ message: 'Server Error', error: err.message });
};
