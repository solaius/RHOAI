import * as React from 'react';

interface AIAssetEndpointsIconProps {
  /** Whether to include the background styling */
  withBackground?: boolean;
  /** Custom size for the icon (default: 32px) */
  size?: number;
  /** Custom background color (overrides CSS variable) */
  backgroundColor?: string;
  /** Additional CSS class name */
  className?: string;
}

export const AIAssetEndpointsIcon: React.FunctionComponent<AIAssetEndpointsIconProps> = ({
  withBackground = false,
  size = 32,
  backgroundColor,
  className = '',
}) => {
  const iconSvg = (
    <svg
      className={`pf-v6-svg ${!withBackground ? className : ''}`}
      viewBox="0 0 36 36"
      fill="currentColor"
      aria-hidden="true"
      role="img"
      width="1em"
      height="1em"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <g>
        <path d="M18,18.622A4.622,4.622,0,1,0,13.378,14,4.627,4.627,0,0,0,18,18.622Zm0-7.994A3.372,3.372,0,1,1,14.628,14,3.376,3.376,0,0,1,18,10.628Z" />
        <path d="M17.558,27.17a.625.625,0,0,0,.884,0l6.365-6.364a9.626,9.626,0,1,0-13.614,0ZM12.078,8.078A8.375,8.375,0,0,1,23.922,19.922L18,25.844l-5.922-5.922A8.383,8.383,0,0,1,12.078,8.078Z" />
        <path d="M31,30.375H5a.625.625,0,0,0,0,1.25H31a.625.625,0,0,0,0-1.25Z" />
      </g>
    </svg>
  );

  if (withBackground) {
    const containerSize = size + 8;
    const backgroundStyle: React.CSSProperties = {
      background: backgroundColor || 'var(--ai-development--BackgroundColor)',
      borderRadius: '20px',
      padding: '4px',
      width: `${containerSize}px`,
      height: `${containerSize}px`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <div style={backgroundStyle} className={className}>
        {iconSvg}
      </div>
    );
  }

  return iconSvg;
};

