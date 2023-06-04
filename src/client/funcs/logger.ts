export default function logger(area : string, text: string){
    let date = new Date();
    console.log('[' + area + '] - ' + date.toISOString());
    if(text)  console.log(text + '\n');
}
