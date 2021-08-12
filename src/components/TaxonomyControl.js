/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { CheckboxControl, Spinner, BaseControl } from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { textdomain } from "../config.json";

const TaxonomyControl = ({ label, taxonomies, value, onChange }) => {
	const [query, setQuery] = useState("");
	const [filteredTaxonomies, setFilteredTaxonomies] = useState(taxonomies);

	useEffect(() => {
		if (taxonomies) {
			const newTaxonomies = query
				? taxonomies.filter(({ name }) =>
						name.toLowerCase().includes(query.toLowerCase())
				  )
				: taxonomies;
			setFilteredTaxonomies(newTaxonomies);
		}
	}, [taxonomies, query]);

	if (typeof taxonomies === null) return <Spinner />;

	const handleClick = (id, checked) => {
		if (checked) {
			onChange([...value, id]);
		} else {
			onChange(value.filter((each) => each !== id));
		}
	};

	return (
		<BaseControl label={label}>
			<SearchInput
				value={query}
				onChange={(event) => setQuery(event.target.value)}
			/>
			<CheckboxWrapper>
				{filteredTaxonomies.map(({ id, name }) => (
					<CheckboxControl
						key={id}
						label={name}
						checked={value.includes(id)}
						onChange={(checked) => handleClick(id, checked)}
					/>
				))}
			</CheckboxWrapper>
		</BaseControl>
	);
};

export default TaxonomyControl;

const SearchInput = ({ value, onChange }) => {
	return (
		<div className="wpbt-search-input">
			<input
				type="text"
				placeholder={__("Search", textdomain)}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

const CheckboxWrapper = ({ children }) => {
	return <div className="wpbt-checkbox-wrapper">{children}</div>;
};
