/*
This component, will appear inside a modal, it will be a form that has only 2 fields,
A place to edit / enter the Title.
A place to select a file from your hard drive, upload, convert to base64 and stash in db
It will make calls to different endpoints, the add picture is already created, an edit title endpoint will need to be created
*/
import React, { useState } from 'react';
import { Button, Image, Group, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload } from 'tabler-icons-react';
import { toast } from 'react-toastify';
import { convertToBase64 } from '../../util/convertToBase64';

const dropzoneChildren = (status) => {
    return (
        <Group>
            <Upload size={80} />
            <div>
                <Text size="x1" inline>
                    Drag images here for click to select the image you wish to use for this auction.
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                    Select a single file less than 10MB in size.
                </Text>
            </div>
        </Group>
    )
}

export default function AuctionEdit(props) {

    const { title, id, uploadPicture } = props;
    const [loadingImage, setLoadingImage] = useState(false);
    const [previewPicture, setPreviewPicture] = useState(null);
    const [savingPicture, setSavingPicture] = useState(null);

    const handlePicturePreview = async (file) => {
        //TODO do validiation that this file is not , you know, fucked.
        setLoadingImage(true);
        const base64 = await convertToBase64(file[0]);
        //save it to server here, for now dump to console
        setPreviewPicture(base64);
        setLoadingImage(false);
    }

    const handleUploadPicture = async (base64, id) => {
        setSavingPicture(true);
        let result = await uploadPicture(base64, id);
        if (result.success) {
            //It worked, set preview image, 
            setPreviewPicture(base64);
            setLoadingImage(false);
            setSavingPicture(false);
            toast.success(` Image Saved to Server!`, { autoClose: 2000, position: "top-center"})
        } else {
            //Show error, clear form
            console.log(`Error result`)
            setSavingPicture(false);
            setPreviewPicture(null);
            setLoadingImage(false);
            toast.error(`Got Error saving Image of ${result.message}`)
        }
    }

    const handleRejectedPicture = (file) => {
        console.log(file);
    }



    return (
        <div>
            <Text>{title}</Text>
            <br />
            <Dropzone
                onDrop={(files) => handlePicturePreview(files)}
                onReject={(files) => { handleRejectedPicture(files) }}
                maxSize={10 * 1024 ** 2} //10MB?
                accept={IMAGE_MIME_TYPE}
                loading={loadingImage}
            >
                {(status) => dropzoneChildren(status)}
            </Dropzone>
            <Group>
                <Image src={previewPicture} />
                {previewPicture && <Button loading={savingPicture} onClick={() => handleUploadPicture(previewPicture, id)}>Save Image</Button>}
            </Group>
        </div>
    )
}