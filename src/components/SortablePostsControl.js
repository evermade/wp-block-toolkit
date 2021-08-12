/**
 * External dependencies
 */
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import classnames from "classnames";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { BaseControl, Spinner } from "@wordpress/components";

/**
 * Internal dependencies
 */
import { textdomain } from "../config.json";
import { arrayMove, postToControlOption } from "../utils";

const SortablePostsControl = ({ label, posts, value, onChange }) => {
	const [options, setOptions] = useState([]);
	const [filteredOptions, setFilteredOptions] = useState([]);
	const [query, setQuery] = useState("");

	useEffect(() => {
		setOptions(posts.map(postToControlOption));
	}, [posts]);

	useEffect(() => {
		const newFilteredOptions = query
			? options.filter((each) =>
					each.label.toLowerCase().includes(query.toLowerCase())
			  )
			: options;

		setFilteredOptions(newFilteredOptions);
	}, [options, query]);

	if (typeof posts === null) return <Spinner />;

	if (!options || !options.length) return null;

	const onOptionClick = (option, isSelected) => {
		onChange(
			isSelected
				? value.filter((id) => id !== option.value)
				: [...value, option.value]
		);
	};

	const onSortEnd = ({ oldIndex, newIndex }) => {
		onChange(arrayMove(value, oldIndex, newIndex));
	};

	const onItemRemove = (option) => {
		onChange(value.filter((id) => id !== option.value));
	};

	return (
		<BaseControl label={label} className="wpbt-sortable-posts-control">
			<h4 className="wpbt-sortable-posts-control__subtitle">
				{__("Select posts", textdomain)}
			</h4>

			<input
				type="text"
				placeholder={__("Search", textdomain)}
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				className="wpbt-sortable-posts-control__search"
			/>

			<div className="wpbt-sortable-posts-control__list">
				{filteredOptions.map((option, index) => {
					const isSelected = value.find((id) => id === option.value);

					const optionClassName = classnames(
						"wpbt-sortable-posts-control__option",
						{
							"is-selected": isSelected,
						}
					);

					return (
						<button
							key={index}
							onClick={() => onOptionClick(option, isSelected)}
							className={optionClassName}
						>
							{option.label}
						</button>
					);
				})}
			</div>

			<h4 className="wpbt-sortable-posts-control__subtitle">
				{__("Select order", textdomain)}
			</h4>
			<div className="wpbt-sortable-posts-control__list">
				<SortableList
					items={value.map((id) =>
						options.find((option) => option.value === id)
					)}
					onSortEnd={onSortEnd}
					distance={5}
					onItemRemove={onItemRemove}
				/>
			</div>
		</BaseControl>
	);
};

const SortableItem = SortableElement(({ value, onRemove }) => (
	<div class="wpbt-sortable-posts-control__sortable-item">
		<span>{value.label}</span>
		<div
			class="wpbt-sortable-posts-control__sortable-remove"
			onClick={() => onRemove(value)}
		/>
	</div>
));

const SortableList = SortableContainer(({ items, onItemRemove }) => {
	return (
		<div class="wpbt-sortable-posts-control__sortable-list">
			{items.map((item, index) => (
				<SortableItem
					key={`item-${item.value}`}
					index={index}
					value={item}
					onRemove={onItemRemove}
				/>
			))}
		</div>
	);
});

export default SortablePostsControl;
