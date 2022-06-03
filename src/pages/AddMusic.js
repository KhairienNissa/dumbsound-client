import React, { useState, useEffect } from "react";
import { Alert } from 'react-bootstrap'
import { useMutation } from "react-query";
import axios from "axios";

import NavbarAdmin from '../components/admin/NavbarAdmin'

const API = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL ||
    "https://dumbsound-api.herokuapp.com/api/v1" ||
    "http://localhost:5000/api/v1",
});

export default function AddMusic () {
    const desc = "Add Music";
    document.title = "Dumbsound | " + desc;

    const [message, setMessage] = useState(null);
    const [artiss, setArtiss] = useState([])
    
    // find artis
    const optionArtis = async () => {
        try {
            const response = await API.get(`/artiss`)
            setArtiss (response.data.data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        optionArtis()
    }, [])

    const [form, setForm] = useState({
        title: '',
        year: '',
        thumbnail: '',
        attache: '',
        idArtis: ''
    })
    
    const { title, year, thumbnail, attache, idArtis } = form

    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name] : e.target.id === "attache" ? e.target.files : e.target.value && e.target.id === "thumbnail"? e.target.files:e.target.value
        })
      }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();
            // Configuration
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            };
            console.log(form);
            // Store data with FormData as object
            const formData = new FormData()
            formData.set("title", form.title)
            formData.set("year", form.year)
            formData.set("attache", form.attache[0], form.attache[0].name)
            formData.set("thumbnail", form.thumbnail[0], form.thumbnail[0].name)
            formData.set("idArtis", form.idArtis)
            
            // Insert product data
            const response = await API.post('/music', formData, config)
            console.log(response);

            // if success
            if (response?.data.status == 'success') {
                const alert = (
                    <Alert variant="success" className="py-1 text-center m-auto w-20 mt-5">
                        Success add Music
                    </Alert>
                );
                // make it clear after succes submit
                setForm({
                    title: '',
                    year: '',
                    thumbnail: '',
                    attache: '',
                    idArtis: ''
                })

                setMessage(alert)
            } else {
                const alert = (
                    <Alert variant="danger" className="py-1">
                        {response.data.message}
                    </Alert>
                );    
                setMessage(alert);
            }

        } catch (error) {
            console.log(error);
        }
    });
    
    return(
        <>
            <div className="admin-container text-white">
                <NavbarAdmin />
                {message}
                <form onSubmit={(e) => handleSubmit.mutate(e)} className='mt-5 px-lg-5 px-3'>
                    <h2 className='my-4 fs-sans header-add-music'>Add Music</h2>
                    <div className="row gap-2">

                        <input type="text" className="p-2 bg-grey col-sm-8 border-none borra-2" placeholder='Title' value={title} name='title' onChange={handleChange}/>
                        
                        <div class=" col fs-7 thumbnail">
                            <input class="form-file" id='thumbnail' type='file' onChange={handleChange} name="thumbnail" accept="image/*" hidden/>
                            <label class="input-group-text text-grey" for="thumbnail">Attach Thumbnail<i class='bx bx-paperclip ms-2'></i></label>
                        </div>

                        <input type="text" 
                        className="form-control p-2 bg-grey my-3" placeholder='Year' value={year} name='year' onChange={handleChange}/>
                        
                        <select class="form-select bg-grey mb-3 text-grey1" type='text' onChange={handleChange} value={idArtis} name="idArtis" as="select">
                            <option selected hidden value="">Singer</option>
                            {/* maping artis option */}
                            {artiss?.map((artis) => (
                                <option name="idArtis" value={artis.id}>{artis.name}</option>
                            ))}
                        </select>

                        <div className='attache'>
                            <input id='attache' type="file" class="form-ile" name='attache' onChange={handleChange} hidden/>
                            <label for="attache"  class="w-20 mb-3 input-group-text text-grey attache-input" accept="audio/*">Attache</label>
                        </div>

                    </div>

                    <div className='d-flex justify-content-center my-3'>
                        <button type="submit" className="bg-yellow w-30 text-white fw-500 py-2 borra-3 btn-add-music">Submit</button>
                    </div>
                    
                </form>
            </div>
        </>
    )
}