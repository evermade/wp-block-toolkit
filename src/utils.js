export const postToControlOption = (post) => ({
	id: post.id,
	label: post.title.raw,
	value: post.id,
});
