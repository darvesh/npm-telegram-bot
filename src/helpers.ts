import axios from "axios";
import { pipe } from "ramda";

interface NPMResponse {
	name: string;
	version: string;
	description: string;
	links: {
		npm: string;
		homepage: string;
		bugs: string;
		repository: string;
	};
}

export const search = async (query: string): Promise<NPMResponse[]> =>
	axios
		.get<NPMResponse[]>(
			`https://www.npmjs.com/search/suggestions?q=${query}`,
			{
				headers: {
					accept: "application/json",
					referer: "https://www.npmjs.com/",
					"user-agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 Edg/84.0.522.63"
				}
			}
		)
		.then(({ data }) => data);

// https://github.com/telecraft/telegram/blob/d341c0cad72711559652b9bb5ffd8c764ebf29d3/src/utils.ts#L1
const escapables = {
	"<": "&lt;",
	">": "&gt;",
	"&": "&amp;",
	"'": "&#39;",
	'"': "&quot;"
};
const escapeHTML = (s: string) =>
	s.replace(/<|>|&|"|'/g, r => escapables[r as keyof typeof escapables] || r);

const code = (s: string) => `<code>${s}</code>`;
const bold = (s: string) => `<b>${s}</b>`;
const italic = (s: string) => `<i>${s}</i>`;

const gatherLinks = (links: { [key: string]: string }) =>
	Object.entries(links).reduce((message: string, [key, value]) => {
		message += `${bold(key)}: ${value}\n`;
		return message;
	}, "");

// avoids getting warned/banned from groups by tagging another channel or group
const replaceAt = (str: string) => str.replace(/@/g, code("@"));

export const applyTemplate = ({
	name,
	version,
	links,
	description = "Not provided"
}: NPMResponse): string => {
	const tName = pipe(replaceAt, bold)(name);
	const tCode = code(version);
	const tDescription = pipe(escapeHTML, italic, replaceAt)(description);
	return `⌕ ${tName}  ${tCode}\n  ${tDescription}\n\n${gatherLinks(links)}`;
};
