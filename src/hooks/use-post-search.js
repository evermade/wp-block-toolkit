/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";

export function usePostSearch({
	postType = "post",
	search = "",
	minimumLength = 3,
	perPage = 20,
}) {
	const posts = useSelect(
		(select) => {
			if (search.length < minimumLength) {
				return [];
			}

			return select("core").getEntityRecords("postType", postType, {
				per_page: perPage,
				orderby: "title",
				order: "asc",
				status: "publish",
				search,
			});
		},
		[postType, search, minimumLength, perPage]
	);

	return posts;
}
