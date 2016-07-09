var canvas;
var context;
var w;
var h;

var m_x = 100;
var m_y = 100;

var m_down = 0;
var grabbed = 0;
var paused = 0;

var K=2;
var C=2;
var M=1;
var DT=0.05;
var X=0;
var V=0;

var x_points = new Array();
var v_points = new Array();

var m_input;
var c_input;
var k_input;

function init() {

    m_input = document.getElementById("mass");
    c_input = document.getElementById("friction");
    k_input = document.getElementById("spring");
    
    m_input.value = M;
    c_input.value = C;
    k_input.value = K;
    
    canvas = document.getElementById("canvas");
    
    if( canvas.getContext ) {
        
	context = canvas.getContext("2d");
	context.font = "20px";
	
	w = canvas.width;
	h = canvas.height;
        
	for( var i=0; i<300; i++ ) {
	    x_points[i] = 0;
	    v_points[i] = 0;
	}
        
	int_id = setInterval(draw,DT*100);
	
    }
}

function draw() {
    
    erase();
    
    update_X();
    draw_graph();
    
    draw_wall();
    draw_spring_mass();
		
}

function erase() {
    
    context.clearRect(0,0,canvas.width,canvas.height);
    
}

function update_X() {
    
    if( grabbed == 0 ) {
        k11 = DT*V;
        k21 = DT*(-C/M*V-K/M*X);
        k12 = DT*(V+k21/2);
        k22 = DT*(-C/M*(V+k21/2)-K/M*(X+k11/2));
        k13 = DT*(V+k22/2);
        k23 = DT*(-C/M*(V+k22/2)-K/M*(X+k12/2));
        k14 = DT*(V+k23);
        k24 = DT*(-C/M*(V+k23)-K/M*(X+k13));

        X = X + (k11+2*k12+2*k13+k14)/6;
        V = V + (k21+2*k22+2*k23+k24)/6;
    }

}

function f(x) {
    
    return (x-220)/(-220-220)*240+(x+220)/(220+220)*50;
    
}

function draw_graph() {
    
    context.save();

    context.lineWidth=2;

    context.beginPath();
    context.moveTo(550,50);
    context.lineTo(550,240);
    context.stroke();

    context.beginPath();
    context.moveTo(550,145);
    context.lineTo(50,145);
    context.stroke();

    context.restore();

    for( var i=299; i>0; i-- ) {
        x_points[i] = x_points[i-1];
        v_points[i] = v_points[i-1];
    }
    x_points[0] = X;
    v_points[0] = V;

    context.save();

    var h = 500/300;
    var t = 0;
    context.lineWidth = 3;
    context.strokeStyle = "rgb(0,0,255)";
    context.beginPath();
    context.moveTo(550,f(x_points[0]/1.5));
    for( i=1; i<300; i++ ) {
        t = 550 - i*h;
        context.lineTo(t,f(x_points[i]/1.5));
    }
    context.stroke();

    context.restore();

    context.save();

    context.lineWidth = 3;
    context.strokeStyle = "rgb(0,255,0)";
    context.beginPath();
    context.moveTo(550,f(v_points[0]/1.5));
    for( i=1; i<300; i++ ) {
        t = 550 - i*h;
        context.lineTo(t,f(v_points[i]/1.5));
    }
    context.stroke();

    context.restore();
    
}

function draw_wall() {

    context.save();

    context.lineWidth = 3;

    context.beginPath();
    context.moveTo(50,290);
    context.lineTo(50,350);
    context.lineTo(550,350);
    context.stroke();

    context.restore();

}

function draw_spring_mass() {

    S_X = X+300;

    context.save();

    context.fillStyle = "rgb(255,0,0)";
    
    context.beginPath();
    context.arc(S_X,320,30,0,2*Math.PI,false);
    context.closePath();
    context.fill();

    context.beginPath();
    context.moveTo(S_X-30,320);
    var h = (S_X-80)/12;
    for( var i=0; i<12; i++ ) {
        var x = S_X-30-(i+0.5)*h;
        var y = 0;
        if( i%2 == 0 )
            y = 340;
        else
            y = 300;
        context.lineTo(x,y);
    }
    context.lineTo(50,320);
    context.stroke();
    
    context.restore();

}

function mouse_down(event) {

    var dx, dy, dist;
    var S_X = X+300;

    m_down = 1;
    m_x = event.clientX-9;
    m_y = event.clientY-9;

    dx = m_x-S_X;
    dy = m_y-320;

    if( Math.sqrt(dx*dx+dy*dy) < 30 ) {
        grabbed = 1;
        V = 0;
        X = m_x-300;
        if( X > 220 )
            X = 220;
        if( X < -220 )
            X = -220;
    }

}

function mouse_up(event) {

    var dx, dy, dist;

    m_down = 0;
    grabbed = 0;

}

function mouse_move(event) {

    var dx, dy, dist;
    var S_X = X+300;

    m_x = event.clientX-9;
    m_y = event.clientY-9;

    if( m_down == 1 && grabbed == 1 ) {
        V = m_x-300-X;
        X = m_x-300;
        if( X > 220 ) {
            X = 220;
            V = 0;
        }
        if( X < -220 ) {
            X = -220;
            V = 0;
        }
    }

}

function mouse_click(event) {

}

function key_press(event) {

    var code = event.keyCode?event.keyCode:event.which;

    switch( code) {
    case 112:
        if( paused == 0 ) {
            clearInterval(int_id);
            paused = 1;
        }	else {
            int_id = setInterval(draw,DT*100);
            paused = 0;
        }
        break;
    }

}

function set_mass() {
    M = m_input.value;
}

function set_friction() {
    C = c_input.value;
}

function set_spring() {
    K = k_input.value;
}