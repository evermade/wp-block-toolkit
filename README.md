# WordPress Block Toolkit

A collection of tools for WordPress Gutenberg block building.

## Styles

To include the editor styles, add this to the top of your block's `_editor.scss`:

`@import "~@evermade/wp-block-toolkit/build/index.css";`

## Components

### InlineNotice

Compliments the base WordPress notice system by allowing you to show either warning or error level notices inside the editor.

![InlineNotice example](assets/InlineNotice-screenshot-01.png)

```javascript
<InlineNotice level="error">
	<strong>Error: </strong> Lorem ipsum dolor sit amet.
</InlineNotice>
```

### PostControl

Custom ComboboxControl for selecting a single post. Takes an array of post objects and returns and id number on change.

![PostControl example](assets/PostControl-screenshot-01.png)

```javascript
<PostControl
	label={"My Label"}
	value={mySelectedPostId}
	posts={myPosts}
	onChange={(value) =>
		setAttributes({
			mySelectedPostId: value,
		})
	}
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

### TaxonomyControl

Similar to the default WordPress category selector, shows a filterable list of checkboxes.

![TaxonomyControl example](assets/TaxonomyControl-screenshot-01.png)

```javascript
<TaxonomyControl
	label={"My Label"}
	value={mySelectedTaxonomies}
	taxonomies={myTaxonomies}
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

## Changelog

### 0.1.0

- Initial release
