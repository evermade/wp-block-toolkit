/**
 * External dependencies
 */
import classnames from "classnames";

const InlineNotice = ({ children, status = "warning", size = "regular" }) => {
	const className = classnames(
		"wpbt-inline-notice",
		`is-${status}`,
		`is-size-${size}`
	);

	return <div className={className}>{children}</div>;
};

export default InlineNotice;
