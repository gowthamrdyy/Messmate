import html from "../public/index.html?raw";
export const dynamic = "force-dynamic";
export function GET(){return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache"}});}
