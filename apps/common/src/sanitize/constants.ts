export const SANITIZE_OPTIONS=Symbol('SANITIZE_OPTIONS');

export const PURIFY_OPTIONS={
    ALLOWED_TAGS: [
        'p','br','strong','em','b','i','u','ul','ol','li',
        'a','img','figure','figcaption','blockquote',
        'h1','h2','h3','h4','h5','h6','pre','code',
        'table','thead','tbody','tr','td','th'
    ],
    ALLOWED_ATTR: ['style','href','src','alt','title','width','height','id','rel','target'],
    FORBID_TAGS: ['script','style','iframe','object','embed'],
    FORBID_ATTR: ['style','class','onclick','onerror','onload'],
};

export const ATTR_WHILE_LIST: Record<string,string[]>={
    a: ['href','title','rel','target'],
    img: ['src','alt','width','height'],
    '*': ['id','title']
};
