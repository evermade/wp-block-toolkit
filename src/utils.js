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
