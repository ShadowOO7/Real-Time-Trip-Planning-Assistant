import React from 'react';
import PropTypes from 'prop-types';

export const ErrorDisplay = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="error-display">
      <div className="error-message">
        <h3>Error Occurred</h3>
        <p>{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.string,
  onRetry: PropTypes.func
};