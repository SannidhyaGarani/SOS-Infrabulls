import React, { useState, useEffect } from 'react';
import { Loader2, ImageOff } from 'lucide-react';
import { getImageViewUrl } from './Firebase/s3UploadService';

const S3Image = ({ src, alt = '', className = '', fallbackClassName = '' }) => {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    if (!src) {
      setUrl(null);
      setLoading(false);
      return;
    }

    getImageViewUrl(src)
      .then((resolved) => {
        if (active) {
          setUrl(resolved);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [src]);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${fallbackClassName || className}`}>
        <ImageOff className="w-6 h-6" />
      </div>
    );
  }

  if (loading || !url) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 ${fallbackClassName || className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return <img src={url} alt={alt} className={className} />;
};

export default S3Image;
