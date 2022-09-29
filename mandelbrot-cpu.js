"use strict";

let gl;  // WebGL "context"
let scalingFactor;
let scaleLoc; let canvas;
// nt is the range of z(n), the sequence of the mandelbrot set
let nt=10;
let vertices; let colors = [];

window.onload = function init()
{   
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vertices = [];

    // Iterating through screen pixel and adding them to array of vertices
    // assigning black color to them for now.
    for (let i = 0; i < canvas.height; i++)
    {
        for (let j = 0; j < canvas.width; j++)
        {
            let x = map_point(0, 512, -1, 1,i);
            let y = map_point(0, 512, -1, 1,j);
            vertices.push(vec2(x,y))
            colors.push(vec3(0.0,0.0,0.0))
        }
    }    

    // let complex_vertices = []
    // Iterating through vertices and converting them to complex range
    // so that we can assign color to the pixels based on their escape time
    for (let i = 0; i < vertices.length; i++)
    {
        let p_x = vertices[i][0];
        let p_y = vertices[i][1];

        let complex_x = map_point(-1, 1,-2,2,p_x); 
        let complex_y = map_point(-1, 1,2,-2,p_y); 
        
        // complex_vertices.push(vec2(complex_x,complex_y));

        for (let j = 0; j < nt; j++)
        {
            let magnitude = Math.sqrt(Math.pow(complex_x,2)+Math.pow(complex_y,2))

            // let magnitude = length(complex_vertices[i]);

            if (magnitude > 2.0)
            {
                colors[i] = vec3(1.0,0.0,0.0);
                break;
            }
            else
            {
                complex_y = 2*(complex_x*complex_y) + complex_y;
                complex_x = Math.pow(complex_x,2) - Math.pow(complex_y,2) + complex_x;
                colors[i] = vec3(0.0,0.0,1.0);
            }
        }
    }

    // for (let i = 0; i < complex_vertices.length; i++)
    // {
    //     for (let j = 0; j < nt; j++)
    //     {
    //         let magnitude = length(complex_vertices[i])
         
    //         if (magnitude > 2.0)
    //         {
    //             colors[i][j]=vec3(1.0,0.0,0.0);
    //         }
    //     }
    // }


    // Load the data into the GPU and bind to shader variables.
    gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    let vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Associate out shader variables with our data buffer
    // scaleLoc = gl.getUniformLocation( program, "scale" );

    document.getElementById("myRange").oninput = function() {
        nt = this.value;
        render();
        }
    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, canvas.height*canvas.width);
}
