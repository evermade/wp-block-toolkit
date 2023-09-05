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

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { BaseControl, Spinner } from "@wordpress/components";

/**
 * Internal dependencies
 */
import config from "../config.json";
import { postToControlOption } from "../utils";

const SortablePostsControl = ({ label, posts, value, onChange }) => {
	const { textdomain } = config;

	const [options, setOptions] = useState([]);
	const [filteredOptions, setFilteredOptions] = useState([]);
	const [query, setQuery] = useState("");

	useEffect(() => {
		if (posts) {
			setOptions(posts.map(postToControlOption));
		}
	}, [posts]);

	useEffect(() => {
		const newFilteredOptions = query
			? options.filter((each) =>
					each.label.toLowerCase().includes(query.toLowerCase())
			  )
			: options;

		setFilteredOptions(newFilteredOptions);
	}, [options, query]);

	if (posts === null) return <Spinner />;

	if (!options || !options.length) return null;

	const onOptionClick = (option, isSelected) => {
		onChange(
			isSelected
				? value.filter((id) => id !== option.value)
				: [...value, option.value]
		);
	};

	const onSortEnd = (newValues) => {
		onChange(newValues);
	};

	const onItemRemove = (option) => {
		onChange(value.filter((id) => id !== option.value));
	};

	const sortableOptions = value.reduce((items, id) => {
		const option = options.find((option) => option.value === id);

		if (option) {
			items.push(option);
		}

		return items;
	}, []);

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

			<SortableList
				items={sortableOptions}
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
			className="wpbt-sortable-posts-control__sortable-item"
			ref={setNodeRef}
			style={style}
		>
			<span {...attributes} {...listeners}>
				{value.label}
			</span>
			{!isDragging && (
				<div
					className="wpbt-sortable-posts-control__sortable-remove"
					onClick={() => onRemove(value)}
				/>
			)}
		</div>
	);
};

const SortableList = ({ items, onChange, onItemRemove }) => {
	const [isDragging, setIsDragging] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
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
		<div className="wpbt-sortable-posts-control__list">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={items} strategy={verticalListSortingStrategy}>
					<div className="wpbt-sortable-posts-control__sortable-list">
						{items.map((item, index) => (
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

export default SortablePostsControl;
