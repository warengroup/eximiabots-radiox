export default function logger(area, text){
    let date = new Date();
    console.log('[' + area + '] – ' + date.toISOString());
    if(text)  console.log(text + '\n');
}
