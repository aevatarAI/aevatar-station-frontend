import type React from "react";

const NextImage: React.FC<any> = ({
  src,
  alt,
  width,
  height,
  fill,
  className,
  ...props
}) => {
  return (
    // biome-ignore lint/a11y/useAltText: <explanation>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={fill ? { width: "100%", height: "100%" } : undefined}
      {...props}
    />
  );
};

export default NextImage;
