import { useCallback, useState } from 'react';

/**
 * Imagem com skeleton shimmer: wrapper com aspect-ratio fixo (sem CLS),
 * loading lazy e fade-in quando carrega. Com effects.skeleton=false fica só o fade.
 */
export default function SmartImage({ src, alt, width, height, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useCallback((img) => { if (img?.complete && img.naturalWidth) setLoaded(true); }, []);
  return (
    <span className={`smart-img ${loaded ? 'is-loaded' : 'skel'} ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <img ref={ref} src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} />
    </span>
  );
}
