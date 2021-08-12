const BACKGROUND_COLORS = {
	warning: "#fef8ee",
	error: "#fce8e9",
};

const BORDER_COLORS = {
	warning: "#f0b849",
	error: "#c72629",
};

const InlineNotice = ({ children, level = "warning" }) => {
	return (
		<div
			style={{
				padding: 20,
				backgroundColor: BACKGROUND_COLORS[level],
				borderStyle: "dashed",
				borderWidth: 2,
				borderColor: BORDER_COLORS[level],
				width: "100%",
			}}
		>
			{children}
		</div>
	);
};

export default InlineNotice;
