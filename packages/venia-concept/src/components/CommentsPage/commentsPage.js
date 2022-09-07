import React from "react";
import { Redirect } from 'react-router-dom';
import { useUserContext} from "@magento/peregrine/lib/context/user";

const CommentsPage = () => {
    const [{ isSignedIn }] = useUserContext();
    return (
        <div>
            {!isSignedIn ? <Redirect to={'/'} /> : <p>Hello</p>}
        </div>

    )
}

export default CommentsPage;
