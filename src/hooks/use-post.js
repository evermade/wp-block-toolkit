/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";

export function usePost(postType, id) {
	const post = useSelect(
		(select) => {
			if (!id) {
				return null;
			}

			return select("core").getEntityRecord("postType", postType, id);
		},
		[id]
	);

	return post;
}
