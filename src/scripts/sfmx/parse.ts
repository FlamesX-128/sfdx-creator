import { Token, TokenType } from './lexer';

enum NodeType {
    Attribute,
    Object,
}

class AttributeNode {
    public name: string
    public value: string

    constructor(name: string, value: string) {
        this.value = value;
        this.name = name;
    }
}

class Node {
    public name: string
    public args: string[]
    public values: (AttributeNode | Node)[]

    constructor(name: string, args: string[], values: (AttributeNode | Node)[]) {
        this.name = name;
        this.args = args;
        this.values = values;
    }
}

// - - -

interface Parser {
    cursor: number
}

function parseObjectValues(this: Parser, identifiers: Token[]): (AttributeNode | Node)[] {
    const length: number = identifiers.length;
    const data = [];

    while (this.cursor < length) {
        if (identifiers[this.cursor].type === TokenType.CloseBrace)
            break;

        if (identifiers[this.cursor].type === TokenType.Identifier) {
            const name = identifiers[this.cursor].value!;

            if (identifiers[++this.cursor].type === TokenType.Equals) {
                if (
                    [TokenType.Identifier, TokenType.Number, TokenType.Minus]
                        .includes(identifiers[++this.cursor].type) === false
                ) {
                    throw new Error('Unexpected token');
                }

                if (identifiers[this.cursor].type === TokenType.Minus) {
                    if (identifiers[++this.cursor].type !== TokenType.Number) {
                        throw new Error('Unexpected token');
                    }

                    data.push(
                        new AttributeNode(name, '-' + identifiers[this.cursor].value!)
                    );
                }

                data.push(
                    new AttributeNode(name, identifiers[this.cursor].value!)
                )
            }

            if (identifiers[this.cursor--].type === TokenType.OpenParen) {
                data.push(
                    new Node(name, [], parseObjectValues.call(this, identifiers))
                );
            }
        }

        this.cursor++;
    }

    return data;
}

function parseObjectDef(this: Parser, identifiers: Token[], root?: true): Node[] {
    const length: number = identifiers.length;
    const data: Node[] = [];

    while (this.cursor < length) {
        if (
            identifiers[this.cursor].type === TokenType.CloseBrace &&
            root === undefined
        )
            break;
            
        if (
            [
                TokenType.Identifier, TokenType.OpenParen
            ].every(
                (type, i) => identifiers[this.cursor + i].type === type
            )
        ) {
            // Object name
            const name = identifiers[this.cursor].value!;

            this.cursor += 2;

            // Object arguments
            const args: string[] = [];

            while (identifiers[this.cursor].type !== TokenType.CloseParen) {
                if (identifiers[this.cursor].type === TokenType.Identifier) {
                    args.push(identifiers[this.cursor++].value!);
                } else {
                    throw new Error('Unexpected token');
                }
            }

            console.log(identifiers[this.cursor], identifiers[this.cursor + 1])

            if (identifiers[++this.cursor].type !== TokenType.OpenBrace) {
                throw new Error('Unexpected token');
            }

            this.cursor++;

            // Object values
            const values: (AttributeNode | Node)[] = parseObjectValues.call(
                this, identifiers
            );

            data.push(
                new Node(name, args, values)
            );
        } else {
            throw new Error('Unexpected token');
        }

        this.cursor++;
    }

    return data;
}

const parser = (data: Token[]) => {
    return parseObjectDef.call({ cursor: 0 }, data);
}

export { parser, Node, NodeType, AttributeNode };
