console.log('index.js!!!');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
  // await exec('youtube-dl -ci -f 137 https://www.youtube.com/watch?v=pjFrd282rF8');

  // await exec('youtube-dl -ci -f \'best\' -o \'videos/%(title)s.%(ext)s\' http://v.youku.com/v_show/id_XMjkzNzA0MDY3Ng==.html?spm=a2h0j.8191423.playlist_content.5!5~5~5~A&&f=50564085&from=y1.2-3.4.5');
  // console.log('next');
  // await exec('youtube-dl -ci -f \'best\' -o \'videos/%(title)s.%(ext)s\' https://www.youtube.com/watch?v=BZhM3sLzchI');

  await exec('youtube-dl -ci -f \'best\' -o \'videos/%(title)s.%(ext)s\' http://mvvideo10.meitudata.com/597f45e6c37297675.mp4');

  // await exec('youtube-dl -cit https://www.youtube.com/playlist?list=PL3w7SGFrUy7o7KcSolD5psdP9Q_9dqE6B');
  // await exec('you-get -o \'videos/\' http://www.meipai.com/media/454570774');
  console.log('done');
}
//lsExample();



// function get_hex(str)
// {
//     return {
//         'str' : str.substring(4),
//         'hex' : str.substring(0, 4).split('').reverse().join('')
//     };
// }
//
// function get_dec(str)
// {
//     var dec_str = parseInt(str, 16).toString();
//     return {
//         'pre': dec_str.substring(0, 2).split(''),
//         'tail': dec_str.substring(2).split('')
//     };
// }
//
// function substr(str, alist)
// {
//     var a = str.substring(0, alist[0]);
//     var b = str.substr(alist[0], alist[1]);
//     return a + str.substring(alist[0]).replace(b, '')
// }
//
// function get_pos(str, alist)
// {
//     alist[0] = str.length - alist[0] - alist[1];
//     return alist;
// }
//
// function decode(input)
// {
//     var a = get_hex(input);
//     var b = get_dec(a.hex);
//     var c = substr(a.str, b.pre);
//     return substr(c, get_pos(c, b.tail))
// }
//
// input = 'aff1aHR0cDovPL212dmlkZW8xMC5tZWl0dWRhdGEuY29tLzU5N2Y0NWU2YzM3Mjk3Njc19SASXHLm1wNA=='
//
// console.log(Buffer.from(decode(input), 'base64').toString('ascii'))
