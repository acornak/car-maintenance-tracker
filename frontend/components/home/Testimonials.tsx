import Image from "next/image";
import React from "react";

interface Testimonial {
	quote: string;
	author: string;
	photoUrl?: string;
}

const testimonials: Testimonial[] = [
	{
		quote: "This app has made maintaining my car so much easier! Highly recommend.",
		author: "John Doe",
		photoUrl: "/mechanic.jpg",
	},
	{
		quote: "This app has made maintaining my car so much easier! Highly recommend.",
		author: "John Doe",
		photoUrl: "/mechanic.jpg",
	},
	{
		quote: "This app has made maintaining my car so much easier! Highly recommend.",
		author: "John Doe",
		photoUrl: "/mechanic.jpg",
	},
];

const Testimonials: React.FC = () => {
	return (
		<section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
					What Our Users Are Saying
				</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((testimonial, idx) => (
						<div
							key={idx}
							className="p-6 bg-white rounded-lg shadow"
						>
							{testimonial.photoUrl && (
								<Image
									src={testimonial.photoUrl}
									alt=""
									className="w-10 h-10 rounded-full mb-4"
									width={40}
									height={40}
								/>
							)}
							<p className="italic text-gray-600">{`"${testimonial.quote}"`}</p>
							<p className="mt-2 font-semibold text-gray-900">
								{testimonial.author}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
