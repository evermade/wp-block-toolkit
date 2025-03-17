/**
 * WordPress dependecies
 */
import { __ } from "@wordpress/i18n";
import {
  Spinner,
  Button,
  ButtonGroup,
  ResponsiveWrapper,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";

export const ImageControl = ({
  id,
  fallback = __(
    "You don't have permission to upload media.",
    "wp-block-toolkit"
  ),
  onSelect,
  onRemove,
  title = __("Image", "wp-block-toolkit"),
  setLabel = __("Set image", "wp-block-toolkit"),
  replaceLabel = __("Replace image", "wp-block-toolkit"),
  removeLabel = __("Remove image", "wp-block-toolkit"),
  showPreview = true,
  ...rest
}) => {
  const hasId = typeof id !== "undefined" && id !== null;
  const data = useSelect((select) => select("core").getMedia(id), [id]);
  const hasData = data && data.id;
  const isLoading = hasId && !hasData;
  const sizeSlug = data?.media_details?.sizes.medium ? "medium" : "full";
  const mediaDetails = data?.media_details?.sizes[sizeSlug] || {
    source_url: data?.source_url,
    width: data?.media_details?.width,
    height: data?.media_details?.height,
  };

  return (
    <div className="wpbt-image-control">
      <MediaUploadCheck fallback={fallback}>
        <MediaUpload
          title={title}
          onSelect={onSelect}
          value={data?.id}
          allowedTypes={["image"]}
          render={({ open }) => (
            <div className="editor-post-featured-image">
              {!hasId ? (
                <Button
                  className="editor-post-featured-image__toggle"
                  onClick={open}
                >
                  {setLabel}
                </Button>
              ) : (
                <Fragment>
                  {showPreview && (
                    <Button
                      className="editor-post-featured-image__preview"
                      onClick={open}
                      style={{
                        position: "relative",
                        minHeight: 50,
                      }}
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : (
                        <ResponsiveWrapper
                          naturalWidth={mediaDetails?.width}
                          naturalHeight={mediaDetails?.height}
                        >
                          <img src={mediaDetails?.source_url} alt="" />
                        </ResponsiveWrapper>
                      )}
                    </Button>
                  )}

                  <ButtonGroup className="wpbt-image-control__buttons">
                    <Button onClick={open} variant="secondary">
                      {replaceLabel}
                    </Button>
                    <Button onClick={onRemove} variant="link" isDestructive>
                      {removeLabel}
                    </Button>
                  </ButtonGroup>
                </Fragment>
              )}
            </div>
          )}
          {...rest}
        />
      </MediaUploadCheck>
    </div>
  );
};
