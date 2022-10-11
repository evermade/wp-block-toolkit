/**
 * External dependencies
 */
import { useDebounce } from "use-debounce";

/**
 * WordPress dependecies
 */
import { __ } from "@wordpress/i18n";
import { Spinner, BaseControl, Button } from "@wordpress/components";
import { useState, RawHTML } from "@wordpress/element";
import { closeSmall } from "@wordpress/icons";

/**
 * Internal dependencies
 */
import { usePost } from "../hooks/use-post";
import { usePostSearch } from "../hooks/use-post-search";
import config from "../config.json";

const { textdomain } = config;

/**
 * Constants
 */
const SEARCH_DEBOUNCE_DELAY = 500;

const PostSearchControl = ({
	type = "post",
	value = 0,
	onChange,
	placeholder = __("Search", textdomain),
	label = __("Select a post", textdomain),
	inputProps = {},
	...rest
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, SEARCH_DEBOUNCE_DELAY);

	const selected = usePost(type, value);

	const posts = usePostSearch(type, debouncedSearch);

	const onKeyDown = (e) => {
		if (e.key === "Escape") {
			e.preventDefault();
			setIsExpanded(false);
		}
	};

	return (
		<BaseControl
			className="wpbt-post-search-control"
			tabIndex="-1"
			label={label}
			{...rest}
		>
			<div className="wpbt-post-search-control__wrapper" onKeyDown={onKeyDown}>
				<input
					type="text"
					value={isExpanded ? search : selected?.title?.raw || ""}
					onChange={(e) => setSearch(e.currentTarget.value)}
					placeholder={placeholder}
					onFocus={() => setIsExpanded(true)}
					className="wpbt-post-search-control__input"
					{...inputProps}
				/>

				<Button
					className="wpbt-post-search-control__reset"
					icon={closeSmall}
					disabled={!value}
					onClick={() => onChange(null)}
					label={__("Reset")}
				/>
			</div>

			<div className="wpbt-post-search-control__options">
				{isExpanded && (
					<Options
						options={posts}
						search={debouncedSearch}
						renderOption={(post) => (
							<button
								key={post.id}
								className="wpbt-post-search-control__option"
								onClick={() => {
									onChange(post.id);
									setSearch("");
									setIsExpanded(false);
								}}
							>
								<RawHTML>{post?.title?.rendered}</RawHTML>
							</button>
						)}
					/>
				)}
			</div>
		</BaseControl>
	);
};

const Options = ({ options, search, renderOption }) => {
	const isLoading = options === null;
	const hasOptions = options && options.length > 0;
	const hasSearch = search.length > 0;
	const hasMinimumSearchLength = search.length >= 3;

	if (!hasSearch) {
		return null;
	}

	if (isLoading) {
		return (
			<div className="wpbt-post-search-control__spinner">
				<Spinner />
			</div>
		);
	}

	if (!hasOptions) {
		return hasMinimumSearchLength ? (
			<p>{__("No posts were found with your search.", textdomain)}</p>
		) : (
			<p>
				{__("Your search needs to be at least 3 characters long.", textdomain)}
			</p>
		);
	}

	return options.map(renderOption);
};

export default PostSearchControl;