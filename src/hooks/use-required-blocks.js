/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";

export function useRequiredBlocks(requiredBlocks) {
	const blockNames = useSelect((select) => {
		return select("core/blocks")
			.getBlockTypes()
			.map((each) => each.name);
	}, []);

	const missingBlocks = requiredBlocks.filter(
		(block) => !blockNames.includes(block)
	);

	return {
		missingBlocks,
		hasRequiredBlocks: !missingBlocks.length,
	};
}
