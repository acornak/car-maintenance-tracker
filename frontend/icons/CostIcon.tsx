import React from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

function CostIcon(): JSX.Element {
	return (
		<div className="w-12 h-12">
			<CurrencyDollarIcon
				className="h-full w-full text-indigo-600"
				data-testid="cost-icon"
			/>
		</div>
	);
}

export default CostIcon;
