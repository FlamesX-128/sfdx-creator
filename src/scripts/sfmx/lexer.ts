enum TokenType {
    Identifier = 'A-z',
    Number = '0-9',
    CloseParen = ')',
    OpenParen = '(',
    CloseBrace = '}',
    OpenBrace = '{',
    Point = '.',
    Comma = ',',
    Semicolon = ';',
    Equals = '=',
    Slash = '/',
    Asterisk = '*',
    Minus = '-',
    NewLine = '\n',
    Invalid = 'Invalid'
}

class Token {
    public readonly type: TokenType;
    public readonly value?: string;
    public readonly cursor: number;

    constructor(type: TokenType, cursor: number, value?: string) {
        this.type = type;
        this.cursor = cursor;
        this.value = value;
    }
};

// - - -

const chars = [
    '(', ')', '{', '}', '.', ';', '=', '/', '*', '-', ','
]

const lexer = (data: string) => {
    const tokens: Token[] = [];

    const content = data.split('')
        .filter((char) => ['\r', '\t', ' '].includes(char) === false)
        .join('');
    
    const size = data.length;

    for (let i = 0; i < size; i++) {
        const char = content[i] as TokenType;

        if (char === undefined) break

        if (char.match(/[A-Za-z]|\./)) {
            let value: string = char;

            while (content[i + 1].match(/[A-Za-z]|\.|_/)) {
                value += content[++i];
            }

            i--;

            tokens.push(
                new Token(TokenType.Identifier, i, value)
            );
        }

        else if (char.match(/[0-9]/)) {
            let value: string = char;
            let isFloat = false;

            while (content[i + 1].match(/[0-9]|\./)) {
                const char = content[++i];

                if (char === '.') {
                    if (isFloat) {
                        tokens.push(
                            new Token(TokenType.Invalid, i, value)
                        );

                        break;
                    }

                    isFloat = true;
                }

                value += char;
            }

            i--;

            tokens.push(
                new Token(TokenType.Number, i, value)
            );
        }

        else if (char === '/') {
            if (content[i + 1] === '/') {
                while (content[++i] !== '\n') {
                    continue;
                }

            }

            if (content[i + 1] === '*') {
                while (content[++i] !== '*' && content[i + 1] !== '/') {
                    continue;
                }

            }

            continue;
        }

        else if (chars.includes(char)) {
            tokens.push(new Token(char, i));

            continue;
        }

        else if (char === '\n') {
            continue;
        }

        else {
            tokens.push(
                new Token(TokenType.Invalid, i, char)
            );
        }

        i++;
    }

    return tokens;
}

export { lexer, Token, TokenType };
