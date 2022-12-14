
// function map_point(p,q,x,a,b)
// {   
//     //For when p,q,x,a,b are type integers.
//     if(typeof(x) === 'number')
//     {
//         let px = x - p;
//         let pq = q - p;
//         let s = px/pq;
//         if(typeof(a) === 'number')
//         {
//             let result = ((1.0 - s)*a + s*b);
//             return result;
//         }
//         else
//         {
//             let result = mix(a,b,s);
//             return result;
//         }
//     }
//     //For when p,q,x,a,b are type objects(vectors)
//     else
//     {
//         let px=subtract(x,p);
//         let pq=subtract(q,p);
//         let s = length(px)/length(pq);
//         let result = mix(a,b,s);
//         return result;
//     }
// }

function map_point(p, q, a, b, x)
{
    // If we are mapping from a number range to a number range: 

    if(typeof(p)=='number'&&typeof(a)=='number') 
    {
    return (a + (parseFloat(b - a) / parseFloat((q - p)) * (x - p)))
    }

    // If we are mapping from a vector range to a vector range:

    var vector = subtract(q, p);
    var alphavect = subtract(p, x);
    var alpha = length(alphavect)/length(vector);

    return mix(a, b, alpha);
}