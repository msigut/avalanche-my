import React, { useState } from "react";
import {ActionIcon, Badge, Button, Card, Container, CopyButton, Divider, Group, Image, rem, Text, ThemeIcon, Title, Tooltip} from "@mantine/core";
import {IconCheck, IconCircleCheck, IconCopy} from "@tabler/icons-react";
import {formatBool, formatDate, getRandom} from "./lib/helpers";
import getDataAll, {INodeProps } from "./lib/service";
import fs from 'fs'
import path from 'path'

// SSR
export async function getServerSideProps() {
	const data = await getDataAll();

	const dirRelativeToPublicFolder = "banner";
	const dir = path.resolve("./public", dirRelativeToPublicFolder);
	const filenames = fs.readdirSync(dir);
	data.banners = filenames.map(name => path.join('/', dirRelativeToPublicFolder, name))

	return { props: data };
}

// page
export default function Page(props: INodeProps) {
	const [data, setData] = useState(props);
	const [banners, setBanners] = useState(props.banners);
	const [banner, setBanner] = useState(getRandom(props.banners));
	const [when, setWhen] = useState(new Date());

	async function handleUpdate(e) {
		e.preventDefault();

		console.log('Update clicked.');

		setData(await getDataAll());
		setBanner(getRandom(banners));
		setWhen(new Date());
	}

	return (
		<Container size="sm" mt="xl" mb="xl">
			<Card shadow="md" padding="md" radius="md" withBorder>
				<Card.Section>
					<Image src={banner} height={240} />
				</Card.Section>

				<Group justify="space-between" mt="xs" mb="xs">
					<Group>
						{/*<IconAlertCircle style={{ width: rem(16) }} />*/}
						<ThemeIcon variant="outline" color="green">
							<IconCircleCheck style={{ width: rem(16) }} />
						</ThemeIcon>
						<Title order={1} size="h4" >
							{data.name.toUpperCase()} ({formatBool(data.nameChecked)})
						</Title>
					</Group>
					<Badge color={data.isBoot ? "green" : "red"} variant="light">{data.isBoot ? "Booted" : "Bootstraping"}</Badge>
				</Group>
				<Divider variant="dotted" />

				<Group justify="space-between" mt="xs">
					<Text size="md">
						{data.id} ({formatBool(data.idChecked)})
					</Text>
					<CopyButton value="https://mantine.dev" timeout={2000}>
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
				<Divider my="xs" variant="dotted" />

				<Group justify="space-between">
					<Group>
						<Text size="sm">{data.startTime} - {data.endTime}</Text>
					</Group>
					<Group>
						<Text size="sm" c="dimmed">Fee:</Text>
						<Text size="sm">{data.fee}</Text>
					</Group>
					<Group>
						<Text size="sm" c="dimmed">Perc:</Text>
						<Text size="sm">{data.percRewarnig} / {data.percAverage}</Text>
					</Group>
				</Group>

				<Button onClick={handleUpdate} variant="light" color="blue" fullWidth mt="md" radius="md">Update</Button>
			</Card>

			<Text size="sm" c="dimmed" mt="md">{formatDate(when)}</Text>

		</Container>
	)
};

