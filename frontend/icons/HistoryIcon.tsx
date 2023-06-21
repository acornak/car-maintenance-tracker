import React from "react";
import { ClockIcon } from "@heroicons/react/24/solid";

function HistoryIcon(): JSX.Element {
	return (
		<div className="w-12 h-12">
			<ClockIcon
				className="h-full w-full text-indigo-600"
				data-testid="history-icon"
			/>
		</div>
	);
}

export default HistoryIcon;
