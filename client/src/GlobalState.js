import axios from "axios";
import React, { useReducer, useMemo } from 'react';
import globalStateReducer from './GlobalStateReducer';
import { useAuth0 } from '@auth0/auth0-react';
export const GlobalStateContext = React.createContext();

const initalState = {
    id_token: null,
    base_URL: "https://59ri3t8ope.execute-api.ca-central-1.amazonaws.com/dev/"
};
let id_token;
let userDetails;

export const GlobalStateProvider = (props) => {
    const [state, dispatch] = useReducer(globalStateReducer, initalState);
    const { isAuthenticated, getIdTokenClaims } = useAuth0();

    const setIDToken = async () => {
        let token = await getIdTokenClaims();
        //console.log(JSON.stringify(token));
        let idToken = token.__raw;
        userDetails = token;
        console.log(`userDetail is now ${JSON.stringify(userDetails)}`)
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        id_token = idToken;
    }

    if (isAuthenticated) {
        console.log(`isAuthenticated just flipped true in globalcontext `);
        setIDToken();
    }
    const updateSomething = () => {
        //STUB
        dispatch({ action: 'doAthing', payload: 'A Thing' });
    }
    const placeBid = async (amount, id) => {

        try {
            let result = await axios.patch(`auction/${id}/bid`, { amount });
            return result.data;
        } catch (err) {
            console.err(err);
        }
    }

    const uploadPicture = async (base64PictureData, auctionID) => {
        //Validate that the data is present and id is present then upload
        const data = JSON.stringify({ base64Data: base64PictureData });
        try {
            //let result = await axios.patch(`/auction/${auctionID}/picture`, data);
            let result = await fetch(initalState.base_URL + `/auction/${auctionID}/picture`, {
                method: 'PATCH',
                headers: {
                    'Authorization': id_token
                },
                body: data,
            });
            console.log(result);
        } catch (err) {
            console.log(`Success uploading picture ${err}`);
            return { success: true, message: 'Figure this out later' }
        }



    }

    const value = useMemo(() => {
        return { state, placeBid, uploadPicture, updateSomething, userDetails }
    }, [state]);

    console.log(`Global State initalized.`);

    return (
        <GlobalStateContext.Provider value={value}>
            {props.children}
        </GlobalStateContext.Provider>
    )
}