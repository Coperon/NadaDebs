import React, { useEffect } from 'react';

const LinkComponent = () => {
  const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL
  useEffect(() => {
    window.open(previewUrl, '_blank');
    // silently go back to /structure
    window.history.back()
  }, []); // The empty array ensures this effect runs only once after the initial render

  return null; // This component does not render anything
};

export default LinkComponent;