export const canParse = text => text !== null && (!!text.match(/\barq\b/i));

const parse = text => text;

export default parse;
