import React from "react";
import { BellIcon } from "@heroicons/react/24/solid";

function ReminderIcon(): JSX.Element {
	return (
		<div className="w-12 h-12">
			<BellIcon
				className="h-full w-full text-indigo-600"
				data-testid="reminder-icon"
			/>
		</div>
	);
}

export default ReminderIcon;
