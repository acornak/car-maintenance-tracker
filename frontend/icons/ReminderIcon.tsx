import { BellIcon } from "@heroicons/react/24/solid";
import React from "react";

const ReminderIcon: React.FC = () => {
	return (
		<div className="w-12 h-12">
			<BellIcon className="h-full w-full text-indigo-600" />
		</div>
	);
};

export default ReminderIcon;
