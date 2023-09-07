import { Token, lexer } from './sfmx/lexer';
import { parser, Node } from './sfmx/parse';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const height = canvas.height = window.innerHeight / 4;
const width = canvas.width = window.innerWidth / 4;

interface SFDX {
    name: string
    attributes: {
        [key: string]: string
    }[]
}

const updateTreeViewer = (data: SFDX[]) => {

}

const stringToSFDX = (content: string): Node[] => {
    
    const identifiers = lexer(content);

    console.log(identifiers);

    const data = parser(identifiers);

    return data;
}

document.querySelector('form')
    ?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(
            new FormData(e.target as HTMLFormElement)
        );

        const file = await (data['file'] as File).arrayBuffer()

        const sfdx = stringToSFDX(
            new TextDecoder('utf-8').decode(file)
        );

        console.log(sfdx);
    })
