// bad
let height = 16 + 20 + 1 + 'px';

// GOOD
const PADDING = 16;
const BODY_HEIGHT = 20;
const BORDER = 1;
let div_height = PADDING + BODY_HEIGHT + BORDER + 'px';
