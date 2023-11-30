import React, { useState } from "react";
import type { GetServerSideProps } from 'next'

interface IPageProps {
	isBoot: boolean | null
	id: string | null
	idChecked: boolean | null
	ip: string | null
	name: string | null
	nameChecked: boolean | null
	version: string | null
}

// get data from AVAX Node
async function getData(urlPath: string, method: string, params: object | null = null) {
	const host = process.env.NODE_HOST || "127.0.0.1";
	const port = process.env.NODE_PORT || "9650";
	const url = `http://${host}:${port}/ext/${urlPath}`;
	console.info("Url: ", url);

	const req =
	{
		"jsonrpc": "2.0",
		"id": 1,
		"method": method,
		params
	};
	console.info("Request: ", req);

	try {
		const response = await fetch(url,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(req)
			}
		);

		const json = await response.json();
		console.info("Response", json);
		return json;
	}
	catch (e) {
		return null;
	}
}

async function getIsBoot(): Promise<boolean> {
	return (await getData("info", "info.isBootstrapped", { "chain": "X" }))?.result?.isBootstrapped ?? false;
}
async function getNetworkName(): Promise<string | null> {
	return (await getData("info", "info.getNetworkName"))?.result?.networkName ?? null;
}
async function getNodeId(): Promise<string | null> {
	return (await getData("info", "info.getNodeID"))?.result?.nodeID ?? null;
}
async function getNodeIp(): Promise<string | null> {
	return (await getData("info", "info.getNodeIP"))?.result?.ip ?? null;
}
async function getNodeVersion(): Promise<string | null> {
	return (await getData("info", "info.getNodeVersion"))?.result?.version ?? null;
}

// helper overeni klicovych nastaveni
function check(val: string,  checkWith: string | null):boolean | null{
	if (checkWith == null)
		return null;
	else if (val == null)
		return false;
	else
		return (val.toLowerCase() === checkWith.toLowerCase());
}

// helper: formatovani datum-casu
function formatDate(time: Date | null): string {
	if (!time) return "";

	return time.getDay() + "." + time.getMonth() + "." + time.getFullYear() + " "
		+ time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

// helper: formatovani boolean
function formatBool(val: boolean | null): string {
	if (val == null) return "NA";
	return (val == true) ? "A" : "N";
}

// SSR
export const getServerSideProps: GetServerSideProps<IPageProps> = async () => {
	const r: IPageProps = {
		isBoot: await getIsBoot(),
		name: await getNetworkName(),
		nameChecked: null,
		id: await getNodeId(),
		idChecked: null,
		ip: await getNodeIp(),
		version: await getNodeVersion(),
	};

	// kontrola spravnosti nastaveni
	r.idChecked = check(r.id, process.env.NODE_ID);
	r.nameChecked = check(r.name, process.env.NODE_NAME);

	return { props: r };
};

// page
export default function Page(props: IPageProps) {
	const [when, setWhen] = useState(new Date());

	async function handleUpdate(e) {
		e.preventDefault();
		console.log('The link was clicked.');
		setWhen(new Date());
	}

	return (
		<p>
			Is boot: {formatBool(props.isBoot)}<br/>
			Name: {props.name} ({formatBool(props.nameChecked)})<br/>
			ID: {props.id} ({formatBool(props.idChecked)})<br/>
			IP: {props.ip}<br/>
			Version: {props.version}<br/>

			<button onClick={handleUpdate}>Update</button><br/>
			Generated: <span>{formatDate(when)}</span>
		</p>
	)
};

