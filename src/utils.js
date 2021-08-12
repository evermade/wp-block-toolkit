export const arrayMove = (array, from, to) => {
	array = array.slice();
	array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
	return array;
};

export const postToControlOption = (post) => ({
	label: post.title.rendered,
	value: post.id,
});
