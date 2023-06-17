import React from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

const CostIcon: React.FC = () => {
	return (
		<div className="w-12 h-12">
			<CurrencyDollarIcon className="h-full w-full text-indigo-600" />
		</div>
	);
};

export default CostIcon;
