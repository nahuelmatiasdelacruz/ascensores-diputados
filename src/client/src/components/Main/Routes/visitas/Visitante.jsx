import React from 'react';

const Visitante = ({data}) => {
    return(
        <div className='visitante'>
            <img src={data.foto} alt='profile photo'/>
            <div className='profile-details'>
                
            </div>
        </div>
    )    
}

export default Visitante;