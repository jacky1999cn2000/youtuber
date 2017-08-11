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

// download:
//await exec('youtube-dl -ci -f \'best\' -o \'videos/%(title)s.%(ext)s\' http://mvvideo10.meitudata.com/597f45e6c37297675.mp4');
