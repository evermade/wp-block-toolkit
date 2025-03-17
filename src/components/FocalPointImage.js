import Image from "./Image";

const FocalPointImage = ({ focalPoint = { x: 0.5, y: 0.5 }, ...props }) => {
  const style = {
    objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
  };

  return <Image {...props} style={style} />;
};

export default FocalPointImage;
