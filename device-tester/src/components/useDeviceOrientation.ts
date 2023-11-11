import { useCallback, useEffect, useState } from "react";

/**
 * Credits: https://dev.to/trekhleb/gyro-web-accessing-the-device-orientation-in-javascript-2492 
 * Added ts support for request permission. You walk so I can run ^
 */

type DeviceOrientation = {
	alpha: number | null;
	beta: number | null;
	gamma: number | null;
};

type UseDeviceOrientationData = {
	orientation: DeviceOrientation | null;
	error: Error | null;
	requestAccess: () => Promise<boolean>;
	revokeAccess: () => Promise<void>;
};

// Why is there not already support for this
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
	requestPermission?: () => Promise<"granted" | "denied">;
}

export const useDeviceOrientation = (): UseDeviceOrientationData => {
	const [error, setError] = useState<Error | null>(null);
	const [orientation, setOrientation] = useState<DeviceOrientation | null>(
		null
	);

  /**
   * Orientation is from gamma, alpha, beta values that correlate to a specific axes
   * Alpha - Z
   * Beta - X
   * Gamma - Y
   */
	const onDeviceOrientation = (event: DeviceOrientationEvent): void => {
		setOrientation({
			alpha: event.alpha,
			beta: event.beta,
			gamma: event.gamma,
		});
	};

	const revokeAccessAsync = async (): Promise<void> => {
		window.removeEventListener("deviceorientation", onDeviceOrientation);
		setOrientation(null);
	};

	const requestAccessAsync = async (): Promise<boolean> => {
		if (!DeviceOrientationEvent) {
			setError(
				new Error("Device orientation event is not supported by your browser")
			);
			return false;
		}

		const castDeviceOrientation =
			DeviceOrientationEvent as unknown as DeviceOrientationEventiOS;
		if (
			castDeviceOrientation.requestPermission &&
			typeof castDeviceOrientation.requestPermission === "function"
		) {
			let permission: PermissionState;
			try {
				permission = await castDeviceOrientation.requestPermission();
			} catch (err: any) {
				setError(err);
				return false;
			}
			if (permission !== "granted") {
				setError(
					new Error("Request to access the device orientation was rejected")
				);
				return false;
			}
		}

		window.addEventListener("deviceorientation", onDeviceOrientation);

		return true;
	};

	const requestAccess = useCallback(requestAccessAsync, []);
	const revokeAccess = useCallback(revokeAccessAsync, []);

	useEffect(() => {
		return (): void => {
			revokeAccess();
		};
	}, [revokeAccess]);

	return {
		orientation,
		error,
		requestAccess,
		revokeAccess,
	};
};
