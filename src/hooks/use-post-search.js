/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";

/**
 * Constants
 */
const MINIMUM_SEARCH_LENGTH = 3;

export function usePostSearch(postType = "post", search = "") {
	const posts = useSelect(
		(select) => {
			if (search.length < MINIMUM_SEARCH_LENGTH) {
				return [];
			}

			return select("core").getEntityRecords("postType", postType, {
				per_page: -1,
				orderby: "title",
				order: "asc",
				status: "publish",
				search,
			});
		},
		[postType, search]
	);

	return posts;
}
