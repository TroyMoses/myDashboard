'use server'

import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import cloudinary from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

async function savePhotosToLocal(formData) {
    const files = formData.getAll('files')

    const multipleBuffersPromise = files.map(file => (
        files.arrayBuffer()
            .then(data => {
                const buffer = Buffer.from(data);
                const name = uuidv4();
                const ext = file.type.split("/")[1];

                // const uploadDir = path.join(process.cwd(), "public", `/${name}.${ext}`)
                // Doesnt work in vercel
                
                const tempdir = os.tmpdir();
                const uploadDir = path.join(tempdir, `/${name}.${ext}`) // Works in vercel

                fs.writeFile(uploadDir, buffer)

                return { filepath: uploadDir, filename: file.name}
            })
    ))

    return await Promise.all(multipleBuffersPromise)
}

async function uploadPhotosToCloudinary(newFiles) {
    const multiplePhotosPromise = newFiles.map(file => (
        cloudinary.v2.uploader.upload(file.filepath, { folder: 'nextjs_upload'})
    ))

    return await Promise.all(multiplePhotosPromise)
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

export async function uploadPhoto(formData) {
    try {
        // Save photo files to temp folder 
        const newFiles = await savePhotosToLocal(formData)

        // Upload to the cloud after saving the files to the temp folder
        const photos = await uploadPhotosToCloudinary(newFiles)

        // Delete photo files in temp folder after successful upload
        newFiles.map(file => fs.unlink(file.filepath))

        // Delay bout 2s to update cloudinary database then revalidatePath => call getAllPhotos()
        // await delay(2000)

        // revalidatePath('/dashboard/products')
        return { msg: 'Upload Success' }


    } catch (error) {
        return { errMsg: error.message }
    }
}

export async function getAllPhotos() {
    try {
        const { resources } = await cloudinary.v2.search.expression(
            'folder:nextjs_upload/*'
        ).sort_by('created_at', 'desc').max_results(500).execute()
        
        return resources;
    } catch (error) {
        return { errMsg: error.message }
    }
}

export async function deletePhoto(public_id) {
    try {
        await cloudinary.v2.uploader.destroy(public_id)

        revalidatePath("dashboard/products")
        return {msg: 'Delete Success!'};
    } catch (error) {
        return { errMsg: error.message }
    }
}


export async function revalidate(path){
    revalidatePath(path)
}
