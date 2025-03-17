export const Image = ({
  id,
  url,
  alt,
  width,
  height,
  title,
  loading = "lazy",
  ...rest
}) => {
  return (
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      title={title}
      loading={loading}
      className={`wp-image-${id}`}
      {...rest}
    />
  );
};

export default Image;
