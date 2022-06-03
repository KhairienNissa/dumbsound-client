import * as React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import { Navbar } from 'react-bootstrap';

const path = "https://res.cloudinary.com/dtowni8oi/video/upload/v1654210892/"||
            "http://localhost:5000/uploads/"

const pathImg = "https://res.cloudinary.com/dtowni8oi/image/upload/v1654210892/"

export default function MusicPlayer({playMusic}) {
    console.log(playMusic);
    return (
        <div>
            <Navbar className="fixed-bottom navplay d-flex">
                <div className="d-flex w-50 justify-content-center ms-2">
                    <img src={pathImg + playMusic.thumbnail} alt="artis" className="image-music rounded-circle object-fit" width={50} height={50}/>
                    <p className="text-white ms-sm-3 ms-1 mb-0 title-music">{(playMusic.title.length > 8) ? playMusic.title.slice(0, 8) + '...' : playMusic.title} <br/> <span className='fs-8'>{playMusic.artis.name}</span> </p>
                </div>
                <AudioPlayer
                    src={path + playMusic.attache}
                    showFilledVolume={true}
                />
            </Navbar>
        </div>
    )
}
