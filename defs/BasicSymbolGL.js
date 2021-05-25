const Template = require('./SymbolTemplate') 

class BasicSymbolGL extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "BasicSymbolGL";
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                x: 100,
                y: 100,
                width: 100,
                height: 100
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                width: 25,
                height: 25
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "foreignObject",
            id: `${params.id}-htmlWrapper`,
            class: "htmlWrapper",
            x: params.x,
            y: params.y,
            width: params.width,
            height: params.height,
            children: {
                new: "html:canvas",
                id: `${params.id}-canvas`,
                class: "basicGL-canvas"
            }
        }

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const foreignObject = element.querySelector('.display .htmlWrapper');
        
        const bbox = ui_api.getBBoxAdjusted(foreignObject);

        return {
            id: element.id,
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height
        }


    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `${this.class}-palette-icon`,
                class: this.class
            })
        }
    }

    updateAfterContents( element )
    {
        const canvas = element.querySelector(`#${element.id}-canvas`);

        const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true  });
        renderer.setClearColor( 0x000000, 0 ); // the default

        const fov = 75;
        const aspect = 1;  // the canvas default
        const near = 0.1;
        const far = 5;

        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;

        const controls = new OrbitControls( camera, renderer.domElement );

        const scene = new THREE.Scene();

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        const wireframe = new THREE.WireframeGeometry( geometry );
        const cube = new THREE.LineSegments( wireframe );
        cube.material.depthTest = false;
        cube.material.opacity = 1;
        cube.material.transparent = true;
        cube.material.color =  new THREE.Color( 'rgb(100,100,100)' );

        scene.add( cube );

/*
        //  const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue
        const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue


        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
*/
        function render(time) {
            time *= 0.001;  // convert time to seconds
    /*
            cube.rotation.x = time;
            cube.rotation.y = time;
    */
            controls.update();
            renderer.render(scene, camera);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);


    }


    fromData(dataObj, container, preview = false)
    {
        super.fromData(dataObj, container, preview);

        if(!preview){
            console.log(dataObj, document.getElementById(dataObj.id));
            this.updateAfterContents( document.getElementById(dataObj.id) );
        }
    }


     // here we're avoiding asking the parent for information
    // but still using the template system
    // probably it would be better to stick to the template, and
    // create a graphic only container
    dataToViewParams(data, container)
    {
        data.container = container.id;
        return data;
    }

    viewParamsToData(viewParams, container)
    {
        viewParams.container = container.id;
        return viewParams;
    }

    mouseToData( event, container )
    {
        const pt = ui_api.getSVGCoordsFromEvent(event);

        return {
            ...this.structs.data, // set defaults, before overwriting with parent's mapping
            ...pt,
            id: `${this.class}_u_${ui_api.fairlyUniqueString()}`,
            container: container.id
        }    
    }

}

class BasicSymbolGL_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "BasicSymbolGL";
    }
    
}



module.exports = {
    ui_def: BasicSymbolGL,
    io_def: BasicSymbolGL_IO    
}

