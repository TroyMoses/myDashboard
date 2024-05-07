'use client'

import { useRef, useState } from 'react';
import PhotoCard from './PhotoCard';
import ButtonSubmit from './ButtonSubmit';
import styles from '../app/ui/dashboard/products/addProduct/addProduct.module.css';
import { uploadPhoto } from '../actions/UploadActions';

const UploadForm = () => {
    const formRef = useRef();
    const [files, setFiles] = useState([])

    async function handleInputFiles(e) {
        const files = e.target.files;
        
        const newFiles = [...files].filter(file => {
            if (file.size < 1024*1024 && file.type.startswith('image/')) {
                return file;
            }
        })

        setFiles(prev => [...newFiles, ...prev])
    }

    async function handleUpload(event) {
        event.preventDefault();

        const formData = new FormData();

        const imageFile = event.target.elements.files[0]; // Get the first selected image

        if (!imageFile) return alert("No image file is selected");

        formData.append('title', document.querySelector('input[name="title"]').value);
        formData.append('category', document.querySelector('select[name="cat"]').value);
        formData.append('desc', document.querySelector('textarea[name="desc"]').value);
        formData.append('price', document.querySelector('input[name="price"]').value);
        formData.append('stock', document.querySelector('input[name="stock"]').value);
        formData.append('color', document.querySelector('input[name="color"]').value);
        formData.append('size', document.querySelector('input[name="size"]').value);

        // Read image data using FileReader
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = async (event) => {
            const imageData = event.target.result; // Base64 encoded image data
            formData.append('image', imageData); // Add image data to FormData
            await uploadPhoto(formData); // Call function to save to MongoDB
        };

        // const res = await uploadPhoto(formData);
    }

    return (
        
        <div className={styles.container}>
            <form action={handleUpload} ref={formRef} className={styles.form}>
            <input type="text" placeholder="title" name="title" required />
            <select name="cat" id="cat">
                <option value="general">Choose a Category</option>
                <option value="kitchen">Kitchen</option>
                <option value="phone">Phone</option>
                <option value="computer">Computer</option>
            </select>
            <input type="number" placeholder="price" name="price" required />
            <input type="number" placeholder="stock" name="stock" required />
            <input type="text" placeholder="color" name="color" />
            <input type="text" placeholder="size" name="size" />
            <textarea
                required
                name="desc"
                id="desc"
                rows="16"
                placeholder="Description"
            ></textarea>
            <div style={{background: '#ddd', minHeight: 200, margin: '10px 0', padding:10}}>
                <input type='file' accept='image/*' multiple onChange={handleInputFiles}/>
                <h5 style={{color: 'red'}}>
                    (*) Only accept image file less than 1mb in size. Upto 3 photo files
                </h5>

                {/* Preview Images */}
                <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', margin: '10px 0'}}>
                    {
                        files.map((file, index) => (
                            <PhotoCard key={index} url={URL.createObjectURL(file)}/>
                        ))
                    }
                </div>
            </div>

            <ButtonSubmit value="Upload Product"/>
            {/* <button type='submit'>Upload Product</button> */}
            </form>
        </div>
    )
    // return (
    //     <form action={handleUpload} ref={formRef}>

    //     <div style={{background: '#ddd', minHeight: 200, margin: '10px 0', padding:10}}>
    //         <input type='file' accept='image/*' multiple onChange={handleInputFiles}/>
    //         <h5 style={{color: 'red'}}>
    //             (*) Only accept image file less than 1mb in size. Upto 3 photo files
    //         </h5>

    //         {/* Preview Images */}
    //         <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', margin: '10px 0'}}>
    //             {
    //                 files.map((file, index) => (
    //                     <PhotoCard key={index} url={URL.createObjectURL(file)}/>
    //                 ))
    //             }
    //         </div>
    //     </div>

    //     <ButtonSubmit value="Upload to Cloudinary"/>

    //     </form>
    // )
}

export default UploadForm;