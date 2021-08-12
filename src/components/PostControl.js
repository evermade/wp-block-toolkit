/**
 * WordPress dependencies
 */
import { ComboboxControl, Spinner } from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { postToControlOption } from "../utils";

const PostControl = ({ label, posts, value, onChange }) => {
	const [options, setOptions] = useState([]);

	useEffect(() => {
		setOptions(posts.map(postToControlOption));
	}, [posts]);

	if (typeof posts === null) return <Spinner />;

	return (
		<ComboboxControl
			label={label}
			value={value}
			onChange={onChange}
			options={options}
		/>
	);
};

export default PostControl;
