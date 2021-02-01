
    function pitch2y(pitch, container)
    {
        const middleLine = 59;
        const midiNote = pitch - middleLine;
        const chroma = Math.floor(midiNote) % 12;
        
        const octShift = Number(midiNote < 0);
        const oct = Math.floor( midiNote / 12 );

        const lineOffset =  [ 0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7]; // would be different if using sharps
        const flats =       [ 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0 ];

        const isFlat = flats[ chroma ]
        console.log(isFlat);

    }


    pitch2y(61.5);

    pitch2y(60);
    pitch2y(59);


