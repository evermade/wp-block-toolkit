/**
 * External dependencies
 */
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classnames from "classnames";
import { useDebounce } from "use-debounce";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { BaseControl, Spinner } from "@wordpress/components";
import { useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { postToControlOption } from "../utils";
import { usePostSearch } from "../hooks/use-post-search";

/**
 * Constants
 */
const SEARCH_DEBOUNCE_DELAY = 500;
const SEARCH_MINIMUM_LENGTH = 3;

const SortablePostSearchControl = ({
	type = "post",
	status = "publish",
	value,
	onChange,
	placeholder = __("Search", "wp-block-toolkit"),
	label = __("Select a post", "wp-block-toolkit"),
	inputProps = {},
	filterResults = null,
	numOfInitialResults = 20,
	...rest
}) => {
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
	const [options, setOptions] = useState([]);
	const [perPage, setPerPage] = useState(numOfInitialResults);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const posts = usePostSearch({
		postType: type,
		postStatus: status,
		search: debouncedSearch,
		minimumLength: SEARCH_MINIMUM_LENGTH,
		perPage,
	});

	const maybeHasMorePosts = posts?.length === numOfInitialResults;

	const filteredPosts = filterResults ? filterResults(posts) : posts;

	useEffect(() => {
		if (filteredPosts) {
			setOptions(filteredPosts.map(postToControlOption));
		}
	}, [filteredPosts]);

	const onOptionClick = (option, isSelected) => {
		onChange(
			isSelected
				? value.filter((id) => id !== option.value)
				: [...value, option.value],
		);
	};

	const onSortEnd = (newValues) => {
		onChange(newValues);
	};

	const onItemRemove = (option) => {
		onChange(value.filter((id) => id !== option.value));
	};

	return (
		<BaseControl
			label={label}
			className="wpbt-sortable-post-search-control"
			{...rest}
		>
			<h4 className="wpbt-sortable-post-search-control__subtitle">
				{__("Select posts", "wp-block-toolkit")}
			</h4>

			<input
				type="text"
				value={search || ""}
				onChange={(e) => setSearch(e.currentTarget.value)}
				placeholder={placeholder}
				className="wpbt-sortable-post-search-control__input"
				{...inputProps}
			/>

			<div className="wpbt-sortable-post-search-control__list">
				{options?.map((option, index) => {
					const isSelected = value.find((id) => id === option.value);

					const optionClassName = classnames(
						"wpbt-sortable-post-search-control__option",
						{
							"is-selected": isSelected,
						},
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

				{maybeHasMorePosts && (
					<div className="wpbt-sortable-post-search-control__more">
						{isLoadingMore ? (
							<Spinner />
						) : (
							<button
								className="components-button is-tertiary"
								onClick={() => {
									setIsLoadingMore(true);
									setPerPage(-1);
								}}
							>
								{__("View more results", "wp-block-toolkit")}
							</button>
						)}
					</div>
				)}
			</div>

			<h4 className="wpbt-sortable-post-search-control__subtitle">
				{__("Select order", "wp-block-toolkit")}
			</h4>

			<SortableList
				ids={value}
				postType={type}
				postStatus={status}
				onChange={onSortEnd}
				onItemRemove={onItemRemove}
			/>
		</BaseControl>
	);
};

const SortableItem = ({ id, value, onRemove, isDragging }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString({
			x: 0,
			y: transform?.y,
			scaleX: 1,
			scaleY: 1,
		}),
		transition,
	};

	return (
		<div
			className="wpbt-sortable-post-search-control__sortable-item"
			ref={setNodeRef}
			style={style}
		>
			<span {...attributes} {...listeners}>
				{value.label}
			</span>
			{!isDragging && (
				<div
					className="wpbt-sortable-post-search-control__sortable-remove"
					onClick={() => onRemove(value)}
				/>
			)}
		</div>
	);
};

const SortableList = ({
	ids,
	postType,
	postStatus,
	onChange,
	onItemRemove,
}) => {
	const [items, setItems] = useState([]);
	const [isDragging, setIsDragging] = useState(false);

	const posts = useSelect(
		(select) =>
			select("core").getEntityRecords("postType", postType, {
				per_page: -1,
				orderby: "title",
				order: "asc",
				status: postStatus,
				include: ids,
			}),
		[postType, postStatus, ids],
	);

	useEffect(() => {
		if (posts) {
			setItems(posts.map(postToControlOption));
		}
	}, [posts]);

	const sortedItems = items.sort((a, b) => {
		return ids.indexOf(a.value) - ids.indexOf(b.value);
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragStart = (event) => {
		setIsDragging(true);
	};

	const handleDragEnd = (event) => {
		setIsDragging(false);

		const { active, over } = event;

		if (active.id !== over.id) {
			const ids = items.map((item) => item.value);
			const oldIndex = ids.indexOf(active.id);
			const newIndex = ids.indexOf(over.id);
			const newIds = arrayMove(ids, oldIndex, newIndex);

			onChange(newIds);
		}
	};

	return (
		<div className="wpbt-sortable-post-search-control__list">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={sortedItems}
					strategy={verticalListSortingStrategy}
				>
					<div className="wpbt-sortable-post-search-control__sortable-list">
						{sortedItems.map((item, index) => (
							<SortableItem
								key={`item-${item.value}`}
								id={item.value}
								index={index}
								value={item}
								onRemove={onItemRemove}
								isDragging={isDragging}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
};

export default SortablePostSearchControl;
