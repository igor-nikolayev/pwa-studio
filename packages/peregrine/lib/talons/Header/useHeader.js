import { useCallback } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import {gql, useQuery} from "@apollo/client";

const STORE_NAME_QUERY = gql`
    query getStoreName {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            header_logo_src
            id
            logo_alt
            logo_height
            logo_width
        }
    }
`;

export const useHeader = () => {
    const [{ hasBeenOffline, isOnline, isPageLoading }] = useAppContext();
    const {
        elementRef: searchRef,
        expanded: isSearchOpen,
        setExpanded: setIsSearchOpen,
        triggerRef: searchTriggerRef
    } = useDropdown();

    const { data: logoData } = useQuery(STORE_NAME_QUERY);

    const handleSearchTriggerClick = useCallback(() => {
        // Toggle the Search input form.
        setIsSearchOpen(isOpen => !isOpen);
    }, [setIsSearchOpen]);

    return {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isPageLoading,
        isSearchOpen,
        searchRef,
        searchTriggerRef,
        logoData
    };
};
