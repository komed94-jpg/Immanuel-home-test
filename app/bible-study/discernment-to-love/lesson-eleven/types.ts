export type Question={key:string;label:string;prompt:string};
export type Block=
|{type:"heading";text:string}
|{type:"paragraphs";body:string[]}
|{type:"scripture";label?:string;refs:string[]}
|{type:"question";key:string}
|{type:"callout";title:string;body:string[]}
|{type:"quote";body:string[]}
|{type:"list";ordered?:boolean;items:string[]}
|{type:"table";headers:string[];rows:string[][]}
|{type:"note";text:string};
export type LessonPageData={key:string;eyebrow:string;title:string;questions:Question[];blocks:Block[]};
