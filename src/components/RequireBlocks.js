/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

/**
 * Internal dependencies
 */
import InlineNotice from "./InlineNotice";
import { useRequiredBlocks } from "../hooks/use-required-blocks";

const RequireBlocks = ({ children, blocks }) => {
	const { hasRequiredBlocks, missingBlocks } = useRequiredBlocks(blocks);

	return (
		<Fragment>
			{hasRequiredBlocks ? (
				children
			) : (
				<InlineNotice status="error">
					{__(
						"Couldn't find all the required blocks. Please install and activate the following blocks: ",
						"wp-block-toolkit",
					)}
					<strong>{missingBlocks.join(", ")}</strong>
				</InlineNotice>
			)}
		</Fragment>
	);
};

export default RequireBlocks;
