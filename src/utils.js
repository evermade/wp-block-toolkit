/**
 * External dependencies
 */
import pick from "lodash/pick";

export const postToControlOption = (post) => ({
  id: post.id,
  label: post.title.raw,
  value: post.id,
});

export const labelWithCount = (label, count) => {
  if (!count) {
    return label;
  }

  return `${label} (${count})`;
};

export const pickImageProps = (uploadObject, size = "2048x2048") => {
  const image = pick(uploadObject, [
    "alt",
    "id",
    "width",
    "height",
    "url",
    "title",
  ]);

  if (uploadObject?.sizes[size]) {
    image.url = uploadObject.sizes[size].url;
    image.width = uploadObject.sizes[size].width;
    image.height = uploadObject.sizes[size].height;
  }

  return image;
};
