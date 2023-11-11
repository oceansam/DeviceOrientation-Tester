import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useDeviceOrientation } from "./components/useDeviceOrientation";
import QRCode from "react-qr-code";
function App() {
	const { orientation, requestAccess, revokeAccess, error } =
		useDeviceOrientation();

	const [windowUrl, setWindowUrl] = useState("");

	useEffect(() => {
		setWindowUrl(window.location.href);
	}, []);

	return (
		<div className="App App-header relative">
			<div className="w-full h-full flex flex-col justify-center items-center gap-4">
				<div>Scan QR to test phone</div>
				<QRCode value={windowUrl} />
				{error ? <div>{error.message}</div> : null}
				<button
					type="button"
					onClick={() => requestAccess()}
					className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
				>
					Request Orientation Permission
				</button>
				<div>
					<div>{orientation?.alpha}</div>
					<div>{orientation?.beta}</div>
					<div>{orientation?.gamma}</div>
				</div>
			</div>
		</div>
	);
}

export default App;
