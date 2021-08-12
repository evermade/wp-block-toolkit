/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";

export function useAllPosts(postType) {
	const posts = useSelect(
		(select) =>
			select("core").getEntityRecords("postType", postType, {
				per_page: -1,
				orderby: "title",
				order: "asc",
				status: "publish",
			}),
		[postType]
	);

	return posts;
}
