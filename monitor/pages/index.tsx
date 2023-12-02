import React from "react";
import {ActionIcon, Badge, Button, Card, Container, CopyButton, Divider, Group, Image, rem, Text, ThemeIcon, Title, Tooltip, useMantineColorScheme} from "@mantine/core";
import {IconAlertCircle, IconCheck, IconCircleCheck, IconCopy} from "@tabler/icons-react";
import {getRandom} from "./lib/helpers";
import getDataAll, {INodeProps } from "./lib/service";
import fs from 'fs'
import path from 'path'

// SSR
export async function getServerSideProps() {
	const data = await getDataAll();

	const dirRelativeToPublicFolder = "banner";
	const dir = path.resolve("./public", dirRelativeToPublicFolder);
	const filenames = fs.readdirSync(dir);
	data.banners = filenames.map(name => path.join('/', dirRelativeToPublicFolder, name));

	return { props: data };
}

// page
export default function MainPage(props: INodeProps) {
	const data = props;
	const banner = getRandom(data.banners);

	const { toggleColorScheme } = useMantineColorScheme();

	return (
		<Container size="sm" mt="xl" mb="xl">
			<Card shadow="md" padding="md" radius="md" withBorder>
				<Card.Section>
					<Image src={banner} height={240} />
				</Card.Section>

				<Group justify="space-between" mt="xs" mb="xs">
					<Group>
						<CheckIcon check={data.nameChecked}  />
						<Title order={1} size="h4" >
							{data.name.toUpperCase()}
						</Title>
					</Group>
					<Badge color={data.isBoot ? "green" : "red"} variant="light">{data.isBoot ? "Booted" : "Bootstraping"}</Badge>
				</Group>

				<Divider variant="dotted" />

				<Group justify="space-between" mt="xs">
					<Group>
						<CopyIcon id={data.id} idChecked={data.idChecked} />
						<Text size="md">{data.id}</Text>
					</Group>
					<Group>
						<Text size="sm" c="dimmed">Fee:</Text>
						<Text size="sm">{data.fee ?? "NA"}</Text>
					</Group>
				</Group>

				<Divider my="xs" variant="dotted" />

				<Group justify="space-between">
					<Group>
						<Text size="sm" c="dimmed">Cycle:</Text>
						<Text size="sm" c="dimmed">{data.startTime ?? "NA"} - {data.endTime ?? "NA"}</Text>
					</Group>
					<Group>
						<Text size="sm" c="dimmed">Perc:</Text>
						<Text size="sm" c="dimmed">{data.percRewarnig ?? "NA"} / {data.percAverage ?? "NA"}</Text>
					</Group>
				</Group>

				<Divider my="xs" variant="dotted" />

				<Group justify="space-between">
					<Group>
						<Text size="sm" c="dimmed">IP address:</Text>
						<Text size="sm">{data.ip}</Text>
					</Group>
					<Group>
						<Text size="sm" c="dimmed">Version:</Text>
						<Text size="sm">{data.version}</Text>
					</Group>
				</Group>
			</Card>

			<Group justify="center" mt="sm">
				<Text onClick={() => toggleColorScheme()} size="sm" c="dimmed">Click to Toggle theme</Text>
			</Group>

		</Container>
	)
}

function CheckIcon({check}){
	if (!check){
		return (
			<ThemeIcon variant="outline" color="red">
				<IconAlertCircle style={{ width: rem(16) }} />
			</ThemeIcon>
		);
	}
	else {
		return (
			<ThemeIcon variant="outline" color="green">
				<IconCircleCheck style={{width: rem(16)}}/>
			</ThemeIcon>
		);
	}
}

function CopyIcon({id, idChecked}){
	return(
		<ThemeIcon variant="outline" color={idChecked ? "rgba(230, 230, 230, 1)" : "red"}>
			<CopyButton value={id} timeout={2000}>
				{({ copied, copy }) => (
					<Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
						<ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
							{copied ? (
								<IconCheck style={{ width: rem(16) }} />
							) : (
								<IconCopy style={{ width: rem(16) }} />
							)}
						</ActionIcon>
					</Tooltip>
				)}
			</CopyButton>
		</ThemeIcon>
	);
}
