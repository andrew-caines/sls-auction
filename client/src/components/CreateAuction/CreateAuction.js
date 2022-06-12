import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from '@mantine/form';
import { Text, Group, Button, Box, TextInput, Image } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { convertToBase64 } from '../../util/convertToBase64';
import { Upload } from 'tabler-icons-react';
import { toast, ToastContainer, } from 'react-toastify';
import axios from 'axios';

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

export default function CreateAuction(props) {
    const [loadingImage, setLoadingImage] = useState(false);
    const [previewPicture, setPreviewPicture] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    let navigate = useNavigate();

    const form = useForm({
        initialValues: {
            title: '',
            pictureData: '',
        },
        validate: {
            title: (value) => (value.length < 5 ? 'The title must be greater than 5 characters' : null),
        }
    });

    const handlePicturePreview = async (file) => {
        //TODO do validiation that this file is not , you know, fucked.
        setLoadingImage(true);
        const base64 = await convertToBase64(file[0]);
        //save it to server here, for now dump to console
        setPreviewPicture(base64);
        setLoadingImage(false);
    }

    const handleSubmit = async () => {
        setIsSaving(true);
        const { title } = form.values;
        console.log(title, previewPicture);
        //Save the data to the Server, and notify user, and navigate to All OPEN auctions
        try {
            let result = await axios.post(`/auction`, {
                title,
                base64Data: previewPicture
            });
            console.log(result)
            form.reset();
            setPreviewPicture(null);
            setIsSaving(false);
            toast.success(
                `Your auction was succesfully created! It will end @ ${new Date(result.data.auction.endingAt).toLocaleTimeString('en-us')}`,
                {
                    autoClose: 1500,
                    onClose: () => navigate('/allauctions')
                })


        } catch (err) {
            setIsSaving(false);
            console.error(err);
            toast.error(`Error saving Auction: ${err}`);
        }

    }
    const handleRejectedPicture = () => { }

    return (

        <Box sx={{ maxWidth: 600, maxHeight: '75vh' }} mx="lg">
            <form onSubmit={() => handleSubmit()}>
                <TextInput
                    required
                    label="Auction Title"
                    placeholder="Describe your item"
                    {...form.getInputProps('title')}
                />
                <Dropzone
                    onDrop={(files) => handlePicturePreview(files)}
                    onReject={(files) => { handleRejectedPicture(files) }}
                    maxSize={10 * 1024 ** 2} //10MB?
                    accept={IMAGE_MIME_TYPE}
                    loading={isSaving || loadingImage} 
                >
                    {(status) => dropzoneChildren(status)}
                </Dropzone>
                <Group position="right">
                    <Image src={previewPicture} height={450} width={600} fit="contain" />
                    <Button color="teal" onClick={() => handleSubmit()}>Save Auction</Button>
                </Group>
            </form>
            <ToastContainer />
        </Box>
    )
}