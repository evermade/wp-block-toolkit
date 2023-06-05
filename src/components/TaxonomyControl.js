/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { CheckboxControl, Spinner, BaseControl } from "@wordpress/components";
import { useState, useEffect, RawHTML } from "@wordpress/element";
import { useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import config from "../config.json";
import { labelWithCount } from "../utils";

const TaxonomyControl = ({ slug, label, value, onChange }) => {
	const [taxonomies, setTaxonomies] = useState([]);
	const [query, setQuery] = useState("");
	const hasTaxonomies = taxonomies.length > 0;

	/**
	 * Get all taxonomies of slug type
	 */
	const data = useSelect(
		(select) => {
			return select("core").getEntityRecords("taxonomy", slug, {
				per_page: -1,
			});
		},
		[slug]
	);

	const isLoading = data === null;

	/**
	 * Convert data shape from flat to hierarchical
	 */
	useEffect(() => {
		if (data) {
			const groupedByParent = data.reduce((acc, cur) => {
				const key = cur.parent || 0;
				acc[key] = [...(acc[key] || []), cur];
				return acc;
			}, {});

			const withNestedChildren = (item) => {
				return {
					...item,
					children: groupedByParent[item.id]
						? groupedByParent[item.id].map(withNestedChildren)
						: [],
				};
			};

			if (groupedByParent[0]) {
				const newTaxonomies = groupedByParent[0].map(withNestedChildren);
				setTaxonomies(newTaxonomies);
			}
		}
	}, [data]);

	const handleClick = (id, checked) => {
		if (checked) {
			onChange([...value, id]);
		} else {
			onChange(value.filter((each) => each !== id));
		}
	};

	const isMatch = ({ name }) => {
		return name.toLowerCase().includes(query.toLowerCase());
	};

	const filter = (data) => {
		const arr = [];

		data.forEach((item) => {
			if (isMatch(item) || item.children.some(isMatch)) {
				arr.push({ ...item, children: filter(item.children) });
			}
		});

		return arr;
	};

	return (
		<BaseControl label={labelWithCount(label, value?.length)}>
			<SearchInput
				value={query}
				onChange={(event) => setQuery(event.target.value)}
			/>
			{!isLoading && value.length > 0 && (
				<div className="wbpt-tag-list">
					{value.map((id) => (
						<RemovableTag
							key={id}
							id={id}
							label={data.find((each) => each.id === id)?.name}
							onClick={() => handleClick(id, false)}
						/>
					))}
				</div>
			)}
			<CheckboxWrapper>
				{isLoading ? (
					<Spinner />
				) : !hasTaxonomies ? (
					<p>
						{__(`No taxonomies of type "${slug}" found.`, config?.textdomain)}
					</p>
				) : (
					<CheckboxGroup
						data={query ? filter(taxonomies) : taxonomies}
						value={value}
						onCheckboxClick={handleClick}
					/>
				)}
			</CheckboxWrapper>
		</BaseControl>
	);
};

export default TaxonomyControl;

const CheckboxGroup = ({ data, value, onCheckboxClick }) => {
	return (
		<ul>
			{data.map((item) => (
				<li key={item.id}>
					<CheckboxControl
						key={item.id}
						label={<RawHTML>{item.name}</RawHTML>}
						checked={value.includes(item.id)}
						onChange={(checked) => onCheckboxClick(item.id, checked)}
					/>
					{item.children && (
						<CheckboxGroup
							data={item.children}
							value={value}
							onCheckboxClick={onCheckboxClick}
						/>
					)}
				</li>
			))}
		</ul>
	);
};

const SearchInput = ({ value, onChange }) => {
	return (
		<div className="wpbt-search-input">
			<input
				type="text"
				placeholder={__("Search", config?.textdomain)}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

const RemovableTag = ({ id, label, onClick }) => {
	return (
		<button key={id} onClick={onClick} className="wbpt-removable-tag">
			<RawHTML>{label}</RawHTML>
		</button>
	);
};

const CheckboxWrapper = ({ children }) => {
	return <div className="wpbt-checkbox-wrapper">{children}</div>;
};
