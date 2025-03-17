# WordPress Block Toolkit

A collection of tools for WordPress Gutenberg block building.

## Styles

To include the editor styles, add this to the top of your block's `_editor.scss`:

`@import "~@evermade/wp-block-toolkit/build/index.css";`

## Components

### ImageControl

Simple image upload and replacement flow for managing media.

By setting the `showPreview` prop to `false`, you can build a custom image preview component.

![ImageControl example](assets/ImageControl-screenshot-01.png);

![ImageControl example](assets/ImageControl-screenshot-02.png);

```javascript
<ImageControl
  id={myImageId}
  onSelect={(image) => setAttributes({ myImageId: image.id })}
  onRemove={() => setAttributes({ myImageId: undefined })}
  showPreview={true}
/>
```

### InlineNotice

Compliments the base WordPress notice system by allowing you to show either warning or error level notices inside the editor.

![InlineNotice example](assets/InlineNotice-screenshot-01.png)

```javascript
<InlineNotice status="error">
  <strong>Error: </strong> Lorem ipsum dolor sit amet.
</InlineNotice>
```

### PostControl

Custom ComboboxControl for selecting a single post. Takes an array of post objects and returns and id number on change.

![PostControl example](assets/PostControl-screenshot-01.png)

```javascript
<PostControl
  label="My Label"
  value={mySelectedPostId}
  posts={myPosts}
  onChange={(value) =>
    setAttributes({
      mySelectedPostId: value,
    })
  }
/>
```

### PostSearchControl

For selecting a single post from a large pool of posts. More performant than `PostControl` at the cost of requiring additional user input.

As a further performance optimization, by default shows only 20 results and a "View more results" button. You can configure the number of initial results with the `numOfInitialResults` prop, or disable the optimization completely by setting it to `-1`.

![PostSearchControl example](assets/PostSearchControl-screenshot-01.png)

```javascript
<PostSearchControl
  type="page"
  label="Choose a page"
  placeholder="Search here"
  value={mySelectedPageId}
  onChange={(value) =>
    setAttributes({
      mySelectedPageId: value,
    })
  }
  numOfInitialResults={20}
  filterResults={(results) => {
    // You can modify the search results before returning them.
    return results;
  }}
/>
```

### RequireBlocks

Allows you to only show components if certain blocks are installed and activated in the system. If some of the blocks are missing, displays an error instead using an `InlineNotice`.

![RequireBlocks example](assets/RequireBlocks-screenshot-01.png)

```javascript
<RequireBlocks blocks={["core/paragraph", "my-namespace/my-custom-block"]}>
  <h2>My title</h2>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
  <MyComponent />
</RequireBlocks>
```

### SortablePostsControl

Select and sort multiple posts, with search filtering. Takes an array of post objects and returns an array of id numbers on change.

![SortablePostsControl example](assets/SortablePostsControl-screenshot-01.png)

```javascript
<SortablePostsControl
  label={"My Label"}
  posts={myPosts}
  value={mySelectedPosts}
  onChange={(value) =>
    setAttributes({
      mySelectedPosts: value,
    })
  }
/>
```

### SortablePostSearchControl

Select and sort multiple posts, by searching from a large pool of posts. Takes an array of post ids as value and returns the same on change.

![SortablePostsControl example](assets/SortablePostsControl-screenshot-01.png)

```javascript
<SortablePostSearchControl
  type="page"
  label="Choose pages"
  placeholder="Search here"
  value={mySelectedPageIds}
  onChange={(value) =>
    setAttributes({
      mySelectedPageIds: value,
    })
  }
  numOfInitialResults={20}
  filterResults={(results) => {
    // You can modify the search results before returning them.
    return results;
  }}
/>
```

### TaxonomyControl

Similar to the default WordPress category selector, shows a filterable list of checkboxes.

![TaxonomyControl example](assets/TaxonomyControl-screenshot-01.png)

```javascript
<TaxonomyControl
  slug="category"
  label="My Label"
  value={mySelectedTaxonomies}
  onChange={(value) => setAttributes({ mySelectedTaxonomies: value })}
/>
```

## Hooks

### useAllPosts

QoL wrapper for getting all posts of a certain post type, ordered alphabetically by title.

```javascript
const stories = useAllPosts("story");
const contacts = useAllPosts("contact");
```

### useRequiredBlocks

Checks if the listed block names are installed and activated on the site. Also returns the list of missing block names if you wish to list them in an error message for example.

```javascript
const { missingBlocks, hasRequiredBlocks } = useRequiredBlocks([
  "core/paragraph",
  "core/image",
]);
```

### usePost

QoL wrapper for getting a single post entity using a post type and id.

```javascript
const story = usePost("story", 13);
```

### usePostSearch

Similar to `useAllPosts`, except uses a search parameter for the query. Much more performant when dealing with large amounts of content.

It's recommended to debounce the search string, to avoid excessive database queries.

```javascript
const loremIpsumStories = usePostSearch({
  postType: "story",
  search: "lorem ipsum",
});
```

## Utils

Usage:

```
import { utils } from '@evermade/wp-block-toolkit';
```

### utils.postToControlOption

Normalize a WP post to work as a select type control option.

### utils.labelWithCount

Basic label string with count in parenthesis.

### utils.pickImageProps

Pick typical relevant image props from a WordPress MediaUpload object.

## Advanced Examples

### Handling Media Object

If you need more than just the id, you can use the following flow for managing a media object.

In your block's `block.json`, add an object type attribute:

```json
{
  "attributes": {
    "myImage": {
      "type": "object"
    }
  }
}
```

In your block's edit, you'll need to extract the id when rendering the ImageControl component and pick the relevant properties for storage on save.

```javascript
import { ImageControl, utils } from "@evermade/wp-block-toolkit";

export default function Edit({ attributes, setAttributes }) {
  return (
    <ImageControl
      id={attributes.myImage.id}
      onSelect={(image) =>
        setAttributes({
          myImage: utils.pickImageProps(image),
        })
      }
      onRemove={() =>
        setAttributes({
          myImage: undefined,
        })
      }
    />
  );
}
```

## Changelog

### 7.0.0

- Updated npm dependencies
- Introduced `ImageControl` component.
- Exported utils. Added `pickImageProps` util for use with ImageControl component.

### 6.1.0

- Refactored the way textdomain is used and removed config.json.
- Introduced `SortablePostSearchControl`.

### 6.0.0

- Updated npm dependencies

### 5.0.3

- Fixed a rare issue where `PostSearchControl`'s reset button became full width when used inside a medium size `Placeholder` component.

### 5.0.2

- Add support for post status in `PostSearchControl`.

### 5.0.1

- Fixed an issue where `SortablePostsControl` didn't work properly with `setAttributes` of WordPress. Now always returns a sorted list of ids instead of a callback when sorted.

### 5.0.0

- Breaking change: Changed the way `TaxonomyControl` is used. It now takes just the taxonomy slug instead of an array of terms.
- Breaking change: Updated dependencies to the latest versions.

### 4.1.0

- Changed `usePostSearch` to use named arguments.
- Optimized the performance of `PostSearchControl` by limiting the number of initial results.
- `PostSearchControl` now also has a `numOfInitialResults` prop that can be used to configure the optimization or disable it completely with `-1`.

### 4.0.0

- Breaking change: Updated @wordpress/scripts to [25.4.0](https://github.com/WordPress/gutenberg/blob/trunk/packages/scripts/CHANGELOG.md#2540-2023-02-15), which also introduces React 18.
- Changed `react-sortable-hoc` which is no longer maintained and compatible with React 18 to `@dnd-kit/core`.
- Added possibility to filter `PostSearchControl` results via the `filterResults` prop.

### 3.1.1

- Fixed an issue in SortablePostsControl where `undefined` items were being added to SortableList.
- Added `type` as a prop to the example of PostSearchControl.

### 3.1.0

- Introduced a new component: PostSearchControl. It's better suited for choosing a post from a large number of posts than PostControl.
- Introduced two new hooks: usePost and usePostSearch.
- Updated npm dependencies

### 3.0.0

- Breaking change: Updated @wordpress/block-editor to [10.0.0](https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/CHANGELOG.md#1000-2022-09-13)
  - 2 major bumps!
- Updated npm dependencies

### 2.0.0

- Breaking change: Updated @wordpress/scripts to [24.0.0](https://github.com/WordPress/gutenberg/blob/trunk/packages/scripts/CHANGELOG.md#2400-2022-08-24)
  - 4 major bumps!
  - Increased the minimum Node.js version to 14 and npm to 6.14.4
  - Many major dependency bumps
- Updated npm dependencies
- Ran code format
- Fixed a few code lint errors

### 1.0.6

- Fixed padding and margin issues with PostControl's ComboboxControl when used within the editor
- Added a CSS targetable parent to PostControl

### 1.0.5

- Fixed a bug with special characters in TaxonomyControl
- Fixed a bug where TaxonomyControl would crash on a null value

### 1.0.4

- Fixed a class bug in SortablePostsControl component

### 1.0.3

- Updated npm packages
- Fixed incorrect InlineNotice prop in RequireBlocks component

### 1.0.2

- Use raw instead of rendered title to avoid issues with special characters in post control option

### 1.0.1

- Make InlineNotice paddings a bit nicer.

### 1.0.0

- Breaking changes
- Changed InlineNotice `level` prop to `status` to be in line with core Notice component
- In order to support using InlineNotice on server side rendering, moved InlineNotice styles to Sass
- Added size option to InlineNotice

### 0.4.0

- Updated npm packages
- Changed named imports from config.json to default imports, as warned by webpack

### 0.3.0

- Added a safety check around SortablePostsControl's setOptions

### 0.2.0

- Added an safety check around PostControl's setOptions

### 0.1.0

- Initial release

## Development

- Update version in `package.json`
- Commit to master
- Set tag with version number to git
- Create new release in GitHub
- NPM package is automatically published from GitHub
