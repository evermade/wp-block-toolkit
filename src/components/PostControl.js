/**
 * WordPress dependencies
 */
import { ComboboxControl, Spinner } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { postToControlOption } from '../utils';

const PostControl = ( { label, posts, value, onChange } ) => {
	const [ options, setOptions ] = useState( [] );

	useEffect( () => {
		if ( posts ) {
			setOptions( posts.map( postToControlOption ) );
		}
	}, [ posts ] );

	if ( posts === null ) return <Spinner />;

	return (
		<ComboboxWrapper>
			<ComboboxControl
				label={ label }
				value={ value }
				onChange={ onChange }
				options={ options }
			/>
		</ComboboxWrapper>
	);
};

export default PostControl;

const ComboboxWrapper = ( { children } ) => {
	return <div className="wpbt-combobox-wrapper">{ children }</div>;
};
