import React from "react";
import { ViewColumnsIcon } from "@heroicons/react/24/solid";

function TrackingIcon(): JSX.Element {
	return (
		<div className="w-12 h-12">
			<ViewColumnsIcon
				className="h-full w-full text-indigo-600"
				data-testid="tracking-icon"
			/>
		</div>
	);
}

export default TrackingIcon;
