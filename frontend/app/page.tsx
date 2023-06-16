import Image from "next/image";

export default function Home() {
	return (
		<div>
			<h1>Home</h1>
			<Image src="/images/nextjs.png" width={200} height={200} alt="" />
		</div>
	);
}
