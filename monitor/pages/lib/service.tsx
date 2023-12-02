import {doCheck, formatDate, getPublicFiles, parseDate} from "./helpers";

export interface INodeProps {
    isBoot: boolean
    id: string | null
    idChecked: boolean | null
    ip: string | null
    name: string | null
    nameChecked: boolean | null
    version: string | null
    percRewarnig: number | null
    percAverage: number | null
    startTime: string | null
    endTime: string | null
    connected: boolean | null
    fee: number | null
    banners: string[] | null
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
async function getUp(props: INodeProps) {
    const up = (await getData("info", "info.uptime"))?.result ?? null;
    if (!up) return;

    props.percRewarnig = up.rewardingStakePercentage ?? null;
    props.percAverage = up.weightedAveragePercentage ?? null;
}
async function getValidator(props: INodeProps) {
    const nodeId = process.env.NODE_ID ?? props.id;
    if (!nodeId) return;

    const validator = (await getData("bc/P", "platform.getCurrentValidators", {"nodeIDs": [nodeId]}))?.result?.validators[0] ?? null;
    if (!validator) return;

    props.startTime = formatDate(parseDate(validator.startTime));
    props.endTime = formatDate(parseDate(validator.endTime));
    props.connected = validator.connected ?? null;
    props.fee = validator.delegationFee ?? null;
}

export default async function getDataAll() : Promise<INodeProps> {
    const r: INodeProps = {
        isBoot: await getIsBoot(),
        name: await getNetworkName(),
        nameChecked: null,
        id: await getNodeId(),
        idChecked: null,
        ip: await getNodeIp(),
        version: await getNodeVersion(),
        percRewarnig: null,
        percAverage: null,
        startTime: null,
        endTime: null,
        connected: null,
        fee: null
    };

    // statistiky Up + informace o validatorovi
    await getUp(r);
    await getValidator(r);

    // kontrola spravnosti nastaveni
    r.idChecked = doCheck(r.id, process.env.NODE_ID);
    r.nameChecked = doCheck(r.name, process.env.NODE_NAME);

    return r;
}
