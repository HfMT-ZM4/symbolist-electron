


let x_scroll_div = document.getElementById('x_scrollbar');
let x_handle = document.getElementById('x_location');

let y_scroll_div = document.getElementById('y_scrollbar');
let y_handle = document.getElementById('y_location');


let handle_selected = null;


function handle_move(event)
{
    if( event.buttons == 1 && handle_selected )
    {
        if( handle_selected == x_handle )
        {
            x_handle.style.left = `${event.clientX - 63}px`;
        }
        else if( handle_selected == y_handle )
        {
            y_handle.style.top = `${event.clientY}px`;
        }
            
    }
}

function handle_up(event)
{
    handle_selected = null;
    window.removeEventListener("mouseup", handle_up, true );
    window.removeEventListener("mousemove", handle_move, true );
    symbolist.startDefaultEventHandlers();
}

document.querySelectorAll('.scrollbar_handle').forEach( el => {

    el.addEventListener("mousedown", (event) => {
        symbolist.stopDefaultEventHandlers();

        handle_selected = event.target.closest('.scrollbar_handle');
        window.addEventListener("mousemove", handle_move, true );
        window.addEventListener("mouseup", handle_up, true );
    })
    
})



document.querySelectorAll('.scrollbar').forEach( el => {

    el.addEventListener("mouseenter", ()=> {
        window.addEventListener("mousemove", handle_move, true );
        window.addEventListener("mouseup", handle_up, true );
    })

})
